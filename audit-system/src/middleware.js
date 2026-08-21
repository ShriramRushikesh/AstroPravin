import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'demo-secret-key-change-this-in-prod-12345');

export async function middleware(req) {
    const token = req.cookies.get('access_token')?.value;
    const { pathname } = req.nextUrl;

    // Paths that are always public
    if (pathname === '/login' || pathname.startsWith('/api/auth') || pathname === '/') {
        // If user is logged in, redirect to dashboard? 
        // For now, let landing page handle it (or redirect / to /login)
        if (pathname === '/') return NextResponse.redirect(new URL('/login', req.url));
        return NextResponse.next();
    }

    // Static files check (images, etc)
    if (pathname.includes('.') || pathname.startsWith('/_next')) return NextResponse.next();

    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
        const { payload } = await jwtVerify(token, SECRET);
        const role = payload.role;

        // RBAC Logic
        if (pathname.startsWith('/super-admin') && role !== 'SUPER_ADMIN') {
            console.log('⛔ RBAC Violation: Use', role, 'tried super-admin');
            return NextResponse.redirect(new URL('/login', req.url));
        }
        if (pathname.startsWith('/auditor') && role !== 'ASSOCIATE_AUDITOR') {
            return NextResponse.redirect(new URL('/login', req.url));
        }
        if (pathname.startsWith('/college') && role !== 'COLLEGE') {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        return NextResponse.next();
    } catch (err) {
        console.error('Token verification failed:', err.message);
        const logout = NextResponse.redirect(new URL('/login', req.url));
        logout.cookies.delete('access_token');
        return logout;
    }
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

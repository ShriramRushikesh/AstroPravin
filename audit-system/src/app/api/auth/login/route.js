import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        // 1. Find User
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // 2. Verify Password
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // 3. Create Payload (The "Passport")
        const payload = {
            sub: user.id,
            name: user.full_name,
            role: user.role,
            college_id: user.college_id, // Important for Isolation
        };

        // 4. Sign Token
        const token = await new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(SECRET);

        // 5. Create Response & Set Cookie
        const response = NextResponse.json({ success: true, user: payload });

        response.cookies.set('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
        });

        // 6. Log the Action (Audit Trail)
        // We fire and forget this for speed, or wait if strict. For now, fire & forget pattern.
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        pool.query(
            `INSERT INTO audit_logs (user_id, action_type, resource_entity, details, ip_address)
       VALUES (?, 'LOGIN_SUCCESS', 'USER', ?, ?)`,
            [user.id, JSON.stringify({ email: user.email }), ip]
        ).catch(err => console.error('Audit Log Error:', err)); // Non-blocking logging

        return response;

    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json({ error: 'Internal User Error' }, { status: 500 });
    }
}

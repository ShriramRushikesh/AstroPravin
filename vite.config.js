import path from "path";
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        host: '127.0.0.1',
        strictPort: true,
        watch: {
            ignored: [
                '**/server/**',
                '**/server-express-backup/**',
                '**/audit-system/**',
                '**/audit-system*/**',
                '**/logs/**',
                '**/.git/**',
                '**/node_modules/**',
            ],
        },
    },
    optimizeDeps: {
        entries: ['index.html', 'src/**/*.{js,jsx}'],
        include: [
            'react',
            'react-dom',
            'react-router-dom',
            'react-helmet-async',
            'framer-motion',
            'lucide-react',
            'clsx',
            'tailwind-merge'
        ],
        exclude: [
            'express',
            'mongoose',
            'twilio',
            'nodemailer',
            'pdfkit',
            'bcryptjs',
            'jsonwebtoken'
        ],
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor-react': ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
                    'vendor-motion': ['framer-motion'],
                    'vendor-icons': ['lucide-react'],
                },
            },
        },
        chunkSizeWarningLimit: 800,
        sourcemap: false,
    },
});

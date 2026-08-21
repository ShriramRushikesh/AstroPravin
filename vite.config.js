import path from "path";
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        {
            name: 'copy-ads-txt',
            closeBundle() {
                try {
                    const src = path.resolve(__dirname, 'public/ads.txt');
                    const dest = path.resolve(__dirname, 'dist/ads.txt');
                    if (fs.existsSync(src)) {
                        fs.copyFileSync(src, dest);
                        console.log('Successfully copied ads.txt to dist/');
                    }
                } catch (e) {
                    console.error('Failed to copy ads.txt:', e);
                }
            }
        }
    ],

    server: {
        port: 5173,
        host: true, // Expose to network (0.0.0.0)
        watch: {
            ignored: [
                '**/server/**',
                '**/server-express-backup/**',
                '**/audit-system/**',
                '**/dist/**',
                '**/public/kundlis/**',
                '**/public/matrimony-photos/**',
                '**/.git/**'
            ]
        }
    },
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'react-router-dom',
            'react-helmet-async',
            'framer-motion',
            'lucide-react'
        ]
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // Core React — cached long-term, rarely changes
                    'vendor-react': ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
                    // Three.js stack — heavy (~500KB), only needed for StarField on landing page
                    'vendor-three': ['three', '@react-three/fiber', '@react-three/drei', 'maath'],
                    // Framer Motion — moderate size, used across pages
                    'vendor-motion': ['framer-motion'],
                    // Icons — loaded on demand
                    'vendor-icons': ['lucide-react'],
                },
            },
        },
        chunkSizeWarningLimit: 600, // Reduced from 1600 to catch regressions
        // Enable source maps for debugging in production (optional)
        sourcemap: false,
    },
})

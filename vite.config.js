import path from "path";
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            react: path.resolve(__dirname, './node_modules/react'),
            'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
        },
    },
    server: {
        host: true // Expose to network (0.0.0.0)
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

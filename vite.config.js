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
                manualChunks: undefined // Let Vite/Rollup handle chunking automatically to prevent context breakage
            }
        },
        chunkSizeWarningLimit: 1600 // Increased limit to suppress warnings for now
    }
})

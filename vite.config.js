import path from "path";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('three') || id.includes('@react-three')) {
                            return 'three-vendor';
                        }
                        if (id.includes('react') || id.includes('react-dom') || id.includes('framer-motion')) {
                            return 'react-vendor';
                        }
                        return 'vendor';
                    }
                }
            }
        },
        chunkSizeWarningLimit: 1000 // Increase limit slightly to avoid minor warnings
    }
})

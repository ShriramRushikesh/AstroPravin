import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
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
                        return 'vendor';
                    }
                }
            }
        },
        chunkSizeWarningLimit: 1000 // Increase limit slightly to avoid minor warnings
    }
})

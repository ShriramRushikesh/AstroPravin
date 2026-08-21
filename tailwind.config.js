/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Luxury Light Indian Art Palette
                canvas: {
                    DEFAULT: '#FAF8F5',
                    card: '#FFFFFF',
                    subtle: '#F5F0E8',
                    parchment: '#FCFBF8',
                    warm: '#FFFDF9',
                },
                terracotta: {
                    DEFAULT: '#C2410C',
                    light: '#EA580C',
                    dark: '#9A3412',
                    50: '#FFF7ED',
                    100: '#FFEDD5',
                    200: '#FED7AA',
                    500: '#F97316',
                    600: '#EA580C',
                    700: '#C2410C',
                    800: '#9A3412',
                    900: '#7C2D12',
                },
                saffron: {
                    DEFAULT: '#D97706',
                    light: '#F59E0B',
                    dark: '#B45309',
                    50: '#FFFBEB',
                    100: '#FEF3C7',
                    500: '#F59E0B',
                    600: '#D97706',
                    700: '#B45309',
                },
                gold: {
                    DEFAULT: '#D97706',
                    amber: '#B45309',
                    shimmer: '#F59E0B',
                    border: '#EADCC8',
                    accent: '#FDE68A',
                },
                charcoal: {
                    DEFAULT: '#1C1917',
                    light: '#44403C',
                    muted: '#78716C',
                    border: '#E7E5E4',
                },
                // Legacy compatibility tokens mapped to luxury light
                primary: '#C2410C', // Terracotta
                secondary: '#D97706', // Saffron Gold
                'hero-saffron': '#C2410C',
                'hero-gold': '#D97706',
                'cosmic-blue': '#FAF8F5',
                void: '#FAF8F5',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            },
            boxShadow: {
                'luxury': '0 4px 20px -2px rgba(194, 65, 12, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
                'luxury-hover': '0 10px 30px -4px rgba(194, 65, 12, 0.14), 0 4px 10px -2px rgba(0, 0, 0, 0.05)',
                'parchment': '0 2px 12px 0 rgba(194, 65, 12, 0.05)',
            },
        },
    },
    plugins: [],
}

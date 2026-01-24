/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                saffron: '#FF9933',
                gold: '#FFD700',
                'hero-saffron': '#FF9933',
                'hero-gold': '#FFD700',
                primary: '#FFD700', // Gold
                secondary: '#FF9933', // Saffron
                'cosmic-blue': '#0F172A',
                void: '#000000',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            },
        },
    },
    plugins: [],
}

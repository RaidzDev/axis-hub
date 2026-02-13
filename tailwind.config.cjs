/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0E1117',
                surface: '#111827',
                primary: {
                    DEFAULT: '#2563EB', // Azul principal
                    hover: '#3B82F6',   // Azul hover
                },
                secondary: '#9CA3AF', // Texto secundário
                cta: {
                    DEFAULT: '#F59E0B', // Laranja
                },
                border: 'rgba(255,255,255,0.06)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            container: {
                center: true,
                padding: '1.5rem',
                screens: {
                    sm: '100%',
                    md: '100%',
                    lg: '1024px',
                    xl: '1200px',
                },
            },
            borderRadius: {
                'xl': '16px',
                '2xl': '18px',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
            }
        },
    },
    plugins: [],
}

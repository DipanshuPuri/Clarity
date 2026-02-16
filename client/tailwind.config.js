/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0D1117",
                surface: "#161B22",
                border: "#30363D",
                secondary: "#2EC4C6", // Using "secondary" as the primary brand accent
                muted: "#8B949E",
                success: "#238636",
                danger: "#DA3633",
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'glass': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'glow': '0 0 15px rgba(46, 196, 198, 0.3)',
            },
        },
    },
    plugins: [],
}

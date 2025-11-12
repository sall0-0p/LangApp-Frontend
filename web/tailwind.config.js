/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],

    // This is the custom theme stuff from your design
    theme: {
        extend: {
            colors: {
                'brand-yellow': '#FACC15', // or whatever your yellow-400 is
            }
        },
    },
    plugins: [],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: [
        // Or if using `src` directory:
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    corePlugins: {
        preflight: false,
    },
    plugins: [],
};

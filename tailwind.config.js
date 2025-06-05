/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}", // Include all JS/JSX/TS/TSX files in the pages folder
    "./src/**/*.{js,jsx,ts,tsx}", // Include all JS/JSX/TS/TSX files in the src folder
    "./node_modules/flowbite/**/*.js" // Important pour que Tailwind scanne les classes Flowbite
  ],
  darkMode: 'media', // Enables system theme detection
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin') // Ajout du plugin Flowbite
  ],
}
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{svelte,js,ts}'],
  purge: ['./index.html', './src/**/*.{svelte,js,ts}'], // for unused CSS
  theme: {
    extend: {},
  },
  plugins: [],
};

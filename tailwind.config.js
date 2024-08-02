/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        Kodchasan: ["Kodchasan", 'sans-serif']
      },
      colors: {
        "light": "#ffee99"
      }
    }
  },
  plugins: []
};
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue"
  ],
  theme: {
    extend: {
      colors: {
        'cosmic-blue': '#1e40af',
        'cosmic-purple': '#7c3aed',
        'cosmic-gold': '#f59e0b',
        'cosmic-silver': '#6b7280'
      },
      fontFamily: {
        'cosmic': ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Force legacy color format for html2canvas compatibility
  future: {
    respectDefaultRingColorOrder: false,
  },
  // Disable modern color functions
  corePlugins: {
    preflight: true,
  },
}

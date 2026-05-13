/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#000000',
          card: '#0a0a0a',
          surface: '#111111',
        },
        green: {
          main: '#00C853',
          bright: '#00E676',
          mid: '#00B359',
        },
        text: {
          primary: '#ffffff',
          muted: '#888888',
        },
        border: 'rgba(0, 200, 83, 0.1)',
        alert: {
          red: '#f87171',
        },
        gold: '#fbbf24',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        syne: ['"Syne"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

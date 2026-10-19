/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#0f261d',
          dark: '#0a1a14',
          surface: '#153328',
          hover: '#1b3f32',
          border: '#245241',
          light: '#2a5e4b'
        },
        sage: {
          DEFAULT: '#2d6046',
          hover: '#244e39',
          light: '#eef5f0',
          medium: '#d8e8dc',
          border: '#c2dac9',
          text: '#1c4530'
        },
        ivory: {
          DEFAULT: '#fbf9f4',
          subtle: '#f5f2e9',
          dark: '#eae5d7',
          border: '#e7e2d4'
        },
        gold: {
          DEFAULT: '#b88628',
          hover: '#a0731e',
          light: '#fdf9ee',
          border: '#f4e0b5',
          text: '#825c13'
        },
        charcoal: {
          DEFAULT: '#19221e',
          light: '#2a3630',
          muted: '#5a6861'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(15, 38, 29, 0.04)',
        'card': '0 1px 3px rgba(15, 38, 29, 0.05), 0 10px 24px -4px rgba(15, 38, 29, 0.04)',
        'popover': '0 10px 30px -5px rgba(15, 38, 29, 0.12), 0 4px 12px -2px rgba(15, 38, 29, 0.08)',
      }
    },
  },
  plugins: [],
}

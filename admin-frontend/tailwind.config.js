/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#15803D',
          dark: '#166534',
          light: '#DCFCE7',
        },
        'page-bg': '#F8FAF9',
        'status-approved': '#15803D',
        'status-pending': '#D97706',
        'status-rejected': '#DC2626',
        'status-under-review': '#2563EB',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

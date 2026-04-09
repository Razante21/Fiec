/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        fiec: {
          bg: '#0d1a26',
          surface: '#1e3a52',
          surface2: '#162a3d',
          surface3: '#112030',
          accent: '#f5a623',
          'blue-hl': '#4a9eca',
          green: '#3dba7e',
          red: '#e05c5c',
          yellow: '#f5c842',
          text: '#ffffff',
          'text-sub': '#8fb3cc',
        }
      },
      fontFamily: {
        barlow: ['Barlow', 'sans-serif'],
        'barlow-condensed': ['Barlow Condensed', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
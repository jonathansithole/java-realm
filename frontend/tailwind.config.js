/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', 
  
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Your existing extensions...
      colors: {
        brand: {
          primary: '#6366f1', // Indigo
          secondary: '#10b981', // Emerald
          dark: '#0f172a', // Slate 900
          card: '#1e293b' // Slate 800
        }
      }
    },
  },

  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
       keyframes: {
        bgScroll: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '100px 100px' },
        },
      },
      animation: {
        bgScroll: 'bgScroll 30s linear infinite',
      },
      colors: {
        'brand-background': '#F5F1EC', // Warm, off-white beige
        'brand-card': '#FFFFFF',      // The white of the login card
        'brand-dark': '#3D3D3D',       // The dark charcoal text color
        'brand-primary': '#D97757',   // The main terracotta/orange button color
        'brand-secondary': '#6B7F93',  // The muted blue-gray for accents
        'brand-gray': '#A9A9A9',      // Lighter gray for text/borders
      },
      fontFamily: {
        // You can add a custom font here later if you wish
        // sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
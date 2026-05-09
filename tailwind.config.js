/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          app: 'var(--bg-app)',
          document: 'var(--bg-document)',
          desk: 'var(--bg-desk)',
        },
        toolbar: {
          bg: 'var(--toolbar-bg)',
          border: 'var(--toolbar-border)',
          hover: 'var(--toolbar-hover)',
        },
        accent: {
          primary: '#C9973A', // Gold
          secondary: '#1A7A6E', // Teal
          dialectBg: 'rgba(26, 122, 110, 0.1)',
        },
        text: {
          dark: 'var(--text-dark)',
          document: 'var(--text-document)',
          muted: 'var(--text-muted)',
        },
        dialect: {
          highlight: 'rgba(255, 215, 0, 0.25)',
          underline: '#FFD700',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Nunito', 'sans-serif'],
        document: ['"Noto Sans Sinhala"', 'sans-serif'],
      },
      boxShadow: {
        'document': '0 4px 24px rgba(0,0,0,0.4)',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translate(-50%, 20px)', opacity: '0' },
          '100%': { transform: 'translate(-50%, 0)', opacity: '1' },
        },
        'fade-in-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.2s ease-out forwards',
      }
    },
  },
  plugins: [],
}

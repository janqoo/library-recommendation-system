/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // --- Paper + Wood + Ink (University Library) ---
        paper: '#f7f1eb',
        paper2: '#fbf7f3',
        header: '#efe3d6',
        line: '#e6d8cb',
        ink: '#2b2a28',
        muted: '#6e6a64',

        // Wood scale (also used as the new "primary" theme)
        wood: {
          50:  '#fbf7f2',
          100: '#f3eadf',
          200: '#e7d6c4',
          300: '#d7bca1',
          400: '#c8a47a',
          500: '#b88f67',
          600: '#a57c58',
          700: '#8d6648',
          800: '#73523c',
          900: '#5e4332',
        },

        primary: {
          50:  '#fbf7f2',
          100: '#f3eadf',
          200: '#e7d6c4',
          300: '#d7bca1',
          400: '#c8a47a',
          500: '#b88f67',
          600: '#a57c58',
          700: '#8d6648',
          800: '#73523c',
          900: '#5e4332',
        },

        // Compatibility: map old violet/indigo usage to wood tones
        violet: {
          50:  '#fbf7f2',
          100: '#f3eadf',
          200: '#e7d6c4',
          300: '#d7bca1',
          400: '#c8a47a',
          500: '#b88f67',
          600: '#a57c58',
          700: '#8d6648',
          800: '#73523c',
          900: '#5e4332',
        },
        indigo: {
          50:  '#f9f6f1',
          100: '#efe6db',
          200: '#e1d1bf',
          300: '#cfb495',
          400: '#bb966a',
          500: '#a57c58',
          600: '#8d6648',
          700: '#73523c',
          800: '#5e4332',
          900: '#4d372b',
        },
      },

      fontFamily: {
        serif: ['"Playfair Display"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },

      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      boxShadow: {
        soft: '0 10px 30px rgba(43, 42, 40, 0.10)',
        card: '0 18px 50px rgba(43, 42, 40, 0.12)',
        // Keep names used elsewhere (but make them neutral)
        glow: '0 10px 30px rgba(43, 42, 40, 0.10)',
        'glow-lg': '0 18px 50px rgba(43, 42, 40, 0.12)',
      },
    },
  },
  plugins: [],
};

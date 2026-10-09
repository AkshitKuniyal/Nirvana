/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          indigo:          "#4F46E5",
          indigoLight:     "#818CF8",
          indigoSoft:      "#EEF2FF",
          coral:           "#E07A5F",
          coralLight:      "#FB7185",
          coralSoft:       "#FFF1F2",
          amber:           "#D97706",
          amberLight:      "#FBBF24",
          amberSoft:       "#FFFBEB",
          sage:            "#2D6A4F",
          sageLight:       "#52B788",
          sageSoft:        "#F0FDF4",
          stone:           "#FAF8F5",
          stoneDark:       "#1C1917",
          muted:           "#78716C",
          border:          "#E7E5E4",
        },
        nirvana: {
          bg:             "#FAF8F5",
          surface:        "#FFFFFF",
          border:         "#E7E5E4",
          text:           "#1C1917",
          muted:          "#78716C",
          // Backward compatibility mappings
          lavender: {
            DEFAULT: "#4F46E5",
            light:   "#818CF8",
            soft:    "#EEF2FF",
            deep:    "#3730A3",
          },
          mint: {
            DEFAULT: "#2D6A4F",
            soft:    "#F0FDF4",
          },
          cream: {
            DEFAULT: "#FAF8F5",
            soft:    "#FFFFFF",
          },
        },
      },
      fontFamily: {
        display:  ['"Fraunces"', '"Playfair Display"', 'Georgia', 'serif'],
        serif:    ['"Playfair Display"', '"Fraunces"', 'Georgia', 'serif'],
        sans:     ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        sanskrit: ['"Martel"', '"Noto Serif Devanagari"', 'serif'],
      },
      boxShadow: {
        // Pure neutral clean shadows, NO GLOW
        'editorial':       '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'editorial-hover': '0 4px 12px -2px rgba(0, 0, 0, 0.06)',
        'glass':           '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
        'glass-hover':     '0 4px 12px -2px rgba(0, 0, 0, 0.06)',
        'glass-modal':     '0 10px 25px -4px rgba(0, 0, 0, 0.1)',
        // Glow aliases safely mapped to clean soft neutral shadows
        'lavender-glow': '0 1px 3px rgba(79, 70, 229, 0.25)',
        'peach-glow':    '0 1px 3px rgba(224, 122, 95, 0.25)',
        'mint-glow':     '0 1px 3px rgba(45, 106, 79, 0.25)',
        'teal-glow':     '0 1px 3px rgba(79, 70, 229, 0.25)',
        'rose-glow':     '0 1px 3px rgba(224, 122, 95, 0.25)',
        'sage-glow':     '0 1px 3px rgba(45, 106, 79, 0.25)',
        'violet-glow':   '0 1px 3px rgba(79, 70, 229, 0.25)',
      },
      borderRadius: {
        '2xl':  '16px',
        '3xl':  '24px',
        '4xl':  '32px',
        'blob': '42% 58% 70% 30% / 45% 45% 55% 55%',
      },
      animation: {
        'breathe-slow':  'breathe 16s ease-in-out infinite',
        'pulse-gentle':  'pulseGentle 4s ease-in-out infinite',
        'float-slow':    'float 8s ease-in-out infinite',
        'float-reverse': 'floatReverse 9s ease-in-out infinite',
        'sway':          'sway 6s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)',    opacity: '0.85' },
          '25%':      { transform: 'scale(1.15)', opacity: '1' },
          '50%':      { transform: 'scale(1.15)', opacity: '0.95' },
          '75%':      { transform: 'scale(1)',    opacity: '0.85' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '0.85', transform: 'scale(1)' },
          '50%':      { opacity: '1',    transform: 'scale(1.02)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(6px)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%':      { transform: 'rotate(2deg)' },
        },
      },
    },
  },
  plugins: [],
}

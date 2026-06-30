/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        page: '#0f172a',
        card: '#1e293b',
        accent: '#0d1929',
        border: {
          DEFAULT: '#1e293b',
          hi: '#334151',
        },
        text: {
          primary: '#ffffff',
          secondary: '#94a3b8',
          tertiary: '#475569',
        },
        bull: '#059669',
        bear: '#dc2626',
        warn: '#d97706',
        neut: '#64748b',
        blue: {
          accent: '#3b82f6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

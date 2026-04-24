export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        serif: ['DM Serif Display', 'Georgia', 'serif'],
      },
      colors: {
        navy: { DEFAULT: '#0F1929', light: '#1a2744' },
        blue: { DEFAULT: '#185FA5', light: '#378ADD' },
        surface: { DEFAULT: '#FFFFFF', 2: '#F8F9FB', 3: '#F0F2F5' },
        border: { DEFAULT: '#E8ECF0' },
        'text-primary': '#0F1929',
        'text-secondary': '#6B7A8D',
        'text-muted': '#9BA8B4',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        soprano: '#EC4899',
        alto: '#8B5CF6',
        tenor: '#3B82F6',
        bass: '#10B981',
        primary: {
          50: '#E6F1FB',
          100: '#B5D4F4',
          500: '#378ADD',
          600: '#185FA5',
          700: '#0C447C',
          900: '#042C53',
        },
      },
    },
  },
  plugins: [],
}

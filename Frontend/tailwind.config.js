/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)', secondary: 'var(--color-secondary)', accent: 'var(--color-accent)',
        canvas: 'var(--color-bg)', border: 'var(--color-border)', success: 'var(--color-success)', warning: 'var(--color-warning)', danger: 'var(--color-danger)',
      },
      borderRadius: { card: '10px', control: '8px' },
      boxShadow: { soft: '0 12px 35px rgba(31, 41, 55, .07)' },
      spacing: { 1: '4px', 2: '8px', 3: '12px', 4: '16px', 5: '20px', 6: '24px', 8: '32px', 10: '40px' },
      fontFamily: { sans: ['Inter', 'sans-serif'], heading: ['Poppins', 'sans-serif'] },
    },
  },
}

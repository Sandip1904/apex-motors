/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        apex: {
          obsidian: '#060709',
          carbon: '#0d0f13',
          graphite: '#161920',
          slate: '#232833',
          steel: '#3a4150',
          silver: '#b8c0cc',
          platinum: '#e8ecf2',
          crimson: '#d92638',
          amber: '#d49a3a',
          titanium: '#8e99aa',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"Rajdhani"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        showroom: '0 24px 60px -20px rgba(0, 0, 0, 0.85)',
        panel: '0 12px 32px -12px rgba(0, 0, 0, 0.7)',
      },
      backgroundImage: {
        'studio-radial':
          'radial-gradient(ellipse at 50% 0%, rgba(184, 192, 204, 0.08) 0%, rgba(6, 7, 9, 0) 65%)',
      },
    },
  },
  plugins: [],
};

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'medsafe-primary': '#0066cc',
        'medsafe-success': '#10b981',
        'medsafe-warning': '#f59e0b',
        'medsafe-danger': '#ef4444',
        'medsafe-light': '#f3f4f6',
        'medsafe-dark': '#1f2937',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};

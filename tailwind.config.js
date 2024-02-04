export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1440px',
      '3x1': '1536px',
    },
    extend: {
      screens: {
        xxs: '360px',
        xs: '480px',
      },
    },
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#efeee9',
        ink: '#0a0a0a',
      },
      fontFamily: {
        hn: [
          '"Helvetica Neue ME"',
          'Helvetica',
          'Arial',
          '"PingFang SC"',
          '"Microsoft YaHei"',
          'sans-serif',
        ],
        sans: [
          '"Helvetica Neue ME"',
          'Helvetica',
          'Arial',
          '"PingFang SC"',
          '"Microsoft YaHei"',
          'sans-serif',
        ],
        serif: [
          '"Helvetica Neue ME"',
          'Helvetica',
          'Arial',
          '"PingFang SC"',
          '"Microsoft YaHei"',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
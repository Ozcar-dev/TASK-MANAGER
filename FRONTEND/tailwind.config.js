module.exports = {
  theme: {
    extend: {
      clipPath: {
        'triangle': 'polygon(0 0, 100% 0, 0 100%)', // Top-left triangle
      },
    },
  },
  plugins: [
    require('tailwindcss-clip-path'), // Optional plugin if using older versions
  ],
}

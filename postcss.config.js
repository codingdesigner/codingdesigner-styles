const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = {
  plugins: [
    autoprefixer({
      browsers: [
        'last 2 versions',
        'IE >= 11'
      ]
    }),
    cssnano()
  ]
};

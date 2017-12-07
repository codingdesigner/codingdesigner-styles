module.exports = {
  css: {
    enabled: true,
    src: [
      'scss/**/*.scss'
    ],
    watch:
      [
        'scss/**/*.scss',
        'scss/scss-config.json'
      ],
    dest: 'build/css/',
    lint: {
      configFile: '.sass-lint.yml',
      // in addition to linting `css.src`, this is added.
      extraSrc: [],
      ignore: []
    },
    // additional debugging info in comment of the output CSS - only use when necessary
    sourceComments: false,
    // tell the compiler whether you want 'expanded' or 'compressed' output code
    outputStyle: 'compact',
    // https://github.com/ai/browserslist#queries
    autoPrefixerBrowsers: [
      'last 2 versions',
      'IE >= 10'
    ],
    includePaths: [
      './node_modules'
    ],
    sassdoc: {
      enabled: true,
      dest: 'build/sassdoc',
      verbose: false,
      exclude: [],
      theme: 'default'
    }
  }
};

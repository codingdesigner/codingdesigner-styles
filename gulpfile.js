'use strict';

const autoprefixer = require('autoprefixer');
const gulp = require('gulp');
const jsonImporter = require('node-sass-json-importer');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const sassdoc = require('sassdoc');
const sassLint = require('gulp-sass-lint');
const sourcemaps = require('gulp-sourcemaps');
const gulpConfig = require('./gulpconfig.js');

gulp.task('build:sass', function () {
  return gulp.src(gulpConfig.css.src)
    .pipe(sourcemaps.init())
    .pipe(sass.sync({
      outputStyle: gulpConfig.css.outputStyle,
      sourceComments: gulpConfig.css.sourceComments,
      includePaths: gulpConfig.css.includePaths,
      importer: jsonImporter,
    }).on('error', sass.logError))
    .pipe(plumber({
      errorHandler(error) {
        notify.onError({
          title: 'CSS <%= error.name %> - Line <%= error.line %>',
          message: '<%= error.message %>',
        })(error);
        if (errorShouldExit) process.exit(1);
        this.emit('end');
      }
    }))
    .pipe(postcss(
      [
        autoprefixer({
          browsers: gulpConfig.css.autoPrefixerBrowsers
        })
      ]
    ))
    .pipe(sourcemaps.write((gulpConfig.css.sourceMapEmbed) ? null : './'))
    .pipe(gulp.dest(gulpConfig.css.dest));
});

gulp.task('watch:sass', function () {
  gulp.watch(gulpConfig.css.watch, ['build:sass', 'validate:sass', 'docs:sass']);
});


gulp.task('validate:sass', function () {
  return gulp.src(gulpConfig.css.src)
    .pipe(sassLint({
      files: {ignore: gulpConfig.css.lint.ignore},
      configFile: gulpConfig.css.lint.configFile
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

gulp.task('docs:sass', function() {
  return gulp.src(gulpConfig.css.src)
    .pipe(sassdoc({
      dest: gulpConfig.css.sassdoc.dest,
      verbose: gulpConfig.css.sassdoc.verbose,
      exclude: gulpConfig.css.sassdoc.exclude,
      theme: gulpConfig.css.sassdoc.theme,
      sort: gulpConfig.css.sassdoc.sort
    }));
});

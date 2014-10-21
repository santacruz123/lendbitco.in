'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

gulp.task('pre-deploy', ['build']);
gulp.task('deploy', ['clean', 'pre-deploy'], function () {
  gulp
    .src('./dist/**/*')
    .pipe($.ghPages({
      cacheDir : '.tmp/ghPages',
      cname    : 'lendbitco.in'
    }));
});

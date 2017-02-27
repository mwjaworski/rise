const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const ts = require('gulp-typescript');

gulp.task('build', function() {
  const tsConfiguration = ts.createProject('tsconfig.json');
  return gulp.src('lib/**/*.ts')
    .pipe(tsConfiguration())
    .pipe(concat('lib.js'))
    // .pipe(uglify({
    //   preserveComments: 'license',
    //   mangle: false
    // }))
    .pipe(gulp.dest('dist'));
});

gulp.task('test', function() {
  const tsConfiguration = ts.createProject('tsconfig.json');
  return gulp.src('test/**/*.ts')
    .pipe(tsConfiguration())
    .pipe(concat('test.js'))
    // .pipe(uglify({
    //   preserveComments: 'license',
    //   mangle: false
    // }))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['build'], function() {});
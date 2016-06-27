var gulp = require('gulp');
var ts = require('gulp-typescript');
var clean = require('gulp-clean');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');

// Gulp configuration
var cfg = require('./gulpconfig.json');

// Typescript configuration
var tsProject = ts.createProject('tsconfig.json');

gulp.task('clean:build', function () {
  return gulp.src(cfg.buildDir, {read: false})
    .pipe(plumber())
    .pipe(clean());
});

gulp.task('scripts', ['clean:build'], function () {

  var tsResult = tsProject.src()
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(ts(tsProject));

  return tsResult.js
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(cfg.buildDir))
    .pipe(gulp.dest(cfg.examplesBuildDir))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(cfg.buildDir))
    .pipe(gulp.dest(cfg.examplesBuildDir));
});

gulp.task('watch', ['scripts'], function() {
  gulp.watch(cfg.paths.scripts, ['scripts']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts']);
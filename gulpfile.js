const gulp = require('gulp');
const ts = require('gulp-typescript');
const clean = require('gulp-clean');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const nunjucks = require('gulp-nunjucks');
const markdown = require('gulp-markdown');
const header = require('gulp-header');
const footer = require('gulp-footer');

// Gulp configuration
const cfg = require('./gulpconfig.json');

// Typescript configuration
const tsProject = ts.createProject('tsconfig.json');

gulp.task('clean/build', () => {
  return gulp.src(cfg.buildDir, {read: false})
    .pipe(plumber())
    .pipe(clean());
});

gulp.task('clean/docs/build', () => {
  return gulp.src(cfg.docs.buildDir, {read: false})
    .pipe(plumber())
    .pipe(clean());
});

gulp.task('scripts', ['clean/build'], () => {

  var tsResult = tsProject.src()
    .pipe(plumber())
    //.pipe(sourcemaps.init())
    .pipe(ts(tsProject));

  return tsResult.js
    //.pipe(sourcemaps.write())
    .pipe(gulp.dest(cfg.buildDir))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(cfg.buildDir));
});

gulp.task('copy/docs/assets', () => {
  return gulp.src(cfg.docs.assetDir + "**/*", {base:"docs/assets"})
    .pipe(plumber())
    .pipe(gulp.dest(cfg.docs.buildDir));
});

gulp.task('copy/docs/dist', () => {
  return gulp.src(cfg.buildDir + "**/*")
    .pipe(plumber())
    .pipe(gulp.dest(cfg.docs.buildDir + cfg.buildDir));
});

gulp.task('compile/docs', () => {

  return gulp.src(cfg.docs.srcFiles)
    .pipe(plumber())
    .pipe(markdown())
    .pipe(header('{% extends "' + cfg.docs.baseTpl + '" %}\r\n{% block content %}\r\n'))
    .pipe(footer('{% endblock %}'))
    .pipe(nunjucks.compile())
    .pipe(gulp.dest(cfg.docs.buildDir));
});

gulp.task('compile/examples', () => {

  return gulp.src(cfg.docs.exampleFiles)
    .pipe(plumber())
    .pipe(nunjucks.compile())
    .pipe(gulp.dest(cfg.docs.buildDir));
});

gulp.task('docs', ['scripts', 'copy/docs/dist', 'copy/docs/assets', 'compile/docs', 'compile/examples']);

gulp.task('watch', ['scripts',], () => {
  gulp.watch(cfg.paths.scripts, ['scripts']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts']);
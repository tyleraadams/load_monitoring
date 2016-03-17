var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload'),
  sass = require('gulp-sass'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream');

var sourceFile = './app/scripts/app.js',
  destFolder = './public/js',
  destFileName = 'app.js';

gulp.task('sass', function () {
  gulp.src('./public/css/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest('./public/css'))
    .pipe(livereload());
});

gulp.task('watch', function() {
  gulp.watch('./public/css/*.scss', ['sass']);
});

gulp.task('develop', function () {
  livereload.listen();
  nodemon({
    script: 'app.js',
    ext: 'js handlebars',
    stdout: false
  }).on('readable', function () {
    this.stdout.on('data', function (chunk) {
      if(/^Express server listening on port/.test(chunk)){
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

gulp.task('buildScripts', function() {
    return browserify(sourceFile)
        .bundle()
        .pipe(source(destFileName))
        .pipe(gulp.dest('public/js'));
});

gulp.task('default', [
  'sass',
  'buildScripts',
  'develop',
  'watch'
]);

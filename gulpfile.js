var browserSync     = require('browser-sync');
var reload          = browserSync.reload;
var gulp            = require('gulp');
var minifyCSS       = require('gulp-minify-css');
var nodemon         = require('gulp-nodemon');
var notify          = require('gulp-notify');
var rename          = require('gulp-rename');
var sass            = require('gulp-sass');
var sourcemaps      = require('gulp-sourcemaps');

gulp.task('bs-reload', function() {
  // browserSync.reload();
  reload({stream: true});
});

// https://gist.github.com/sogko/b53d33d4f3b40d3b4b2e
gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init(null, {
        proxy: "http://localhost:5000",
        files: ["public/**/*.*"],
        browser: "google chrome",
        port: 5001,
    });
});

gulp.task('nodemon', function (cb) {
    return nodemon({
      script: 'server.js'
    }).on('start', function () {
      cb();
  });
});
// end https://gist.github.com/sogko/b53d33d4f3b40d3b4b2e

gulp.task('minify-css', function() {
  gulp.src(['./public/css/**/*.css', '!./public/css/**/*.min.css'])
    .pipe(rename({suffix: '.min'}))
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(gulp.dest('./public/css/'))
});

// SASS task, will run when any SCSS files change & BrowserSync - will auto-update browsers
gulp.task('sass', function() {
  gulp.src('public/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      style: 'expanded',
      errLogToConsole: true
    }))
    .on('error', notify.onError({
      title: 'SASS Failed',
      message: 'Error(s) occurred during compile!'
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/css'))
    .pipe(reload({
      stream: true
    }))
    .pipe(notify({
      message: 'Styles task complete'
    }));
});

// this default task will run BrowserSync & then use Gulp to watch files
// when a file is changed, an event is emitted to BrowserSync with the filepath
gulp.task('default', ['browser-sync', 'sass', 'minify-css'], function() {
  gulp.watch('public/css/*.css', function(file) {
    if (file.type === "changed") {
      console.log("reloading");
      reload(file.path);
    }
  });
  gulp.watch(['public/views/*.jade'], ['bs-reload']);
  gulp.watch(['public/js/*.js', 'public/js/**/*.js'], ['bs-reload']);
  gulp.watch('public/scss/**/*.scss', ['sass', 'minify-css', 'bs-reload']);
});

// BUGFIX: warning: possible EventEmitter memory leak detected - 11 listeners added
require('events').EventEmitter.prototype._maxListeners = 100;

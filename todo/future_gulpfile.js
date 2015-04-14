/**
 * @author  Jozef Butko
 * @url       www.jozefbutko.com/resume
 * @date    March 2015
 *
 * AngularJS Boilerplate: Build, watch and other useful tasks
 *
 * The build process consists of following steps:
 * 1. clean /_build folder
 * 2. compile SASS files, minify and uncss compiled css

 * 4. minify and copy all HTML files into $templateCache
 * 5. build index.html
 * 6. minify and copy all JS files
 * 7. copy fonts
 * 8. show build folder size
 * 
 */
var browserSync     = require('browser-sync');
var reload          = browserSync.reload;
var gulp            = require('gulp');
var nodemon         = require('gulp-nodemon');
var sass            = require('gulp-sass');
var uglify          = require('gulp-uglify');
var minifyCSS       = require('gulp-minify-css');
var minifyHTML      = require('gulp-minify-html');
var del             = require('del'); // delete files
var concat          = require('gulp-concat');

var sourcemaps      = require('gulp-sourcemaps');
var autoprefixer    = require('gulp-autoprefixer');
var rename          = require('gulp-rename');
var notify          = require('gulp-notify');
var changed         = require('gulp-changed');
var usemin          = require('gulp-usemin');
var rev             = require('gulp-rev');// append revision numbers at the end of filename: https://github.com/sindresorhus/gulp-rev
var size            = require('gulp-size');
var uncss           = require('gulp-uncss');
var htmlreplace     = require('gulp-html-replace');
var runSequence     = require('run-sequence');
var templateCache   = require('gulp-angular-templatecache');

// reload all Browsers
gulp.task('bs-reload', function() {
  browserSync.reload();
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

// end
// https://gist.github.com/sogko/b53d33d4f3b40d3b4b2e

// minify CSS
gulp.task('minify-css', function() {
  gulp.src(['./public/css/**/*.css', '!./public/css/**/*.min.css'])
    .pipe(rename({suffix: '.min'}))
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(gulp.dest('./public/css/'))
    .pipe(gulp.dest('./_build/css/'));
});

// SASS task, will run when any SCSS files change & BrowserSync
// will auto-update browsers
gulp.task('sass', function() {
  return gulp.src('public/scss/**/*.scss')
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

// default task to be run with `gulp` command
// this default task will run BrowserSync & then use Gulp to watch files.
// when a file is changed, an event is emitted to BrowserSync with the filepath.
gulp.task('default', ['browser-sync', 'sass', 'minify-css'], function() {
  gulp.watch('public/css/*.css', function(file) {
    if (file.type === "changed") {
      console.log("reloading");
      reload(file.path);
    }
  });
  gulp.watch(['public/views/*.jade'], ['bs-reload']);
  gulp.watch(['public/js/*.js', 'public/js/**/*.js'], ['bs-reload']);
  gulp.watch('public/scss/**/*.scss', ['sass', 'minify-css']);
});

// MIGHT NOT NEED THIS
// start webserver
// gulp.task('server', function(done) {
//   return browserSync({
//     server: {
//       baseDir: './'
//     }
//   }, done);
// });

// TODO
// start webserver from _build folder to check how it will look in production
// gulp.task('server-build', function(done) {
//   return browserSync({
//     server: {
//       baseDir: './_build/'
//     }
//   }, done);
// });

// TODO
// delete build folder
// gulp.task('clean:build', function (cb) {
//   del([
//     './_build/'
//     // if we don't want to clean any file we can use negate pattern
//     //'!dist/mobile/deploy.json'
//   ], cb);
// });

// TODO
// concat files
// gulp.task('concat', function() {
//   gulp.src('./js/*.js')
//     .pipe(concat('scripts.js'))
//     .pipe(gulp.dest('./_build/'));
// });

// TODO
// SASS Build task
// gulp.task('sass:build', function() {
//   var s = size();

//   return gulp.src('styles/style.scss')
//     .pipe(sass({
//       style: 'compact'
//     }))
//     .pipe(autoprefixer('last 3 version'))
//     .pipe(uncss({
//       html: ['./index.html', './views/**/*.html', './components/**/*.html'],
//       ignore: [
//         '.index',
//         '.slick',
//         /\.owl+/,
//         /\.owl-next/,
//         /\.owl-prev/
//       ]
//     }))
//     .pipe(minifyCSS({
//       keepBreaks: true,
//       aggressiveMerging: false,
//       advanced: false
//     }))
//     .pipe(rename({suffix: '.min'}))
//     .pipe(gulp.dest('_build/css'))
//     .pipe(s)
//     .pipe(notify({
//       onLast: true,
//       message: function() {
//         return 'Total CSS size ' + s.prettySize;
//       }
//     }));
// });

// BUGFIX: warning: possible EventEmitter memory leak detected. 11 listeners added.
require('events').EventEmitter.prototype._maxListeners = 100;

// TODO
// index.html build
// script/css concatenation
// gulp.task('usemin', function() {
//   return gulp.src('./index.html')
//     // add templates path
//     .pipe(htmlreplace({
//       'templates': '<script type="text/javascript" src="js/templates.js"></script>'
//     }))
//     .pipe(usemin({
//       css: [minifyCSS(), 'concat'],
//       libs: [uglify()],
//       nonangularlibs: [uglify()],
//       angularlibs: [uglify()],
//       appcomponents: [uglify()],
//       mainapp: [uglify()]
//     }))
//     .pipe(gulp.dest('./_build/'));
// });

// TODO
// make templateCache from all HTML files
// gulp.task('templates', function() {
//   return gulp.src([
//       './**/*.html',
//       '!bower_components/**/*.*',
//       '!node_modules/**/*.*',
//       '!_build/**/*.*'
//     ])
//     .pipe(minifyHTML())
//     .pipe(templateCache({
//       module: 'boilerplate'
//     }))
//     .pipe(gulp.dest('_build/js'));
// });

// TODO
// calculate build folder size
// gulp.task('build:size', function() {
//   var s = size();

//   return gulp.src('./_build/**/*.*')
//     .pipe(s)
//     .pipe(notify({
//       onLast: true,
//       message: function() {
//         return 'Total build size ' + s.prettySize;
//       }
//     }));
// });


// TODO
// rebuild "build" task for when we need / want it

/**
 * build task:
 * 1. clean /_build folder
 * 2. compile SASS files, minify and uncss compiled css

 * 4. minify and copy all HTML files into $templateCache
 * 5. build index.html
 * 6. minify and copy all JS files
 * 7. copy fonts
 * 8. show build folder size
 * 
 */
// gulp.task('build', function(callback) {
  // runSequence(
    // 'clean:build',
    // 'sass:build',
    // 'templates',
    // 'usemin',
    // 'fonts',
    // 'build:size',
    // callback);
// });


// minify JS
// TODO
// gulp.task('minify-js', function() {
//   gulp.src('./public/js/*.js')
//     .pipe(uglify())
//     .pipe(gulp.dest('./_build/'));
// });

// minify HTML
// TODO
// gulp.task('minify-html', function() {
//   var opts = {
//     comments: true,
//     spare: true,
//     conditionals: true
//   };

//   gulp.src('./*.html')
//     .pipe(minifyHTML(opts))
//     .pipe(gulp.dest('./_build/'));
// });

// copy fonts around
// TODO
// copy fonts from a module outside of our project (like Bower)
// gulp.task('fonts', function() {
//   gulp.src('./fonts/**/*.{ttf,woff,eof,eot,svg}')
//     .pipe(changed('./_build/fonts'))
//     .pipe(gulp.dest('./_build/fonts'));
// });

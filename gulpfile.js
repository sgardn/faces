var gulp = require('gulp'); 
var watchLess = require('gulp-watch-less');
var less = require('gulp-less');

console.log("gulping");

gulp.task('less-watch', function () {
    return gulp.src('public/less/file.less')
        .pipe(watchLess('public/less/file.less'))
        .pipe(less())
        .pipe(gulp.dest('public/css'));
});

gulp.task('scripts', function() {
    gulp.src('bower_components/angular/angular.js')
        .pipe(gulp.dest('public/vendor/'));
});

gulp.task('default', ['scripts', 'less-watch']);

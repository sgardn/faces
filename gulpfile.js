var gulp = require('gulp'); 

gulp.task('scripts', function() {
    // return gulp.src('js/*.js')
    // return gulp.src('bower_components/angular/angular.js')
    gulp.src('bower_components/angular/angular.js')
        .pipe(gulp.dest('public/vendor/'));

    // gulp.src('node_modules/angular-load/angular-load.js')
    //     .pipe(gulp.dest('public/vendor'));

    // gulp.src('node_modules/underscore/underscore.js')
    //     .pipe(gulp.dest('public/vendor'));

});

gulp.task('default', ['scripts']);

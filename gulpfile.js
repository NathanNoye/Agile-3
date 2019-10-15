const gulp = require('gulp');
const minifyJS = require('gulp-minify');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const less = require('gulp-less');

function scripts () {
    return (
        gulp.src(["./js/agile.core.js", "./js/agile.observe.js", "./js/**/*.js"])
            .pipe(concat('app.js'))
            .pipe(minifyJS())
            .pipe(gulp.dest('./prod/'))
    );
}

function styles () {
    return (
        gulp.src(["./css/agile.variables.less", "./css/agile.base.less", "./css/**/*.less"])
            .pipe(concat('main-min.less'))
            .pipe(less())
            .pipe(autoprefixer())
            .pipe(cleanCSS())
            .pipe(gulp.dest('./prod/'))
    );
}

gulp.task('scripts', scripts);
gulp.task('styles', styles);

gulp.task('easy-package', function (done) {
    scripts();
    styles();
    done();
})

gulp.task('watch-scripts', function (done) {
    gulp.watch('./js/**/*.js', scripts);
    done();
});

gulp.task('watch-styles', function (done) {
    gulp.watch('./css/**/*.css', styles);
    done();
});

gulp.task('default', gulp.parallel('easy-package', 'watch-scripts', 'watch-styles'))
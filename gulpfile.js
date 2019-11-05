const gulp = require('gulp');
const minifyJS = require('gulp-minify');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const less = require('gulp-less');

function scripts () {
    return (
        gulp.src(["./clientLibs/js/agile/agile.core.js", "./clientLibs/js/agile/agile.observe.js", "./clientLibs/**/*.js", "./components/**/*.js"])
            .pipe(concat('app.js'))
            .pipe(minifyJS())
            .pipe(gulp.dest('./prod/'))
    );
}

function styles () {
    return (
        gulp.src(["./clientLibs/css/agile/agile.variables.less", "./clientLibs/css/agile/agile.base.less", "./clientLibs/css/**/*.less", "./clientLibs/css/**/*.css", "./components/**/*.less", "./components/**/*.css"])
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
    gulp.watch(['./clientLibs/js/**/*.js', './components/**/*.js'], scripts);
    done();
});

gulp.task('watch-styles', function (done) {
    gulp.watch(['./clientLibs/css/**/*.css', './clientLibs/css/**/*.less', './components/**/*.css', './components/**/*.less'], styles);
    done();
});

gulp.task('default', gulp.parallel('easy-package', 'watch-scripts', 'watch-styles'))
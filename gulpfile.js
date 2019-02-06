'use strict';

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

function css() {
    return gulp
        .src('./assets/scss/**/*.scss')
        .pipe(plumber())
        .pipe(sass({outputStyle: 'expanded'}))
        .pipe(gulp.dest('./_site/assets/css/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(gulp.dest('./_site/assets/css/'));
}

const compileMarkup = () => {
};

const compileScript = () => {
};

const compileStyle = () => {
};

const watchMarkup = () => {
};

const watchScript = () => {
};

const watchStyle = () => {
};

const compile = gulp.parallel(compileMarkup, compileScript, compileStyle);
compile.description = 'compile all sources';

const startServer = () => {
};

const serve = gulp.series(compile, startServer);
serve.description = 'serve compiled source on local server at port 3000';

const watch = gulp.parallel(watchMarkup, watchScript, watchStyle);
watch.description = 'watch for changes to all source';

const defaultTasks = gulp.parallel(serve, watch);

export {
    compile,
    compileMarkup,
    compileScript,
    compileStyle,
    serve,
    watch,
    watchMarkup,
    watchScript,
    watchStyle,
}

export default defaultTasks
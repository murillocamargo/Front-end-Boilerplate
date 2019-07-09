'use strict';

// Load plugins
const autoprefixer = require("autoprefixer");
const babel = require('gulp-babel');
const browsersync = require("browser-sync").create();
const cssnano = require("cssnano");
const concat = require('gulp-concat');
const del = require("del");
const eslint = require("gulp-eslint");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const sassGlob = require('gulp-sass-glob');
const uglify = require('gulp-uglify');
const gulp = require("gulp");

// Clean assets
function clean() {
    return del([
        './dist',
        './assets/css',
        './assets/scripts',
        './assets/images'
    ]);
}

// CSS task
function css() {

    return gulp
        .src("./source/scss/main.scss")
        .pipe(plumber())
        .pipe(sassGlob())
        .pipe(sass({outputStyle: "expanded"}))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(rename({basename: "frontend", suffix: ".min"}))
        .pipe(gulp.dest("./assets/css/"));
}

// Lint scripts
function scriptsLint() {
    return gulp
        .src(["./source/scripts/frontend.js"])
        .pipe(plumber())
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

// Transpile, concatenate and minify scripts

function scripts() {
    return (
        gulp
            .src(["./source/scripts/libs/*.js", "./source/scripts/frontend.js"])
            .pipe(plumber())
            .pipe(babel({
                presets: [['env', {
                    loose: true,
                    modules: false,
                    exclude: ['transform-es2015-typeof-symbol']
                }]],
                plugins: ['@babel/plugin-proposal-object-rest-spread']
            }))
            .pipe(concat('frontend.js'))
            .pipe(uglify())
            .pipe(rename({suffix: ".min"}))
            .pipe(gulp.dest("./assets/scripts/"))
    );
}

// Optimize Images
function images() {
    return gulp
        .src("./source/images/**/*")
        .pipe(newer("./assets/images"))
        .pipe(
            imagemin([
                imagemin.gifsicle({interlaced: true}),
                imagemin.jpegtran({progressive: true}),
                imagemin.optipng({optimizationLevel: 5}),
                imagemin.svgo({
                    plugins: [
                        {
                            removeViewBox: false,
                            collapseGroups: true
                        }
                    ]
                })
            ])
        )
        .pipe(gulp.dest("./assets/images"));
}

function copyAssets() {
    return gulp
        .src("./assets/**/*")
        .pipe(gulp.dest('dist/assets'));
}

function copyStructure() {
    return gulp
        .src("./*.{html,php}")
        .pipe(gulp.dest('dist'));
}

// BrowserSync
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./"
        },
        port: 3000
    });
    done();
}

// BrowserSync Reload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}

// Watch files
function watchFiles() {
    gulp.watch("./source/scss/**/*", gulp.series(css, browserSyncReload));
    gulp.watch("./source/scripts/**/*", gulp.series(scriptsLint, scripts, browserSyncReload));
    gulp.watch("./source/images/**/*", gulp.series(images, browserSyncReload));
    gulp.watch("./**/*.{html,php}", gulp.series(browserSyncReload));
}

// define complex tasks
const js = gulp.series(scriptsLint, scripts);
const assets = gulp.parallel(css, images, js);
const copy = gulp.parallel(copyAssets, copyStructure);

const build = gulp.series(clean, assets, copy);
const watch = gulp.parallel(watchFiles, browserSync);

// export tasks
exports.build = build;
exports.watch = watch;
exports.default = gulp.series(build, watch);
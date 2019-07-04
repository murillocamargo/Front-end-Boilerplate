'use strict';

// Load plugins
const autoprefixer = require("autoprefixer");
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
        './assets/images',
        '.scss-cache',
        '.tmp'
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

// BrowserSync
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./_site/"
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
    gulp.watch("./assets/scss/**/*", css);
    // gulp.watch("./assets/js/**/*", gulp.series(scriptsLint, scripts));
    gulp.watch("./assets/js/**/*", gulp.series(scriptsLint));
    gulp.watch(
        [
            "./_includes/**/*",
            "./_layouts/**/*",
            "./_pages/**/*",
            "./_posts/**/*",
            "./_projects/**/*"
        ],
        gulp.series(browserSyncReload)
    );
    gulp.watch("./assets/img/**/*", images);
}

// define complex tasks
const js = gulp.series(scriptsLint, scripts);
// const js = gulp.series(scriptsLint);
const build = gulp.series(clean, gulp.parallel(css, images, js));
// const watch = gulp.parallel(watchFiles, browserSync);

// export tasks
exports.build = build;
// exports.scripts = scripts;
// exports.watch = watch;
// exports.default = build;
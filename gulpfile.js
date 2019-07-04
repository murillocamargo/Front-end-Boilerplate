'use strict';

// Load plugins
const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
const cssnano = require("cssnano");
const del = require("del");
const eslint = require("gulp-eslint");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const sassGlob = require('gulp-sass-glob');
const gulp = require("gulp");

// Clean assets
function clean() {
    return del(["./assets/"]);
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

// Clean assets
function clean() {
    return del(["./_site/assets/"]);
}

// Optimize Images
function images() {
    return gulp
        .src("./assets/img/**/*")
        .pipe(newer("./_site/assets/img"))
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
        .pipe(gulp.dest("./_site/assets/img"));
}

// Lint scripts
function scriptsLint() {
    return gulp
        .src(["./assets/js/**/*", "./gulpfile.js"])
        .pipe(plumber())
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
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
// const js = gulp.series(scriptsLint, scripts);
// const js = gulp.series(scriptsLint);
// const build = gulp.series(clean, gulp.parallel(css, images, js));
// const watch = gulp.parallel(watchFiles, browserSync);

// export tasks
exports.css = css;
exports.clean = clean;
// exports.images = images;
// exports.js = js;
// exports.build = build;
// exports.watch = watch;
// exports.default = build;
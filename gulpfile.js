const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const rename = require('gulp-rename');
const del = require('del');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const replace = require('gulp-replace');
const imagemin = require('gulp-imagemin');
const plumber = require('gulp-plumber');
const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');

const paths = {
    html: {
        src: './src/**/*.html',
        dest: './dist'
    },
    styles: {
        src: './src/scss/**/*.scss',
        dest: './dist/assets/css'
    },
    scripts: {
        src: './src/js/**/*.js',
        dest: './dist/assets/js'
    },
    vendors: {
        src: './src/js/vendors/**/*.js',
        dest: './dist/assets/js'
    },
    images: {
        src: './src/images/**/*',
        dest: './dist/images'
    }
};

const clean = () => del(['./build']);

const curTime = new Date().getTime();
const cacheBust = () =>
    gulp
        .src(paths.html.src)
        .pipe(plumber())
        .pipe(replace(/cb=\d+/g, 'cb=' + curTime))
        .pipe(gulp.dest(paths.html.dest));


const html = () =>
    gulp
        .src(paths.html.src)
        .pipe(plumber())
        .pipe(gulp.dest(paths.html.dest));

const styles = () =>
    gulp
        .src(paths.styles.src)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(
            rename({
                basename: 'styles',
                suffix: '.min'
            })
        )
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());

const scripts = () =>
    gulp
        .src(paths.scripts.src)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(
            babel({
                presets: ['@babel/preset-env']
            })
        )
        .pipe(terser())
        .pipe(concat('app.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.scripts.dest));

const vendors = () =>
    gulp
        .src(paths.vendors.src)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(
            babel({
                presets: ['@babel/preset-env']
            })
        )
        .pipe(terser())
        .pipe(concat('vendors.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.vendors.dest));

const images = () =>
    gulp
        .src(paths.images.src)
        .pipe(plumber())
        .pipe(gulp.dest(paths.images.dest));

const generateSprites = () => gulp.src('src/images/sprite/*.svg') // svg files for sprite
        .pipe(svgSprite({
                mode: {
                    stack: {
                        sprite: "../sprite.svg"  //sprite file name
                    }
                },
            }
        ))
        .pipe(gulp.dest('src/images/'));

function watchFiles() {
    browserSync.init({
        server: {
            baseDir: './dist'
        },
        notify: false
    });

    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.vendors.src, vendors).on('change', browserSync.reload);
    gulp.watch(paths.scripts.src, scripts).on('change', browserSync.reload);
    gulp.watch(paths.images.src, images).on('change', browserSync.reload);
    gulp.watch('./src/*.html', html).on('change', browserSync.reload);
}

const build = gulp.series(
    clean,
    gulp.parallel(styles, vendors, scripts, images),
    cacheBust
);

const watch = gulp.series(build, watchFiles);

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.vendors = vendors;
exports.images = images;
exports.generateSprites = generateSprites;
exports.watch = watch;
exports.build = build;
exports.default = build;

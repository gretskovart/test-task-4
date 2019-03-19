/* global require */
const gulp = require(`gulp`);
const less = require(`gulp-less`);
const autoprefixer = require(`gulp-autoprefixer`);
const concat = require(`gulp-concat`);
const cleanCSS = require(`gulp-clean-css`);
const pug = require(`gulp-pug`);
const uglify = require(`gulp-uglify`);
const del = require(`del`);
const browserSync = require(`browser-sync`).create();
const babel = require(`gulp-babel`);
const imagemin = require(`gulp-imagemin`);
const svgSprite = require(`gulp-svg-sprite`);
const rollup = require(`gulp-better-rollup`);
const deploy = require(`gulp-gh-pages`);

const cssFiles = [
  `./node_modules/normalize.css/normalize.css`,
  `./src/less/all.less`
];

const jsFiles = [
  `./src/js/utils.js`,
  `./src/js/slider.js`,
  `./src/js/slider-vertical.js`
];

function html() {
  return gulp.src(`./src/pug/index.pug`)
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest(`./public`));
}

function font() {
  return gulp.src(`./src/font/**/*`)
    .pipe(gulp.dest(`./public/font`));
}

function otherFiles() {
  return gulp.src(`./src/*.*`)
  .pipe(gulp.dest(`./public/`));
}

function styles() {
  return gulp.src(cssFiles)
    .pipe(less())
    .pipe(concat(`all.css`))
    .pipe(autoprefixer({
      browsers: [`last 2 versions`],
      cascade: false
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(gulp.dest(`./public/css/`))
    .pipe(browserSync.stream());
}

function scripts() {
  return gulp.src(jsFiles)
    .pipe(rollup({}, `iife`))
    .pipe(babel({
      presets: [`@babel/env`]
    }))
    .pipe(concat(`all.js`))
    .pipe(uglify({
      toplevel: true
    }))
    .pipe(gulp.dest(`./public/js/`))
    .pipe(browserSync.stream());
}

function images() {
  return gulp.src([`./src/images/**/*`, `!./src/images/**/*.svg`])
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5})
    ]))
    .pipe(gulp.dest(`public/images`));
}

function imagesSvg() {
  return gulp.src(`./src/images/*.svg`)
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: `sprite.svg`
        }
      },
    }
    ))
    .pipe(imagemin([
      imagemin.svgo({
        plugins: [
          {
            removeViewBox: false,
            collapseGroups: true
          }
        ]
      })
    ]))
    .pipe(gulp.dest(`public/images`));
}

function clean() {
  return del([`public/**/*`]);
}

function watch() {
  browserSync.init({
    server: {
      baseDir: `./public/`
    }
  });

  gulp.watch(`./src/pug/**/*`, html);
  gulp.watch(`./src/less/**/*.less`, styles);
  gulp.watch(`./src/font/**/*`, font);
  gulp.watch(`./src/js/**/*.js`, scripts);
  gulp.watch(`./src/images/*`, images);
  gulp.watch(`./*.html`, browserSync.reload);
}

gulp.task(`watch`, watch);

gulp.task(`build`, gulp.series(
    clean,
    gulp.parallel(
        html,
        font,
        styles,
        scripts,
        otherFiles),
    images,
    imagesSvg
)
);

gulp.task(`deploy`, function () {
  return gulp.src(`./public/**/*`)
    .pipe(deploy());
});

gulp.task(`dev`, gulp.series(`build`, `watch`));

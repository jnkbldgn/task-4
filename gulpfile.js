const gulp = require('gulp');
const watch = require('gulp-watch');
const prefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const nodemon = require('gulp-nodemon');
const rimraf = require('rimraf');

const path = {
  build: {
    styles: './public/build/styles/',
    js: './public/build/js/',
  },
  src: {
    styles: './src/styles/app.sass',
    js: './src/js/app.js',
  },
  watch: {
    styles: './src/styles/*.sass',
    js: './src/js/*.js',
  },
  clean: './build',
};

gulp.task('serve', () => {
  nodemon({
    script: './index.js',
    ext: 'js html',
    env: {
      NODE_ENV: 'development',
    },
  }).on('restart', () => {
    console.log('restarted...');
  });
});

gulp.task('serve prod', () => {
  nodemon({
    script: './index.js',
    ext: 'js html',
    env: {
      NODE_ENV: 'production',
    },
  }).on('restart', () => {
    console.log('restarted...');
  });
});

gulp.task('styles-mini', () => {
  gulp.src(path.src.styles)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(prefixer())
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.styles));
});

gulp.task('styles', () => {
  gulp.src(path.src.styles)
    .pipe(sass())
    .pipe(sourcemaps.init())
    .pipe(prefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.styles));
});

gulp.task('js', () => {
  gulp.src(path.src.js)
    .pipe(gulp.dest(path.build.js));
});

gulp.task('watch', () => {
  watch([path.watch.styles], () => {
    gulp.start('styles');
  });
  watch([path.watch.js], () => {
    gulp.start('js');
  });
});

gulp.task('clean', (cb) => {
  rimraf(path.clean, cb);
});

gulp.task('dev', ['clean', 'styles', 'js', 'watch', 'serve']);
gulp.task('prod', ['clean', 'styles-mini', 'js', 'serve prod']);
gulp.task('build', ['styles-mini', 'js']);

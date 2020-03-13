const gulp = require('gulp')
const plugins = require('gulp-load-plugins')()
const optionsBS = {
  server: {
            baseDir: "./dist"
        },
  files       : [
    'dist/**/*'
  ],
  watchEvents : ['add', 'change', 'unlink', 'addDir', 'unlinkDir'],
  open        : false,
  notify      : false,
  ghostMode   : false,
  ui: {
    port: 8001
  }
}
var browsersync = false

console.log(plugins)

gulp.task('browsersync', () => {
  if (browsersync === false) {
    browsersync = require('browser-sync').create()
    browsersync.init(optionsBS)
  }
})
gulp.task('clean', () => {
  return gulp.src('./dist/assets/*.css.map')
  .pipe(plugins.clean())
})

gulp.task('html', () => {
  return gulp.src('./src/*.html')
  .pipe(gulp.dest('./dist/'))
})

gulp.task('css-dev', () => {
  return gulp.src('./src/assets/source.scss')
  .pipe(plugins.sourcemaps.init())
  .pipe(plugins.sass())
  .pipe(plugins.sourcemaps.write('.'))
  .pipe(gulp.dest('./dist/assets/'))
})

gulp.task('css-prod', () => {
  return gulp.src('./src/assets/source.scss')
  .pipe(plugins.sass())
  .pipe(plugins.groupCssMediaQueries())
  .pipe(plugins.autoprefixer({overrideBrowsersList: ['last 2 versions', '> 2%']}))
  .pipe(plugins.cssnano())
  .pipe(gulp.dest('./dist/assets/'))
})

gulp.task('watch', () => {
  gulp.watch('./src/**/*', gulp.series('html', 'css-dev'))
})

gulp.task('build', gulp.series('clean', 'css-prod'))
gulp.task('default', gulp.parallel('browsersync','watch'))

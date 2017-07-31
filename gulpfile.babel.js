import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';
import path from 'path';
import mocha from 'gulp-mocha';
import istanbul from 'gulp-istanbul';
import injectModules from 'gulp-inject-modules';
import exit from 'gulp-exit';
import coveralls from 'gulp-coveralls';
import cover from 'gulp-coverage';

// Load the gulp plugins into the `plugins` variable
const plugins = loadPlugins();

gulp.task('tests', () => {
  gulp.src('./server/tests/*.js')
    .pipe(plugins.babel())
    .pipe(mocha())
    .pipe(exit());
});


// Compile all Babel Javascript into ES5 and place in dist folder
const paths = {
  js: ['./**/*.js', '!dist/**', '!node_modules/**']
};

// Compile all Babel Javascript into ES5 and put it into the dist dir
gulp.task('babel', () =>
  gulp.src(paths.js, { base: '.' })
    .pipe(plugins.babel())
    .pipe(gulp.dest('dist'))
);

gulp.task('coverage', () => {
  gulp.src('dist/server/test/**/*.js', { read: false })
    .pipe(cover.instrument({
      pattern: ['server/controllers/**/*.js'],
      debugDirectory: 'debug'
    }))
    .pipe(mocha())
    .pipe(cover.gather())
    .pipe(cover.format())
    .pipe(gulp.dest('reports'));
});

gulp.task('coveralls', () => gulp.src('./coverage/lcov')
    .pipe(coveralls()));


// Restart server with on every changes made to file
gulp.task('nodemon', ['babel'], () =>
  plugins.nodemon({
    script: path.join('dist', 'index.js'),
    ignore: ['README.md', 'node_modules/**/*.js', 'dist/**/*.js'],
    ext: 'js',
    tasks: ['babel']
  })
);

gulp.task('test', ['tests']);
gulp.task('default', ['nodemon']);
gulp.task('production', ['babel']);

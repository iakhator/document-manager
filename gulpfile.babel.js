import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';
import path from 'path';
import injectModules from 'gulp-inject-modules';
import coveralls from 'gulp-coveralls';
import istanbul from 'gulp-istanbul';
import mocha from 'gulp-mocha';
import exit from 'gulp-exit';

// Load the gulp plugins into the `plugins` variable
const plugins = loadPlugins();

gulp.task('mochaTest', () => {
  gulp.src(['dist/server/test/**/*.js'])
    .pipe(mocha({
      reporter: 'spec',
    }));
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

gulp.task('coverage', (cb) => {
  gulp.src('dist/server/test/controllers/*.js')
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', () => {
      gulp.src('dist/server/test/*.js')
        .pipe(plugins.babel())
        .pipe(injectModules())
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 30 } }))
        .on('end', cb)
        .pipe(exit());
    });
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

gulp.task('test', ['mochaTest']);
gulp.task('default', ['nodemon']);
gulp.task('production', ['babel']);

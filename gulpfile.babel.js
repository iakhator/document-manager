import gulp from 'gulp';
import mocha from 'gulp-mocha';

import loadPlugins from 'gulp-load-plugins';
import path from 'path';

// Load the gulp plugins into the `plugins` variable
const plugins = loadPlugins();

const paths = {
  js: ['./**/*.js', '!dist/**', '!node_modules/**']
};

// Compile all Babel Javascript into ES5 and put it into the dist dir
gulp.task('babel', () =>
  gulp.src(paths.js, { base: '.' })
    .pipe(plugins.babel())
    .pipe(gulp.dest('dist'))
);

gulp.task('mochaTest', () => {
  gulp.src(['dist/server/test/**/*.js'])
    .pipe(mocha({
      reporter: 'spec',
    }));
});

// Start server with restart on file change events
gulp.task('nodemon', ['babel'], () =>
  plugins.nodemon({
    script: path.join('dist', 'index.js'),
    ext: 'js',
    ignore: ['README.md', '.DS_Store', 'node_modules/**/*.js', 'dist/**/*.js'],
    tasks: ['babel']
  })
);

gulp.task('test', ['mochaTest']);
gulp.task('default', ['nodemon']);

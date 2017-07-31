import gulp from 'gulp';
import mocha from 'gulp-mocha';
import babel from 'babel-register';

import loadPlugins from 'gulp-load-plugins';
import path from 'path';

// Load the gulp plugins into the `plugins` variable
const plugins = loadPlugins();

const paths = {
  js: ['./**/*.js', '!dist/**', '!node_modules/**', '!server/test/**/*.js']
};

// Compile all Babel Javascript into ES5 and put it into the dist dir
gulp.task('babel', () =>
  gulp.src(paths.js, { base: '.' })
    .pipe(plugins.babel({
      ignore: 'gulpfile.babel.js'
    }))
    .pipe(gulp.dest('dist'))
);

gulp.task('test', () => {
  gulp.src('server/test/**/*.js', { read: false })
    .pipe(mocha({
      compilers: babel,
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

gulp.task('default', ['nodemon']);

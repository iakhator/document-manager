import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';
import path from 'path';
import shell from 'gulp-shell';

// Load the gulp plugins into the `plugins` variable
const plugins = loadPlugins();

// Compile all Babel Javascript into ES5 and place in dist folder
const paths = {
  js: ['./**/*.js', '!dist/**', '!node_modules/**', '!./server/tests/**']
};

// Compile all Babel Javascript into ES5 and put it into the dist dir
gulp.task('babel', () =>
  gulp.src(paths.js, { base: '.' })
    .pipe(plugins.babel())
    .pipe(gulp.dest('dist'))
);

gulp.task('migrate', shell.task([
  'cross-env NODE_ENV=test sequelize db:migrate',
]));

gulp.task('coverage', shell.task([
  'cross-env NODE_ENV=test nyc mocha ./server/test/**/*.js',
]));

// Restart server with on every changes made to file
gulp.task('nodemon', ['babel'], () =>
  plugins.nodemon({
    script: path.join('dist', 'index.js'),
    ignore: ['README.md', 'node_modules/**/*.js', 'dist/**/*.js'],
    ext: 'js',
    tasks: ['babel']
  })
);

gulp.task('test', ['migrate', 'coverage']);
gulp.task('default', ['nodemon']);
gulp.task('production', ['babel']);

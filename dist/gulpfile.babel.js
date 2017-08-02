'use strict';

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _gulpLoadPlugins = require('gulp-load-plugins');

var _gulpLoadPlugins2 = _interopRequireDefault(_gulpLoadPlugins);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _gulpExit = require('gulp-exit');

var _gulpExit2 = _interopRequireDefault(_gulpExit);

var _gulpIstanbul = require('gulp-istanbul');

var _gulpIstanbul2 = _interopRequireDefault(_gulpIstanbul);

var _gulpMocha = require('gulp-mocha');

var _gulpMocha2 = _interopRequireDefault(_gulpMocha);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Load the gulp plugins into the `plugins` variable
var plugins = (0, _gulpLoadPlugins2.default)();

_gulp2.default.task('tests', function () {
  _gulp2.default.src('./server/tests/*.js').pipe(plugins.babel()).pipe((0, _gulpMocha2.default)()).pipe((0, _gulpExit2.default)());
});

// Compile all Babel Javascript into ES5 and place in dist folder
var paths = {
  js: ['./**/*.js', '!dist/**', '!node_modules/**']
};

// Compile all Babel Javascript into ES5 and put it into the dist dir
_gulp2.default.task('babel', function () {
  return _gulp2.default.src(paths.js, { base: '.' }).pipe(plugins.babel()).pipe(_gulp2.default.dest('dist'));
});

_gulp2.default.task('pre-test', function () {
  return _gulp2.default.src(['server/**/*.js', '!server/test/', '!gulpfile.js'])
  // Covering files
  .pipe((0, _gulpIstanbul2.default)({ includeUntested: true })).pipe(_gulpIstanbul2.default.hookRequire());
});

_gulp2.default.task('test', ['pre-test'], function () {
  return _gulp2.default.src(['test/**/*spec.js']).pipe((0, _gulpMocha2.default)({
    reporter: 'mochawesome'
  }))
  // Creating the reports after tests ran
  .pipe(_gulpIstanbul2.default.writeReports({
    dir: './server/unit-test-coverage',
    reporters: ['html'],
    reportOpts: { dir: './unit-test-coverage' }
  })).pipe(_gulpIstanbul2.default.enforceThresholds({ thresholds: { global: 90 } }));
});

// Restart server with on every changes made to file
_gulp2.default.task('nodemon', ['babel'], function () {
  return plugins.nodemon({
    script: _path2.default.join('dist', 'index.js'),
    ignore: ['README.md', 'node_modules/**/*.js', 'dist/**/*.js'],
    ext: 'js',
    tasks: ['babel']
  });
});

_gulp2.default.task('test', ['tests']);
_gulp2.default.task('default', ['nodemon']);
_gulp2.default.task('production', ['babel']);
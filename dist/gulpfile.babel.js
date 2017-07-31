'use strict';

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _gulpLoadPlugins = require('gulp-load-plugins');

var _gulpLoadPlugins2 = _interopRequireDefault(_gulpLoadPlugins);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _gulpMocha = require('gulp-mocha');

var _gulpMocha2 = _interopRequireDefault(_gulpMocha);

var _gulpIstanbul = require('gulp-istanbul');

var _gulpIstanbul2 = _interopRequireDefault(_gulpIstanbul);

var _gulpInjectModules = require('gulp-inject-modules');

var _gulpInjectModules2 = _interopRequireDefault(_gulpInjectModules);

var _gulpExit = require('gulp-exit');

var _gulpExit2 = _interopRequireDefault(_gulpExit);

var _gulpCoveralls = require('gulp-coveralls');

var _gulpCoveralls2 = _interopRequireDefault(_gulpCoveralls);

var _gulpCoverage = require('gulp-coverage');

var _gulpCoverage2 = _interopRequireDefault(_gulpCoverage);

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

_gulp2.default.task('coverage', function () {
  _gulp2.default.src('dist/server/test/**/*.js', { read: false }).pipe(_gulpCoverage2.default.instrument({
    pattern: ['server/controllers/**/*.js'],
    debugDirectory: 'debug'
  })).pipe((0, _gulpMocha2.default)()).pipe(_gulpCoverage2.default.gather()).pipe(_gulpCoverage2.default.format()).pipe(_gulp2.default.dest('reports'));
});

_gulp2.default.task('coveralls', function () {
  return _gulp2.default.src('./coverage/lcov').pipe((0, _gulpCoveralls2.default)());
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
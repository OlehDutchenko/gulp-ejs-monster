'use strict';

/**
 * @fileOverview Testing
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 1.0.0
 */

// ----------------------------------------
// Imports
// ----------------------------------------

// modules
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const argv = require('yargs').argv;
const del = require('del');
const jsdoc = require('gulp-jsdoc3');

// plugin
const ejsMonster = require('./index');

// ----------------------------------------
// Private
// ----------------------------------------

/**
 * Debugging flag
 * @const {boolean}
 * @private
 */
const debugFlag = !!argv.debug;

/**
 * Production flag
 * @const {boolean}
 * @private
 */
const prodFlag = !!argv.p || !!argv.production;

/**
 * Plugin user options
 * @const {Object}
 * @private
 */
const ejsOptions = {
	beautify: prodFlag,
	debug: debugFlag,
	layouts: './examples/src/_layouts',
	widgets: './examples/src/_widgets',
	includes: './examples/src/_includes',
	compileDebug: debugFlag,
	delimiter: '%',
	localsName: 'locals',
	locals: {
		customProp: 'customProp'
	}
};

// ----------------------------------------
// Tasks
// ----------------------------------------

gulp.task('ejs', function () {
	return gulp.src('./examples/src/*.ejs')
		.pipe(ejsMonster(ejsOptions).on('error', ejsMonster.preventCrash))
		.pipe(gulp.dest('./examples/dist/'));
});

gulp.task('watch', gulp.series('ejs', function () {
	gulp.watch('./examples/src/*.ejs', gulp.series('ejs'));
}));

gulp.task('docs-locals', gulp.series(function () {
	return del('./docs/locals-api/');
}, function () {
	let jsdocConfig = {
		source: {
			includePattern: '.+\\.js(docs|x)?$',
			excludePattern: '(^|\\/|\\\\)_'
		},
		tags: {
			allowUnknownTags: true,
			dictionaries: [
				'jsdoc',
				'closure'
			]
		},
		opts: {
			destination: './docs/locals-api/',
			verbose: false,
			encoding: 'utf8',
			template: './node_modules/jsdoc-simple-theme/',
			recurse: true
		},
		plugins: [
			'plugins/markdown',
			'./node_modules/jsdoc-export-default-interop/dist/index',
			'./node_modules/jsdoc-ignore-code/index',
			'./node_modules/jsdoc-sourcecode-tag/index'
		],
		markdown: {
			parser: 'gfm',
			hardwrap: true
		},
		templates: {
			cleverLinks: false,
			monospaceLinks: false,
			systemName: 'locals API',
			default: {
				outputSourceFiles: true,
				layoutFile: './node_modules/jsdoc-simple-theme/tmpl/layout.tmpl'
			}
		}
	};

	return gulp.src('./methods/**/*.js', {buffer: false})
		.pipe(jsdoc(jsdocConfig, function () {
			console.log('done');
		}));
}))

gulp.task('test-setup-options', function () {
	return gulp.src('./tests/setup-options.js', {read: false})
		.pipe(mocha({
			reporter: 'spec'
		}))
		.once('error', () => {
			process.exit(1);
		});
});

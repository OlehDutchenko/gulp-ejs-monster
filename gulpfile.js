'use strict';

/**
 * @fileOverview Testing
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 1.0.0
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const gulp = require('gulp');
const argv = require('yargs').argv;

const ejsMonster = require('./index');

// ----------------------------------------
// Private
// ----------------------------------------

const debugFlag = !!argv.debug;
const prodFlag = !!argv.p || !!argv.production;

const ejsOptions = {
	layouts: './examples/src/layouts/',
	partials: './examples/src/partials/',
	requires: './examples/src/requires/',
	includes: './examples/src/includes/',
	beautify: prodFlag,
	debug: debugFlag,
	ejs: {
		compileDebug: debugFlag,
		delimiter: '%',
		localsName: 'locals',
		locals: {
			customProp: 'customProp'
		}
	}
};

// ----------------------------------------
// Public
// ----------------------------------------

gulp.task('ejs', function () {
	return gulp.src('./examples/src/*.ejs')
		.pipe(ejsMonster(ejsOptions).on('error', ejsMonster.preventCrash))
		.pipe(gulp.dest('./examples/dist/'));
});

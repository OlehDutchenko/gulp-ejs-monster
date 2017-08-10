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

const ejsMonster = require('./index');

// ----------------------------------------
// Private
// ----------------------------------------

const ejsData = {};
const ejsOptions = {
	layouts: './examples/src/layouts/',
	partials: './examples/src/partials/',
	requires: './examples/src/requires/',
	includes: './examples/src/includes/',
	beautify: true,
	debug: false,
	ejs: {
		compileDebug: true,
		rmWhitespace: true,
		delimiter: '%',
		localsName: 'App'
	}
};

// ----------------------------------------
// Public
// ----------------------------------------

gulp.task('ejs', function () {
	return gulp.src('./examples/src/*.ejs')
		.pipe(ejsMonster(ejsData, ejsOptions).on('error', ejsMonster.onError))
		.pipe(gulp.dest('./examples/dist/'));
});

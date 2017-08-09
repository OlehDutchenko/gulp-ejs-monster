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
	partials: './examples/src/partials/',
	layouts: './examples/src/layouts/',
	beautify: true,
	ejs: {
		compileDebug: true,
		delimiter: '%',
		localsName: 'App'
	}
};

// ----------------------------------------
// Public
// ----------------------------------------

gulp.task('ejs', function () {
	return gulp.src('./examples/src/*.ejs')
		.pipe(ejsMonster(ejsData, ejsOptions).on('error', ejsMonster.logError))
		.pipe(gulp.dest('./examples/dist/'));
});

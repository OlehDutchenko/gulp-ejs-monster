'use strict';

/**
 * Описание модуля
 * @module
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
	ejs: {
		debug: false,
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

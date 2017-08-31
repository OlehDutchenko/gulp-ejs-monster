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

// plugin
const ejsMonster = require('./index');

// options
const userOptions = require('./tests/data/ejs-options');

// ----------------------------------------
// Tasks
// ----------------------------------------

gulp.task('ejs', function () {
	return gulp.src('./examples/src/*.ejs')
		.pipe(ejsMonster(userOptions).on('error', ejsMonster.preventCrash))
		.pipe(gulp.dest('./examples/dist/'));
});

gulp.task('watch', gulp.series('ejs', function () {
	gulp.watch('./examples/src/*.ejs', gulp.series('ejs'));
}));

gulp.task('test-setup-options', function () {
	return gulp.src('./tests/setup-options.js', {read: false})
		.pipe(mocha({
			reporter: 'spec'
		}))
		.once('error', () => {
			process.exit(1);
		});
});

'use strict';

/**
 * Tests
 * @module
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const gulp = require('gulp');
const mocha = require('gulp-mocha');

const ejsMonster = require('./index');

// ----------------------------------------
// Private
// ----------------------------------------

gulp.task('test-setup-options', function() {
	return gulp.src('./tests/setup-options.js', {read: false})
		.pipe(mocha({reporter: 'spec'}));
})

// ----------------------------------------
// Public
// ----------------------------------------

gulp.task('ejs', function () {
	return gulp.src('./examples/src/*.ejs')
		.pipe(ejsMonster({}, {
		}))
		.pipe(gulp.dest('./examples/dist/'))
})

// ----------------------------------------
// Exports
// ----------------------------------------

// Если это модуль, он должен экспортировать
// Описаный в нем функционал или данные из текущего файла

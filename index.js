'use strict';

/**
 * > Gulp plugin for [ejs](http://ejs.co/). Version for [Wezom](wezom.com.ua) projects.
 * The project is inspired by [ejs-locals](https://github.com/RandomEtc/ejs-locals)
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 1.0.0
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const path = require('path');
const through2 = require('through2');
const gutil = require('gulp-util');
const notSupportedFile = require('gulp-not-supported-file');
const ejsMonster = require('./monster');

// ----------------------------------------
// Private
// ----------------------------------------

/**
 * @const {string}
 * @private
 */
const pluginName = 'gulp-ejs-monster';

/**
 * Create new error
 * @const {function}
 * @param {Object} data
 * @param [options={}]
 * @return {PluginError}
 */
const pluginError = (data, options) => new gutil.PluginError(pluginName, data, options);

// ----------------------------------------
// Public
// ----------------------------------------

function gulpEjsMonster (data, options) {
	/**
	 * Transformation of the current file
	 * @param {Object} file
	 * @param {String} [enc]
	 * @param {Function} isDone
	 */
	function readBuffer (file, enc, isDone) {
		let notSupported = notSupportedFile(file, pluginError);

		if (Array.isArray(notSupported)) {
			notSupported.shift();
			return isDone(...notSupported);
		}
		ejsMonster(data, options, file);
		return isDone(null, file);
	}
	return through2.obj(readBuffer);
}

gulpEjsMonster.pluginName = pluginName;

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = gulpEjsMonster;

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

const ejs = require('ejs');
const through2 = require('through2');
const chalk = require('chalk');
const gutil = require('gulp-util');
const notSupportedFile = require('gulp-not-supported-file');
const lodash = require('lodash');

const pkg = require('./package.json');
const configOptions = require('./utils/config-options');
const crashedLog = require('./utils/crashed-log');

// ----------------------------------------
// Private
// ----------------------------------------

/**
 * Create new error
 * @const {function}
 * @param {Object} data
 * @param [options={}]
 * @return {PluginError}
 */
const pluginError = (data, options) => new gutil.PluginError(pkg.name, data, options);

/**
 * is options not configured?
 * @type {boolean}
 * @private
 */
let isNotConfigured = true;

// ----------------------------------------
// Public
// ----------------------------------------

function gulpEjsMonster (data = {}, options = {}) {
	if (isNotConfigured) {
		options = configOptions(options);
	}

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

		function renderFile (filePath) {
			ejs.renderFile(filePath, data, options.ejs, (error, markup) => {
				if (error) {
					crashedLog(filePath);
					return ejs.renderFile(filePath, data, lodash.merge(options.ejs, {compileDebug: true}), (err) => {
						crashedLog.detected(err);
						return isDone(err);
					});
				}
				console.log(markup);

				return isDone(null, file);
			})
		}

		renderFile(file.path);
	}
	return through2.obj(readBuffer);
}

gulpEjsMonster.pluginName = pkg.name;

gulpEjsMonster.logError = function logError (error) {
	this.emit('end');
};

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = gulpEjsMonster;

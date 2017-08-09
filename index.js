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
const chalk = require('chalk');
const through2 = require('through2');
const gutil = require('gulp-util');
const notSupportedFile = require('gulp-not-supported-file');
const lodash = require('lodash');

const pkg = require('./package.json');
const configOptions = require('./utils/config-options');
const crashed = require('./utils/crashed');
const DataStorage = require('./utils/data-storage');

const partialMethod = require('./locals/partial');

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

const storage = new DataStorage();

// ----------------------------------------
// Public
// ----------------------------------------

function gulpEjsMonster (data = {}, options = {}) {
	if (isNotConfigured) {
		options = configOptions(options);
		data.partial = partialMethod(options, storage);
	}
	const ejsOptions = options.ejs;
	storage.reset();

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
			data.fileChanged = true;
			ejs.renderFile(filePath, data, ejsOptions, (error, markup) => {
				if (error) {
					if (ejsOptions.compileDebug) {
						crashed(error, storage, ejsOptions);
						return isDone(error);
					}

					crashed.reRenderLog(filePath);
					storage.push(chalk.red('→ CRASH...\n'), false, '>');
					storage.indent('<<<<');
					storage.push('re-render file with compileDebug', file.path);

					return ejs.renderFile(filePath, data, lodash.merge(ejsOptions, {compileDebug: true}), (err) => {
						crashed(err, storage, ejsOptions);
						return isDone(err);
					});
				}

				file.contents = Buffer.from(markup);
				file.extname = options.extname;

				return isDone(null, file);
			});
		}

		storage.push('render view', file.path);
		renderFile(file.path);
	}
	return through2.obj(readBuffer);
}

gulpEjsMonster.pluginName = pkg.name;

gulpEjsMonster.logError = function logError () {
	this.emit('end');
};

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = gulpEjsMonster;

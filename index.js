'use strict';

/**
 * > Gulp plugin for [ejs](http://ejs.co/). Version for [Wezom](wezom.com.ua) projects.
 * The project is inspired by [ejs-locals](https://github.com/RandomEtc/ejs-locals)
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 1.0.0
 * @requires utils/config-options
 * @requires utils/crashed
 * @requires utils/beautify
 * @requires utils/data-storage
 * @requires methods/partial
 * @requires methods/set-layout
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const path = require('path');
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

const partialMethod = require('./methods/partial');
const setLayoutMethod = require('./methods/set-layout');

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

/**
 * History storage
 * @const {DataStorage}
 * @private
 */
const storage = new DataStorage();

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Core plugin method
 * @param {Object} data
 * @param {Object} options
 * @returns {DestroyableTransform}
 */
function gulpEjsMonster (data = {}, options = {}) {
	if (isNotConfigured) {
		options = configOptions(options);
		data.partial = partialMethod(options, storage);
		data.setLayout = setLayoutMethod(options);
	}
	const ejsOptions = options.ejs;
	storage.reset();

	/**
	 * Read buffer and transform
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

		/**
		 * Render given file
		 * @param {string} filePath - resolved file path
		 */
		function renderFile (filePath) {
			data.fileChanged = true;
			ejs.renderFile(filePath, data, ejsOptions, (error, markup) => {
				// if get error - try to detect what's went wrong
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

				// if file has layout - render
				if (data.layout) {
					let layoutPath = data.layout;
					storage.indent('<<<<');
					storage.push('render layout', layoutPath, '>');
					data.body = markup;
					delete data.layout;

					return renderFile(layoutPath);
				}

				// format markup
				if (options.beautify) {
					let beautifyPath = path.join(__dirname, './utils/beautify');
					let beautify = require(beautifyPath);

					markup = beautify(markup);
				}

				// change file data
				file.contents = Buffer.from(markup);
				file.extname = options.extname;

				// all done - go out
				return isDone(null, file);
			});
		}

		storage.push('render view', file.path);
		renderFile(file.path);
	}
	return through2.obj(readBuffer);
}

/**
 * Plugin name
 * @type {string}
 */
gulpEjsMonster.pluginName = pkg.name;

/**
 * Plumb on error
 * @type {Function}
 */
gulpEjsMonster.onError = function () {
	this.emit('end');
};

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = gulpEjsMonster;

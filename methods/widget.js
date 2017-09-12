'use strict';

/**
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 3.0.0
 */

// ----------------------------------------
// Imports
// ----------------------------------------

// modules
const path = require('path');
const ejs = require('ejs');
const lodash = require('lodash');
const chalk = require('chalk');

// data
const params = require('../utils/params');

// utils
const createFileCache = require('../utils/file-cache');

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * [FW] Create `[localsName].widget()` method
 * @param {Object} options - plugin options
 * @param {string} options.widgets - resolved path to the "widgets" folder
 * @param {Object} options.ejs - ejs render options
 * @param {HistoryStorage} storage
 * @returns {Function}
 * @sourceCode
 */
function createWidgetMethod (options, storage) {
	const folder = options.widgets;
	const ejsOptions = options.ejs;
	const cached = createFileCache(storage);

	/**
	 * widget method
	 * @param {string} filePath - relative path to the file, with extension
	 * @param {Object} [entry={}] - entry data for widget
	 * @param {boolean} [cacheRenderResult] - cache render result
	 * @returns {string} ejs rendered markup
	 * @memberOf locals
	 * @sourceCode
	 */
	function widget (filePath, entry = {}, cacheRenderResult) {
		if (!filePath || typeof filePath !== 'string') {
			throw new Error('widget without filePath');
		}
		if (!/\.ejs$/.test(filePath)) {
			throw new Error(`widget is not a *.ejs file → "${filePath}"`);
		}
		filePath = path.join(folder, filePath);
		storage.push('> render widget', filePath, '>>');

		// remember prev status
		let fileChanged = this.fileChanged;
		let hasEntry = this.hasOwnProperty('entry');
		let prevEntry = lodash.merge({}, this.entry);

		// set new entry
		this.entry = lodash.merge({}, entry);

		// get data
		let data = cached(filePath);

		this.fileChanged = data.changed;

		// file current status
		storage.push(chalk.gray(data.changed ? '√ file changed' : '! file not changed'), false, '>');

		// render template
		let markup;

		if (cacheRenderResult && !data.changed && data.cachedRenderResult) {
			storage.push(chalk.gray('! get cached render result'));
			markup = data.cachedRenderResult;
		} else {
			storage.push(chalk.gray('! render file content'));
			markup = ejs.render(data.content, this, lodash.merge(ejsOptions, {filename: params.newline + filePath}));
			if (cacheRenderResult) {
				storage.push(chalk.gray('! caching render result'));
				data.cachedRenderResult = markup;
			}
		}

		// return remembered
		this.fileChanged = fileChanged;
		if (hasEntry) {
			this.entry = prevEntry;
		}

		// go out
		storage.indent('<<<');
		return markup;
	}

	return widget;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = createWidgetMethod;

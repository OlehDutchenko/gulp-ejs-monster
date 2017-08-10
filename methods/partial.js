'use strict';

/**
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 1.0.0
 * @requires utils/file-cache
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const path = require('path');
const ejs = require('ejs');
const lodash = require('lodash');
const chalk = require('chalk');

const pkg = require('../package.json');
const createFileCache = require('../utils/file-cache');

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * [FW] Create `[localsName].partial()` method
 * @param {Object} options - plugin options
 * @param {Object} options.partials - resolved path to the "partials" folder
 * @param {Object} options.ejs - ejs render options
 * @param {DataStorage} storage
 * @returns {Function}
 * @sourceCode
 */
function partialMethod (options, storage) {
	const folder = options.partials;
	const ejsOptions = options.ejs;
	const cached = createFileCache();

	/**
	 * partial method
	 * @param {string} filePath - relative path to the file, without extension
	 * @param {Object} [entry={}] - entry data for partial
	 * @param {boolean} [noCache] - don't cache file contents
	 * @returns {string}
	 */
	function partial (filePath, entry = {}, noCache) {
		if (!filePath || typeof filePath !== 'string') {
			throw new Error('partial without filePath');
		}
		filePath = path.join(folder, filePath + '.ejs');
		storage.push('> render partial', filePath, '>>');

		// remember prev status
		let fileChanged = this.fileChanged;
		let hasEntry = this.hasOwnProperty('entry');
		let prevEntry = lodash.merge({}, this.entry);

		// set new entry
		this.entry = lodash.merge({}, entry);

		// get data
		let data = cached(filePath, noCache);

		this.fileChanged = data.changed;

		// file current status
		storage.push(chalk.gray(data.changed ? '√ file changed' : '< file not changed'), false, '>');

		// render template
		let markup = ejs.render(data.content, this, lodash.merge(ejsOptions, {filename: pkg.gulpEjsMonster.newline + filePath}));

		// return remembered
		this.fileChanged = fileChanged;
		if (hasEntry) {
			this.entry = prevEntry;
		}

		// go out
		storage.indent('<<<');
		return markup;
	}

	return partial;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = partialMethod;

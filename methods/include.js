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
const chalk = require('chalk');

const createFileCache = require('../utils/file-cache');

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * [FW] Create `[localsName].include()` method
 * @param {Object} options - plugin options
 * @param {string} options.includes - resolved path to the "partials" folder
 * @param {DataStorage} storage
 * @returns {Function}
 * @sourceCode
 */
function createIncludeMethod (options, storage) {
	const folder = options.includes;
	const cached = createFileCache(storage);

	/**
	 * include method
	 * @param {string} filePath - relative path to the file, without extension
	 * @param {boolean} [noCache] - don't cache file contents
	 * @returns {string}
	 * @memberOf locals
	 * @sourceCode
	 */
	function include (filePath, noCache) {
		if (!filePath || typeof filePath !== 'string') {
			throw new Error('include without filePath');
		}
		filePath = path.join(folder, filePath);
		storage.push('> include file', filePath, '>>');

		// get data
		let data = cached(filePath, noCache);
		data.toString = function () {
			return this.content;
		}

		// file current status
		storage.push(chalk.gray(data.changed ? '√ file changed' : '< file not changed'), false, '>');

		// go out
		storage.indent('<<<');
		return data;
	}

	return include;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = createIncludeMethod;

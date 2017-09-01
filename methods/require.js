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
const chalk = require('chalk');

// utils
const createFileCache = require('../utils/file-cache');

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * [FW] Create `[localsName].require()` method
 * @param {Object} options - plugin options
 * @param {string} options.requires - resolved path to the "widgets" folder
 * @param {HistoryStorage} storage
 * @returns {Function}
 * @sourceCode
 */
function createRequireMethod (options, storage) {
	const folder = options.requires;
	const cached = createFileCache(storage);

	/**
	 * require method
	 * @param {string} filePath - relative path to the file or package name
	 * @param {boolean} [noCache=false] - don't cache file contents
	 * @returns {*}
	 * @method require
	 * @memberOf locals
	 * @sourceCode
	 */
	function requireFile (filePath, noCache) {
		let result = null;
		let resolvedPath = path.join(folder, filePath);
		storage.push('> require file', resolvedPath, '>>');

		if (noCache) {
			delete require.cache[resolvedPath];
			storage.push(chalk.gray('  no cache'));
			result = require(resolvedPath);
			delete require.cache[resolvedPath];
		} else {
			let data = cached(resolvedPath, false, true);
			if (data.changed) {
				delete require.cache[resolvedPath];
			}
			storage.push(chalk.gray(data.changed ? '√ file changed' : '< file not changed'), false, '>');
			result = require(resolvedPath);
		}

		storage.indent('<<<');
		return result;
	}

	return requireFile;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = createRequireMethod;

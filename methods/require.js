'use strict';

/**
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 3.1.0
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
	 * @param {string} filePath - relative path to the file
	 * @param {string} relativeFolderPath - starts relative path from custom folder
	 * @returns {*}
	 * @method require
	 * @memberOf locals
	 * @sourceCode
	 */
	function requireFile (filePath, relativeFolderPath) {
		let resolvedPath = '';
		if (relativeFolderPath) {
			resolvedPath = path.join(relativeFolderPath, filePath);
		} else {
			resolvedPath = path.join(folder, filePath);
		}

		storage.push('> require file', resolvedPath, '>>');
		let data = cached(resolvedPath, true);
		if (data.changed) {
			delete require.cache[resolvedPath];
		}

		storage.push(chalk.gray(data.changed ? '√ file changed' : '! file not changed'), false, '>');
		storage.indent('<<<');
		return require(resolvedPath);
	}

	return requireFile;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = createRequireMethod;

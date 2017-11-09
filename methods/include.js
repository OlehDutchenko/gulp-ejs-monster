'use strict';

/**
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 3.1.0
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
 * @param {HistoryStorage} storage
 * @returns {Function}
 * @sourceCode
 */
function createIncludeMethod (options, storage) {
	const folder = options.includes;
	const cached = createFileCache(storage);

	/**
	 * include method
	 * @param {string} filePath - relative path to the file, without extension
	 * @param {string} relativeFolderPath - starts relative path from custom folder
	 * @returns {Object}
	 * @memberOf locals
	 * @sourceCode
	 */
	function include (filePath, relativeFolderPath) {
		if (!filePath || typeof filePath !== 'string') {
			throw new Error('include without filePath');
		}

		if (relativeFolderPath) {
			filePath = path.join(relativeFolderPath, filePath);
		} else {
			filePath = path.join(folder, filePath);
		}
		storage.push('> include file', filePath, '>>');

		// get data
		let data = cached(filePath);
		data.toString = function () {
			return this.content;
		};

		// file current status
		storage.push(chalk.gray(data.changed ? '√ file changed' : '! file not changed'), false, '>');

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

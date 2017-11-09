'use strict';

/**
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 3.0.9
 */

// ----------------------------------------
// Imports
// ----------------------------------------

// modules
const fs = require('fs');
const chalk = require('chalk');

// ----------------------------------------
// Private
// ----------------------------------------

/**
 * @param {string} filePath
 * @return {number}
 * @private
 */
function getModifiedTime (filePath) {
	let mtime = fs.statSync(filePath).mtime;
	return mtime.getTime();
}

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * [FW] create file cache storage
 * @returns {Function}
 * @sourceCode
 */
function createFileCache (storage) {
	const cache = {};

	/**
	 * Checkout filePath and cache file contents
	 * @param {string} filePath - resolved path
	 * @param {boolean} [noRead] - don't read file
	 * @returns {Object}
	 */
	function cached (filePath, noRead) {
		let cacheData = cache[filePath];
		let mtime = getModifiedTime(filePath);

		if (cacheData && cacheData.mtime === mtime) {
			storage.push(chalk.gray('  getting file content from cache'));
			cacheData.changed = false;
			return cacheData;
		}

		cache[filePath] = {
			mtime,
			content: noRead ? null : fs.readFileSync(filePath, 'utf-8'),
			changed: true
		};

		storage.push(chalk.gray('  caching new file content'));
		return cache[filePath];
	}

	return cached;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = createFileCache;

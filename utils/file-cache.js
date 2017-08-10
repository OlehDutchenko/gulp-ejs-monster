'use strict';

/**
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 1.0.0
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const fs = require('fs');

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
function createFileCache () {
	const cache = {};

	/**
	 * Checkout filePath and cache file contents
	 * @param {string} filePath - resolved path
	 * @param {boolean} [noCache] - don't cache file contents
	 * @returns {Object}
	 */
	function cached (filePath, noCache) {
		if (noCache) {
			return {
				content: fs.readFileSync(filePath).toString(),
				mtime: 1,
				changed: true
			};
		}

		let cacheData = cache[filePath];
		let mtime = getModifiedTime(filePath);

		if (cacheData && cacheData.mtime === mtime) {
			cacheData.changed = false;
			return cacheData;
		}

		cache[filePath] = {
			mtime,
			content: fs.readFileSync(filePath, 'utf-8'),
			changed: true
		};

		return cache[filePath];
	}

	return cached;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = createFileCache;

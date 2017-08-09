'use strict';

/**
 * @module
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const fs = require('fs');

// ----------------------------------------
// Private
// ----------------------------------------

/**
 * @param  {String}   filePath
 * @return {Number}
 * @private
 */
function getModifiedTime (filePath) {
	let mtime = fs.statSync(filePath).mtime;
	return mtime.getTime();
}

// ----------------------------------------
// Public
// ----------------------------------------

function createFileCache () {
	const cache = {};

	return function (filePath, noCache) {
		if (noCache) {
			return {
				template: fs.readFileSync(filePath).toString(),
				mtime: 1,
				changed: true
			};
		}

		let cacheData = cache[filePath];
		let mtime = getModifiedTime(filePath);

		if (cacheData) {
			if (mtime === cacheData.mtime) {
				cacheData.changed = false;
				return cacheData;
			}
		}

		cache[filePath] = {
			mtime,
			template: fs.readFileSync(filePath, 'utf-8'),
			changed: true
		};

		return cache[filePath];
	};
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = createFileCache;

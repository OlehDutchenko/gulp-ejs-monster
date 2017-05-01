/**
 * > Retrieving data on a file
 * @module lib/utils/get-file-data
 * @author Oleg Dutchenko <dutchenko.o.wezom@gmail.com>
 * @version 0.0.1
 */

'use strict';

const fs = require('fs');

/**
 * Глобальный кеш
 * @private
 * @const {Object}
 * @sourcecode
 */
const globalCache = {};

/**
 * Возвращает дату модификации, переведенную в миллисекунды
 * @private
 * @param  {String}   filePath
 * @return {Number}
 * @sourcecode
 */
function getModifiedTime(filePath) {
	var mtime = fs.statSync(filePath).mtime;
	return mtime.getTime();
}

/**
 * @static
 * @param  {String}   filePath
 * @param  {Boolean}  [noCache=false]
 * @return {Object}
 * @sourceCode |+26
 */
const getFileData = module.exports = function (filePath, noCache) {
	if (noCache) {
		return {
			content: fs.readFileSync(filePath, 'utf-8'),
			mtime: 1,
			changed: true
		};
	}

	let cacheData = globalCache[filePath];
	let mtime = getModifiedTime(filePath);

	if (cacheData) {
		if (mtime == cacheData.mtime) {
			cacheData.changed = false;
			return cacheData;
		}
	}

	return globalCache[filePath] = {
		mtime,
		content: fs.readFileSync(filePath, 'utf-8'),
		changed: true
	};
};

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
 * [FW] Create `[localsName].require()` method
 * @param {Object} options - plugin options
 * @param {Object} options.requires - resolved path to the "requires" folder
 * @param {Object} options.ejs - ejs render options
 * @param {DataStorage} storage
 * @returns {Function}
 * @sourceCode
 */
function requireMethod (options, storage) {
	const folder = options.requires;
	const ejsOptions = options.ejs;
	const cached = createFileCache(storage);

	/**
	 * require method
	 * @param {string} filePath - relative path to the file, without extension
	 * @param {Object} [entry={}] - entry data for require
	 * @param {boolean} [noCache] - don't cache file contents
	 * @returns {string}
	 */
	function requireFn (filePath, entry = {}, noCache) {
		if (!filePath || typeof filePath !== 'string') {
			throw new Error('require without filePath');
		}
		if (/\.ejs$/.test(filePath)) {
			throw new Error(`requiring *.ejs file → "${filePath}"\nuse partial() or layout() methods for this files`);
		}

		if (pkg.dependencies[filePath] || pkg.devDependencies[filePath]) {
			function req (requirePath) {
				return require(requirePath);
			}
			return req(filePath);
		}

		let resolvedPath = path.join(folder, filePath);
		let extname = path.extname(filePath);
		let result = '';

		return false;

		switch (extname) {
			case '.json':
				function req (requirePath) {
					return require(requirePath);
				}
				result = req(resolvedPath);
				break;
			case '.js':
				break;
			case '.md':
				break;
			default:
				throw new Error(`requiring *${extname} file → "${filePath}"\nthis extension not available for requiring`);
		}

		return result;
	}

	return requireFn;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = requireMethod;

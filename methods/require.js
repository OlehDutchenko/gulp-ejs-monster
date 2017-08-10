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
	const cached = createFileCache(storage);
	const extnames = ['.json', '.js', '.md', '.scss'];

	/**
	 * @param {string} resolvedPath
	 * @param {boolean} noCache
	 * @returns {Object}
	 * @private
	 */
	function requireJsonFile (resolvedPath, noCache) {
		let result = null;

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

		return result;
	}

	/**
	 * @param {Object} locals
	 * @param {string} resolvedPath
	 * @param {Object} entry - entry data for require
	 * @param {boolean} noCache
	 * @returns {Object}
	 * @private
	 */
	function requireJsFile (locals, resolvedPath, entry, noCache) {
		// remember prev status
		let fileChanged = locals.fileChanged;
		let hasEntry = locals.hasOwnProperty('entry');
		let prevEntry = lodash.merge({}, locals.entry);

		// set new entry
		locals.entry = lodash.merge({}, entry);

		// get data
		let data = cached(resolvedPath, noCache);
		let delimiters = ' ' + options.delimiters.end + options.delimiters.start;
		let template = delimiters + data.content + delimiters;
		console.log(template);
		return '';

		///////// TODO go on!

		locals.fileChanged = data.changed;

		// file current status
		storage.push(chalk.gray(data.changed ? '√ file changed' : '< file not changed'), false, '>');

		// render template
		let result = ejs.render(data.content, this, lodash.merge(ejsOptions, {filename: pkg.gulpEjsMonster.newline + filePath}));

		// return remembered
		this.fileChanged = fileChanged;
		if (hasEntry) {
			this.entry = prevEntry;
		}

		// go out
		storage.indent('<<<');
		return result;
	}

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

		let extname = path.extname(filePath);
		let result = '';

		if (!extname) {
			try {
				storage.push(`> requiring module`, false, '>>');
				if (require.cache[require.resolve(filePath)]) {
					storage.push(chalk.gray(`  module is cached`));
				}
				result = require(filePath);
			} catch (error) {
				throw new Error(error.message);
			}

			storage.indent('<<');
			return result;
		}

		if (!~extnames.indexOf(extname)) {
			throw new Error(`requiring *${extname} file → "${filePath}"\nthis extension not available for requiring`);
		}
		let resolvedPath = path.join(folder, filePath);

		storage.push(`> requiring file`, filePath, '>>');
		switch (extname) {
			case '.json':
				result = requireJsonFile(resolvedPath, noCache);
				break;
			case '.js':
				result = requireJsFile(this, resolvedPath, entry, noCache);
				break;
			case '.md':
				break;
			default:
				throw new Error(`requiring unknown extension "${extname}"`);
		}

		storage.indent('<<<');
		return result;
	}

	return requireFn;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = requireMethod;

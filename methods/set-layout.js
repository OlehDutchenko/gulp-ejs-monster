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

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * [FW] Create `[localsName].setLayout()` method
 * @param {Object} options - plugin options
 * @param {string} options.layouts - resolved path to the "layouts" folder
 * @param {HistoryStorage} storage
 * @returns {Function}
 * @sourceCode
 */
function createSetLayoutMethod (options, storage) {
	const folder = options.layouts;

	/**
	 * Resolve and add filePath as `layout` property
	 * @param {string} filePath - relative path to the file, with extension
	 * @memberOf locals
	 * @sourceCode
	 */
	function setLayout (filePath) {
		if (!filePath || typeof filePath !== 'string') {
			throw new Error('layout without filePath');
		}
		if (!/\.ejs$/.test(filePath)) {
			throw new Error(`layout is not a *.ejs file → "${filePath}"`);
		}
		this.layout = path.join(folder, filePath);
		storage.push('> set layout', this.layout, '>>');
		storage.indent('<<');
	}

	return setLayout;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = createSetLayoutMethod;

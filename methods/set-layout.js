'use strict';

/**
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 1.0.0
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const path = require('path');

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * [FW] Create `[localsName].setLayout()` method
 * @param {Object} options - plugin options
 * @param {string} options.layouts - resolved path to the "layouts" folder
 * @returns {Function}
 * @sourceCode
 */
function createSetLayoutMethod (options) {
	const folder = options.layouts;

	/**
	 * Resolve and add filePath as `layout` property
	 * @param {string} filePath - relative path to the file, with extension
	 */
	function setLayout (filePath) {
		if (!filePath || typeof filePath !== 'string') {
			throw new Error('layout without filePath');
		}
		if (!/\.ejs$/.test(filePath)) {
			throw new Error(`layout is not a *.ejs file → "${filePath}"`);
		}
		this.layout = path.join(folder, filePath);
	}

	return setLayout;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = createSetLayoutMethod;

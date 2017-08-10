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
 * @param {Object} options.layouts - resolved path to the "layouts" folder
 * @returns {Function}
 * @sourceCode
 */
function setLayoutMethod (options) {
	const folder = options.layouts;

	/**
	 * Resolve and add filePath as `layout` property
	 * @param {string} filePath - relative path to the file, without extension
	 */
	function setLayout (filePath) {
		this.layout = path.join(folder, filePath + '.ejs');
	}

	return setLayout;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = setLayoutMethod;

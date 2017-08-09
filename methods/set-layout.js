'use strict';

/**
 * @module
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const path = require('path');

// ----------------------------------------
// Public
// ----------------------------------------

function setLayoutMethod (options) {
	const folder = options.layouts;

	return function (filePath) {
		this.layout = path.join(folder, filePath + '.ejs');
	};
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = setLayoutMethod;

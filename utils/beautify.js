'use strict';

/**
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 1.0.0
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const jsBeautify = require('js-beautify');

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Beautify markup
 * @param {string} markup
 * @param {Object} options
 * @returns {string}
 */
function beautify (markup, options) {
	return jsBeautify.html(markup, options);
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = beautify;

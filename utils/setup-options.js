'use strict';

/**
 * Setup user options
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 3.0.0
 */

// ----------------------------------------
// Imports
// ----------------------------------------

// modules
const path = require('path');
const lodash = require('lodash');

// ----------------------------------------
// Private
// ----------------------------------------



// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Transform user options to processing options
 * @param {Object} [opts={}]
 * @returns {Object}
 */
function setupOptions (opts = {}) {
	const options = {
		ejs: {}
	};
	const optsEjs = lodash.merge({}, opts.ejs);
	const ejs = options.ejs;

	return options;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = setupOptions;

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

/**
 * Should return string value
 * with length === 1 and one of values ['%','?','&','$']
 * @param {string} delimiter
 * @returns {string} `'%'` by default
 * @private
 */
function setDelimiter (delimiter) {
	if (typeof delimiter === 'string' && (~['%', '?', '&', '$'].indexOf(delimiter))) {
		return delimiter;
	}
	return '%';
}

/**
 * Should return string value
 * with length 1 or more and correct property name
 * @param {string} localsName
 * @returns {string} `'locals'` by default
 * @private
 */
function setLocalsName (localsName) {
	if (typeof localsName === 'string' && localsName) {
		return localsName;
	}
	return 'locals';
}

/**
 * @param {Object} data
 * @param {string} methodName
 * @param {Function} method
 * @private
 */
function setMethods (data, methodName, method) {
	if (typeof method === 'function') {
		data[methodName] = method;
	}
}

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Transform user options to processing options
 * @param {Object} [opts={}]
 * @returns {Object}
 * @sourceCode
 */
function setupOptions (opts = {}) {
	const options = {
		ejs: {}
	};
	const optsEjs = lodash.merge({}, opts.ejs);
	const ejs = options.ejs;

	// ejs render options
	setMethods(ejs, 'escape', optsEjs.escape);
	ejs.delimiter = setDelimiter(optsEjs.delimiter);
	ejs.localsName = setLocalsName(optsEjs.localsName);
	ejs.compileDebug = !!optsEjs.compileDebug;
	ejs.rmWhitespace = false;
	ejs.debug = false;
	ejs.client = false;
	ejs._with = false;
	ejs.strict = true;
	delete ejs.context;

	return options;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = setupOptions;

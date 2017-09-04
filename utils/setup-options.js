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
 * Should add method if received function
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

/**
 * Should return extname as string
 * it must starts with . (dot) and with length 2 or more
 * @param {string} extname
 * @returns {string} `'.html'` by default
 * @private
 */
function setExtname (extname) {
	if (typeof extname === 'string') {
		if (/^\./.test(extname)) {
			return extname;
		}
		return '.' + extname;
	}
	return '.html';
}

/**
 * Resolve sample path
 * @param {string} sample
 * @returns {string} `process.cwd()` by default
 * @private
 */
function setPath (sample) {
	if (sample && typeof sample === 'string') {
		return path.resolve(sample);
	}
	return process.cwd();
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

	if (typeof opts === 'function') {
		opts = opts();
	}

	if (!lodash.isPlainObject(opts)) {
		opts = {};
	}

	const ejs = options.ejs;

	// ejs render options
	setMethods(ejs, 'escape', opts.escape);
	ejs.delimiter = setDelimiter(opts.delimiter);
	ejs.localsName = setLocalsName(opts.localsName);
	ejs.compileDebug = !!opts.compileDebug;
	ejs.rmWhitespace = false;
	ejs.debug = false;
	ejs.client = false;
	ejs._with = false;
	ejs.strict = true;
	delete ejs.context;

	// plugin options
	['layouts', 'widgets', 'requires', 'includes'].forEach(prop => {
		options[prop] = setPath(opts[prop]);
	});

	setMethods(options, 'afterRender', opts.afterRender);
	options.extname = setExtname(opts.extname);
	options.showHistory = !!opts.showHistory;
	options.locals = lodash.merge({}, opts.locals);

	options.__UNIQUE_KEY__ = `ui-key-${new Date().getTime()}`;

	return options;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = setupOptions;

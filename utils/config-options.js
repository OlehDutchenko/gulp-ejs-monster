'use strict';

/**
 * Configure options
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 1.0.0
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const path = require('path');
const lodash = require('lodash');

// ----------------------------------------
// Private
// ----------------------------------------

/**
 * @param {string} delimiter
 * @returns {string} `'%'` by default
 * @private
 */
function setDelimiter (delimiter) {
	if (typeof delimiter === 'string' && delimiter) {
		return delimiter;
	}
	return '%';
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

/**
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

/**
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

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Transform user options to processing options
 * @param {Object} [opts={}]
 * @returns {Object}
 */
function configOptions (opts = {}) {
	const options = {
		ejs: {}
	};
	const optsEjs = lodash.merge({}, opts.ejs);
	const ejs = options.ejs;

	// ejs render options
	ejs.delimiter = setDelimiter(optsEjs.delimiter);
	ejs.localsName = setLocalsName(optsEjs.localsName);
	ejs.compileDebug = !!optsEjs.compileDebug;
	ejs.rmWhitespace = !!optsEjs.rmWhitespace;
	ejs.debug = false;
	ejs.client = false;
	ejs.strict = true;
	ejs._with = false;

	setMethods(ejs, 'context', optsEjs.context);
	setMethods(ejs, 'escape', optsEjs.escape);

	// plugin options
	['layouts', 'partials', 'require', 'include'].forEach(prop => {
		options[prop] = setPath(opts[prop]);
	});

	options.extname = setExtname(opts.extname);
	options.beautify = !!opts.beautify;
	options.delimiters = {
		start: `<${ejs.delimiter} `,
		return: `<${ejs.delimiter}- `,
		end: ` -${ejs.delimiter}>`
	};

	return options;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = configOptions;

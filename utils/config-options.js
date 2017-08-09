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

function setDelimiter (delimiter) {
	if (typeof delimiter === 'string' && delimiter) {
		return delimiter;
	}
	return '%';
}

function setMethods (data, methodName, method) {
	if (typeof method === 'function') {
		data[methodName] = method;
	}
}

function setLocalsName (localsName) {
	if (typeof localsName === 'string' && localsName) {
		return localsName;
	}
	return 'locals';
}

function setPath (sample) {
	if (sample && typeof sample === 'string') {
		return path.resolve(sample);
	}
	return path.resolve('./');
}

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

	// plugin options
	['partials', 'controllers', 'configs', 'files', 'layouts'].forEach(prop => {
		options[prop] = setPath(opts[prop]);
	});

	options.extname = setExtname(opts.extname);
	options.beautify = !!opts.beautify;

	// render options
	ejs.delimiter = setDelimiter(optsEjs.delimiter);
	ejs.compileDebug = !!optsEjs.compileDebug;
	ejs.localsName = setLocalsName(optsEjs.localsName);
	ejs.rmWhitespace = !!optsEjs.rmWhitespace;
	ejs.debug = false;
	ejs.client = false;
	ejs.strict = false;
	ejs._with = false;

	setMethods(ejs, 'context', optsEjs.context);
	setMethods(ejs, 'escape', optsEjs.escape);

	return options;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = configOptions;

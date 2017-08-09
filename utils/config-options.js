'use strict';

/**
 * Configure options
 * @module
 */

// ----------------------------------------
// Imports
// ----------------------------------------

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
		return sample;
	}
	return '';
}

function setExtname (extname) {
	if (typeof extname === 'string') {
		if (/^\./.test())
		return localsName;
	}
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
	['partials', 'controllers', 'configs', 'files'].forEach(prop => {
		options[prop] = setPath(opts[prop]);
	});

	// render options
	ejs.delimiter = setDelimiter(optsEjs.delimiter);
	ejs.debug = !!optsEjs.debug;
	ejs.compileDebug = ejs.debug;
	ejs.client = false;
	ejs.strict = false;
	ejs._with = false;
	ejs.localsName = setLocalsName(optsEjs.localsName);
	ejs.rmWhitespace = !!optsEjs.rmWhitespace;

	setMethods(ejs, 'context', optsEjs.context);
	setMethods(ejs, 'escape', optsEjs.escape);

	return options;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = configOptions;

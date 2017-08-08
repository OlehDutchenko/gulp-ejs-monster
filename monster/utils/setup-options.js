'use strict';

/**
 * Setup render options
 * @module
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const lodash = require('lodash');

// ----------------------------------------
// Private
// ----------------------------------------

function errorMsg (msg) {
	let banner = 'While configuring the render options, an error was detected:';
	let output = ['\n------------\n'].concat(banner, msg, ['\n------------\n']);

	return output.join('\n');
}

function getPath (sample) {
	if (sample && typeof sample === 'string') {
		return sample;
	}
	return '';
}

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Transform user options to render options
 * @param {Object} [userOptions={}]
 * @returns {Object}
 */
function setupOptions (userOptions = {}) {
	const options = {
		reservedLocalsKeys: []
	};

	// reservedLocalsKeys
	if (Array.isArray(userOptions.reservedLocalsKeys)) {
		let arr = [];

		userOptions.reservedLocalsKeys.forEach(key => {
			if (typeof key !== 'string') {
				throw new Error(errorMsg(`- reservedLocalsKeys must be an Array with string keys, but found "${typeof key}"`));
			}
			arr.push(key);
		});
		options.reservedLocalsKeys = arr;
	}

	// locals
	options.locals = lodash.merge({}, userOptions.locals);

	// import paths
	['partials', 'controllers', 'configs', 'files'].forEach(prop => {
		options[prop] = getPath(userOptions[prop]);
	});

	// delimiters
	options.delimiter = userOptions.delimiter || '%';
	options.delimiters = {
		start: `<${options.delimiter} `,
		return: `<${options.delimiter}- `,
		end: ` -${options.delimiter}>`
	};

	// ext
	options.ext = userOptions.ext || '.html';

	// ejs native options
	options.verbose = userOptions.verbose;
	options.debug = userOptions.debug;
	options.strict = false;

	return options;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = setupOptions;

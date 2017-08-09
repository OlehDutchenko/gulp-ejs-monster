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

// TODO Clear if remove `reservedLocalsKeys`
// function errorMsg (msg) {
// 	let banner = 'While configuring the render options, an error was detected:';
// 	let output = ['\n------------\n'].concat(banner, msg, ['\n------------\n']);
//
// 	return output.join('\n');
// }

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
		// TODO Clear if no needed more
		// reservedLocalsKeys: []
	};

	// TODO Clear if no needed more
	// reservedLocalsKeys
	// if (Array.isArray(userOptions.reservedLocalsKeys)) {
	// 	let arr = [];
	//
	// 	userOptions.reservedLocalsKeys.forEach(key => {
	// 		if (typeof key !== 'string') {
	// 			throw new Error(errorMsg(`- reservedLocalsKeys must be an Array with string keys, but found "${typeof key}"`));
	// 		}
	// 		arr.push(key);
	// 	});
	// 	options.reservedLocalsKeys = arr;
	// }

	// locals
	options.locals = lodash.merge({}, userOptions.locals);

	// import paths
	['partials', 'controllers', 'configs', 'files'].forEach(prop => {
		options[prop] = getPath(userOptions[prop]);
	});

	// ext
	options.ext = userOptions.ext || '.html';

	// ejs native render options
	const render = options.render = {};

	render.delimiter = userOptions.delimiter || '%';
	render.debug = !!userOptions.debug;
	render.compileDebug = render.debug;
	render._with = false;
	render.rmWhitespace = !!userOptions.rmWhitespace;
	render.strict = false;
	render.client = false;

	// delimiters
	options.delimiters = {
		start: `<${render.delimiter} `,
		return: `<${render.delimiter}- `,
		end: ` -${render.delimiter}>`
	};

	return options;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = setupOptions;

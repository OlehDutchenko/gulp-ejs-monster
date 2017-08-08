'use strict';

/**
 * Описание модуля
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

// ----------------------------------------
// Public
// ----------------------------------------

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

	options.locals = lodash.merge({}, userOptions.locals)

	return options;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = setupOptions;

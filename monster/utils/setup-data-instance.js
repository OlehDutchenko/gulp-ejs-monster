'use strict';

/**
 * Setup `instance` data
 * @module
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const DataStack = require('./data-stack');
const DataSources = require('./data-sources');

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * @param {Object} data
 * @returns {Object}
 */
function setupDataInstance (data) {
	// TODO Clear if remove `inside`
	const store = {};

	return {
		stack: new DataStack(),
		sources: new DataSources(),
		// TODO Clear if no needed more
		// set inside (bool) {
		// 	store.inside = bool === true;
		// },
		// get fileChanged () {
		// 	return store.inside === true;
		// },
		set fileChanged (bool) {
			data.fileChanged = bool === true;
			data.fileNotChanged = !data.fileChanged;
		},
		get fileChanged () {
			return data.fileChanged === true;
		}
	};
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = setupDataInstance;

'use strict';

/**
 * @module
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const DataSample = require('./data-sample');

// ----------------------------------------
// Public
// ----------------------------------------

class DataSources extends DataSample {
	reset () {
		this.list = {};
	}

	add (key, value) {
		if (undefined === this.list[key]) {
			this.list[key] = [];
		}
		if (~this.list[key].indexOf(value)) {
			this.list[key].push(value);
		}
	}
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = DataSources;

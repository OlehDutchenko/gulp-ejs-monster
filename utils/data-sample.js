'use strict';

/**
 * @module
 */

// ----------------------------------------
// Public
// ----------------------------------------

class DataSample {
	constructor () {
		this.reset();
	}

	reset () {
		this.list = [];
	}

	push (value) {
		this.list.push(value);
	}

	print () {
		return this.list.join('\n');
	}
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = DataSample;

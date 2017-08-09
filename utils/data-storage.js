'use strict';

/**
 * @module
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const DataSample = require('./data-sample');

// ----------------------------------------
// Priva
// ----------------------------------------

// ----------------------------------------
// Public
// ----------------------------------------

class DataStorage extends DataSample {
	constructor () {
		super();
		this.gap = '';
	}
	reset () {
		super.reset();
		this.paths = [];
		this.indent('<<<<');
	}
	indent (gap) {
		switch (gap) {
			case '>':
				this.gap += '  ';
				break;
			case '>>':
				this.gap += '    ';
				break;
			case '<':
				this.gap = this.gap.slice(0, -2);
				break;
			case '<<':
				this.gap = this.gap.slice(0, -4);
				break;
			case '<<<':
				this.gap = this.gap.slice(0, -6);
				break;
			case '<<<<':
				this.gap = '';
				break;
		}

		return this.gap;
	}
	push (processed, path, gap) {
		let value = this.indent(gap) + processed;

		if (path) {
			this.paths.push(path);
			value += ' - ' + path;
		}
		super.push(value);
	}
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = DataStorage;

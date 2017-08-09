'use strict';

/**
 * @module
 */

// ----------------------------------------
// Public
// ----------------------------------------

class DataStorage {
	constructor () {
		this.reset();
	}

	reset () {
		this.list = [];
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
		this.list.push(value);
	}

	print () {
		return this.list.join('\n');
	}
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = DataStorage;

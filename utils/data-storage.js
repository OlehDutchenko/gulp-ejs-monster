'use strict';

/**
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 1.0.0
 */

// ----------------------------------------
// Public
// ----------------------------------------

class DataStorage {
	/**
	 * Create new storage
	 */
	constructor () {
		this.gap = '';
		this.reset();
	}

	/**
	 * Reset storage items
	 */
	reset () {
		this.list = [];
		this.paths = [];
		this.indent('<<<<');
	}

	/**
	 * Indent gap size
	 * @param {string} gap
	 * @returns {string}
	 */
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

	/**
	 * Add new information
	 * @param {string} whatHappens
	 * @param {string} [filePath]
	 * @param {string} [gap]
	 */
	push (whatHappens, filePath, gap) {
		let value = this.indent(gap) + whatHappens;

		if (filePath) {
			if (!~this.paths.indexOf(filePath)) {
				this.paths.push(filePath);
			}
			value += ' - ' + filePath;
		}
		this.list.push(value);
	}

	/**
	 * Returns list as string
	 * @returns {string}
	 */
	print () {
		return this.list.join('\n');
	}
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = DataStorage;

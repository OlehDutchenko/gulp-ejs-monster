'use strict';

/**
 * History storage class
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 3.0.0
 */

// ----------------------------------------
// Imports
// ----------------------------------------

// modules
const chalk = require('chalk');

// ----------------------------------------
// Public
// ----------------------------------------

class HistoryStorage {
	/**
	 * Create new storage
	 */
	constructor () {
		this.reset();
	}

	/**
	 * Reset storage items
	 */
	reset () {
		this.gap = '';
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
			value += ' - ' + chalk.magenta(filePath);
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

module.exports = HistoryStorage;

'use strict';

/**
 * Color values
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

/**
 * Color values
 * @const {Object}
 * @sourceCode
 */
const colors = {
	isTrue: chalk.bold.blue('true'),
	isFalse: chalk.bold.blue('false')
};

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = colors;

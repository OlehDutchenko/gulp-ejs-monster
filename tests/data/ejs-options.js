'use strict';

// ----------------------------------------
// Imports
// ----------------------------------------

const argv = require('yargs').argv;

// ----------------------------------------
// Private
// ----------------------------------------

/**
 * Debugging flag
 * @const {boolean}
 * @private
 */
const debugFlag = !!argv.debug;

/**
 * Production flag
 * @const {boolean}
 * @private
 */
const prodFlag = !!argv.p || !!argv.production;

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Plugin user options
 * @const {Object}
 * @private
 */
const ejsOptions = {
	beautify: prodFlag,
	debug: debugFlag,
	ejs: {
		compileDebug: debugFlag,
		delimiter: '%',
		localsName: 'locals',
		locals: {
			customProp: 'customProp'
		}
	}
};

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = ejsOptions;

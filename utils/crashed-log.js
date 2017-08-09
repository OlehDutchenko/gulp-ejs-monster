'use strict';

/**
 * Log on failed render
 * @module
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const chalk = require('chalk');
const pkg = require('../package.json');

// ----------------------------------------
// Public
// ----------------------------------------

function crashedLog (filePath) {
	console.log(chalk.yellow([
		pkg.divider,
		`Oops! ${pkg.name} crashed while render file:`,
		filePath,
		pkg.divider,
		'Starting re-render for to detect what\'s went wrong ...\n'
	].join('\n')));
}

crashedLog.detected = function (error) {
	console.log(chalk.yellow([
		pkg.divider,
		`Done! ${pkg.name} found errors:`,
		error.toString(),
		pkg.divider,
	].join('\n')));
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = crashedLog;

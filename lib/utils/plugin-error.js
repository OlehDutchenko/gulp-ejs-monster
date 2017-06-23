/**
 * @module lib/utils/get-file-data
 * @author Oleg Dutchenko <dutchenko.o.wezom@gmail.com>
 * @version 0.0.1
 */

'use strict';

const gutil = require('gulp-util');
const chalk = require('chalk');

/**
 * Sample plug-in error
 * @static
 * @param  {string} pluginName
 * @param  {Object} [context=false]
 * @return {Function}
 * @sourceCode |+61
 */
function pluginError (pluginName, context) {
	/**
	 * Emit
	 * @param {Object|string} error
	 * @param {Object}        [options={}]
	 */
	return function (error, options = {}) {
		let saveMessage = '';

		if (typeof error === 'object' && error !== null) {
			// if there is a formatted message,
			// replace it with the usual one.
			if (error.formatted) {
				error.message = error.formatted;
				delete error.formatted;
			}

			// backup notification
			saveMessage = error.saveMessage || error.message;
			error.message = chalk.yellow(error.message);
			delete error.saveMessage;

			/**
			 * The method of extracting the error object
			 * into a formatted string
			 * @return {string}
			 */
			error.extractAsString = function () {
				let striped = chalk.stripColor(this.toString());
				striped = striped.replace(
					/(Message:|Details:|Stack:)/g,
					(str, group) => `\n----------\n${group}`
				);
				return striped;
			};

			Object.defineProperty(error, 'extractAsString', {enumerable: false});
		}

		// if there is a context, we make the emitter from the context
		if (context) {
			return context.emit(
				'error',
				new gutil.PluginError(pluginName, error, options)
			);
		}

		// otherwise, return the error log
		let errorLog = new gutil.PluginError(pluginName, error, options);
		if (options && options.showProperties !== false) {
			if (errorLog.stack) {
				errorLog.stack = errorLog.stack.replace(saveMessage, '');
			}
		}
		return errorLog;
	};
}

module.exports = pluginError;

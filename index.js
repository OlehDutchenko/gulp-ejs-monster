'use strict';

/**
 * > Gulp plugin for [ejs](http://ejs.co/). Version for [Wezom](wezom.com.ua) projects.
 * The project is inspired by [ejs-locals](https://github.com/RandomEtc/ejs-locals)
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 1.0.0
 * @requires utils/config-options
 * @requires utils/crashed
 * @requires utils/beautify
 * @requires utils/data-storage
 * @requires methods/partial
 * @requires methods/set-layout
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const path = require('path');
const ejs = require('ejs');
const chalk = require('chalk');
const through2 = require('through2');
const gutil = require('gulp-util');
const notSupportedFile = require('gulp-not-supported-file');
const lodash = require('lodash');

const pkg = require('./package.json');
const configOptions = require('./utils/config-options');
const crashed = require('./utils/crashed');
const DataStorage = require('./utils/data-storage');

const setLayoutMethod = require('./methods/set-layout');
const partialMethod = require('./methods/partial');
const requireMethod = require('./methods/require');
const includeMethod = require('./methods/include');
const blockMethod = require('./methods/block');

// ----------------------------------------
// Private
// ----------------------------------------

/**
 * Create new error
 * @const {Function}
 * @param {Object} data
 * @param {Object} [options={}]
 * @return {PluginError}
 */
const pluginError = (data, options) => new gutil.PluginError(pkg.name, data, options);

/**
 * History storage
 * @const {DataStorage}
 * @private
 */
const storage = new DataStorage();

/**
 * All gathered options
 * @const {Object}
 */
const configs = {};

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Core plugin method
 * @param {Object} opts
 * @returns {DestroyableTransform}
 */
function gulpEjsMonster (opts = {}) {
	let config = configs[opts.__UNIQUE_KEY__];

	if (config === undefined) {
		opts = configOptions(opts);
		configs[opts.__UNIQUE_KEY__] = {
			options: opts,
			data: {
				setLayout: setLayoutMethod(opts),
				partial: partialMethod(opts, storage),
				require: requireMethod(opts, storage),
				include: includeMethod(opts, storage),
				blocks: {}
			}
		};
		config = configs[opts.__UNIQUE_KEY__];
		config.data.block = blockMethod(config.data.blocks, storage);
	}
	const options = config.options;
	const data = config.data;
	const ejsOptions = options.ejs;

	/**
	 * Read buffer and transform
	 * @param {Object} file
	 * @param {...*} args
	 */
	function readBuffer (file, ...args) {
		let isDone = args[1];
		let notSupported = notSupportedFile(file, pluginError);

		if (Array.isArray(notSupported)) {
			notSupported.shift();
			return isDone(...notSupported);
		}

		/**
		 * Render given file
		 * @param {string} filePath - resolved file path
		 */
		function renderFile (filePath) {
			data.fileChanged = true;
			ejs.renderFile(filePath, data, ejsOptions, (error, markup) => {
				// if get error - try to detect what's went wrong
				if (error) {
					if (ejsOptions.compileDebug) {
						crashed(error, storage, ejsOptions);
						return isDone(error);
					}

					crashed.reRenderLog(filePath);
					data.blocks = {};
					storage.push(chalk.red('→ CRASH...\n'), false, '>');
					storage.indent('<<<<');
					storage.push('re-render file with compileDebug', file.path);

					return ejs.renderFile(filePath, data, lodash.merge(ejsOptions, {compileDebug: true}), (err) => {
						crashed(err, storage, ejsOptions);
						return isDone(err);
					});
				}

				// if file has layout - render
				if (data.layout) {
					let layoutPath = data.layout;
					storage.indent('<<<<');
					storage.push('> render layout', layoutPath, '>');
					data.body = markup;
					delete data.layout;

					return renderFile(layoutPath);
				}

				// format markup
				if (options.beautify) {
					let beautifyPath = path.join(__dirname, './utils/beautify');
					let beautify = require(beautifyPath);

					markup = beautify(markup);
				}

				// after render
				if (options.afterRender) {
					let postMarkup = options.afterRender(markup, file, storage.paths);

					if (typeof postMarkup === 'string') {
						markup = postMarkup;
					}
				}

				if (options.debug) {
					console.log(storage.print());
					console.log(chalk.green('Done!\n'));
				}

				// change file data
				file.contents = Buffer.from(markup);
				file.extname = options.extname;

				// all done - go out
				return isDone(null, file);
			});
		}

		data.blocks = {};
		storage.reset();
		storage.push(chalk.green('Start'));
		storage.push('render view', file.path);
		renderFile(file.path);
	}
	return through2.obj(readBuffer);
}

/**
 * Plugin name
 * @type {string}
 */
gulpEjsMonster.pluginName = pkg.name;

/**
 * Prevention failing process
 * @type {Function}
 */
gulpEjsMonster.preventCrash = function () {
	this.emit('end');
};

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = gulpEjsMonster;

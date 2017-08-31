'use strict';

/**
 * > Gulp plugin for [ejs](http://ejs.co/). Version for [Wezom](wezom.com.ua) projects.
 * The project is inspired by [ejs-locals](https://github.com/RandomEtc/ejs-locals)
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 3.0.0
 */

// ----------------------------------------
// Imports
// ----------------------------------------

// modules
const path = require('path');
const ejs = require('ejs');
const chalk = require('chalk');
const lodash = require('lodash');
const through2 = require('through2');
const gutil = require('gulp-util');
const notSupportedFile = require('gulp-not-supported-file');

// data
const pkg = require('./package.json');

// utils
const setupOptions = require('./utils/setup-options');
const HistoryStorage = require('./utils/history-storage');
const crashed = require('./utils/crashed');

// methods
const createSetLayoutMethod = require('./methods/set-layout');
const createWidgetMethod = require('./methods/widget');
// const createRequireMethod = require('./methods/require');
// const createIncludeMethod = require('./methods/include');
const createBlockMethod = require('./methods/block');

// ----------------------------------------
// Private
// ----------------------------------------

/**
 * Create new plugin error
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
let storage = new HistoryStorage();

/**
 * All gathered options
 * @const {Object}
 * @private
 */
const configs = {};

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Core plugin method
 * @param {Object} [opts={}]
 * @returns {DestroyableTransform}
 */
function gulpEjsMonster (opts = {}) {
	let config = configs[opts.__UNIQUE_KEY__];

	if (config === undefined) {
		let configOpts = setupOptions(opts);
		let key = configOpts.__UNIQUE_KEY__;

		configs[key] = {
			options: configOpts,
			data: lodash.merge({}, configOpts.locals, {
				setLayout: createSetLayoutMethod(configOpts, storage),
				widget: createWidgetMethod(configOpts, storage),
				// require: createRequireMethod(configOpts, storage),
				// include: createIncludeMethod(configOpts, storage),
				blocks: {
					clearAllBlocks: createBlockMethod.clearAllBlocks
				}
			}),
			ejs: lodash.merge({}, configOpts.ejs)
		};

		delete configs[key].options.locals;
		delete configs[key].options.ejs;

		config = configs[key];
		config.data.block = createBlockMethod(config.data.blocks, storage);
		opts.__UNIQUE_KEY__ = key;
	}
	const options = config.options;
	const data = config.data;
	const ejsOptions = config.ejs;

	console.log(options);

	/**
	 * Read buffer and transform
	 * @param {Buffer} file
	 * @param {...*} args
	 */
	function readBuffer (file, ...args) {
		let cb = args[1];
		let notSupported = notSupportedFile(file, pluginError);

		if (Array.isArray(notSupported)) {
			notSupported.shift();
			return cb(notSupported[0], notSupported[1]);
		}

		data.blocks.clearAllBlocks();
		storage.reset();
		storage.push(chalk.green('Start'));
		storage.push('render view', file.path);
		data.fileName = file.stem;
		data.filePath = file.path;
		renderFile(file.path);

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
						return cb(error);
					}

					if (!data.layout) {
						data.blocks.clearAllBlocks();
					}

					crashed.reRenderLog(filePath, storage);
					return ejs.renderFile(filePath, data, lodash.merge(ejsOptions, {compileDebug: true}), (err) => {
						crashed(err, storage, ejsOptions);
						return cb(err);
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
					let postMarkup = options.afterRender(markup, file, storage.paths.concat([]));

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
				return cb(null, file);
			});
		}
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

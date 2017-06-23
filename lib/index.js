/**
 * > Gulp plugin for [ejs](http://ejs.co/). Version for [Wezom](wezom.com.ua) projects.
 * The project is inspired by [ejs-locals](https://github.com/RandomEtc/ejs-locals)
 * @module lib/index
 * @author Oleg Dutchenko <dutchenko.o.wezom@gmail.com>
 * @version 0.0.1
 */

'use strict';

const path = require('path');
const through = require('through2');
const ejs = require('./ejs');
const gutil = require('gulp-util');

// plugin data
const reservedLocalsKeys = require('./data/reserved-local-keys');

// mdts
const layout = require('./mtds/layout');
const partial = require('./mtds/partial');
const block = require('./mtds/block');
const importFile = require('./mtds/import-file');

// utils
const ejsPluginError = require('./utils/plugin-error');

/**
 * @private
 * @const {string}
 * @sourceCode
 */
const PluginName = 'gulp-ejs-monster';

/**
 *
 */
class DataSources {
	constructor () {
		this.files = {};
	}
	add (key, filepath) {
		if (undefined === this.files[key]) {
			this.files[key] = [];
		}
		if (this.files[key].indexOf(filepath) < 0) {
			this.files[key].push(filepath);
		}
	}
}

/**
 * @static
 * @param  {Object}   renderData
 * @param  {Object}   renderOptions
 * @return {Function} new DestroyableTransform
 */
const gulpEjsMonster = module.exports = function (renderData, renderOptions) {
	/**
	 * Transformation of the current file
	 * @param  {Object}   file
	 * @param  {String}   [enc='utf-8']
	 * @param  {Function} callback
	 * @return {Function} callback
	 */
	function readBuffer (file, enc = 'utf-8', callback) {
		const pluginError = ejsPluginError(PluginName);

		if (file.isNull()) {
			// throw the file further
			return callback(null, file);
		}

		if (file.isStream()) {
			// throw plugin error
			return callback(pluginError('Stream not supported!'));
		}

		// skip if leading underscore in filename
		if (path.basename(file.path).charAt() === '_') {
			return callback();
		}

		// инстанс
		if (!renderData.hasOwnProperty('__INSTANCE')) {
			renderData.__INSTANCE = {};
		}

		renderData.filename = file.stem;
		renderData.filepath = file.path;
		renderData.__INSTANCE.VIEW = file.path;
		renderData.__INSTANCE.STACK = [];
		renderData.__INSTANCE.SOURCES = new DataSources();

		// if the data is not yet configured
		if (!renderData.__INSTANCE.SETUP_DONE) {
			renderOptions.reservedLocalsKeys = renderOptions.reservedLocalsKeys || [];
			renderOptions.locals = renderOptions.locals || '';
			renderOptions.partials = renderOptions.partials || '';
			renderOptions.controllers = renderOptions.controllers || '';
			renderOptions.datafiles = renderOptions.datafiles || '';
			renderOptions.files = renderOptions.files || '';
			renderOptions.strict = false;

			renderOptions.delimiter = renderOptions.delimiter || '%';
			renderOptions.delimiters = {
				start: `<${renderOptions.delimiter} `,
				return: `<${renderOptions.delimiter}- `,
				end: ` -${renderOptions.delimiter}>`
			};

			renderData.filename = file.stem;
			renderData.filepath = file.path;
			renderOptions.ext = renderOptions.ext || '.html';

			// internal methods
			renderData.layout = layout(renderOptions);
			renderData.partial = partial(renderOptions);
			renderData.partialTemplate = partial(renderOptions, true);
			renderData.blocks = {};
			renderData.block = block(renderData.blocks, renderData);
			renderData.importFile = importFile('', renderOptions);
			renderData.importController = importFile(
				renderOptions.controllers,
				renderOptions,
				'IMPORTCONTROLLER',
				true
			);
			renderData.importConfig = importFile(
				renderOptions.configs,
				renderOptions,
				'IMPORTCONFIG',
				true
			);

			// proxy locals
			renderData.locals = new Proxy(renderData, {
				get (target, prop) {
					return target[prop];
				},
				set (target, prop, value) {
					if (reservedLocalsKeys.indexOf(prop) >= 0) {
						throw new Error(
							`Property "${prop}" - reserved by plugin ${PluginName} \nReserved property list:\n - ${reservedLocalsKeys.join('\n - ')}`
						);
					}
					if (renderOptions.reservedLocalsKeys.indexOf(prop) >= 0) {
						throw new Error(
							`Property "${prop}" - reserved by user settings \nUser reserved property list:\n - ${renderOptions.reservedLocalsKeys.join('\n - ')}`
						);
					}
					target[prop] = value;
					return true;
				}
			});

			// bug ▼
			// renderOptions.errorHandler = function (error, options) {
			// 	return callback( pluginError(error, options) );
			// }

			// throwing off the flag
			renderData.__INSTANCE.SETUP_DONE = true;
		}

		// render the current file
		function renderFile (filepath, circle) {
			if (circle) {
				renderData.__INSTANCE.LAYOUT = filepath.replace(file.cwd, '');
				renderData.__INSTANCE.STACK.push('> render layout ' + filepath);
			} else {
				renderData.__INSTANCE.STACK.push('> render view ' + filepath);
			}
			renderData.__INSTANCE.INSIDE = true;
			renderData.fileChanged = true;
			renderData.fileNotChanged = false;

			// ejs asynchronous render
			ejs.renderFile(filepath, renderData, renderOptions, function (error, markup) {
				function setPath (pathStr) {
					pathStr = pathStr || '';
					if (pathStr.length) {
						return pathStr.replace(file.cwd, '');
					}
					return '...';
				}

				renderData.__INSTANCE.INSIDE = false;

				if (error) {
					error.saveMessage = error.message;
					error.path = error.path || filepath;
					error.view = setPath(file.path);
					error.layout = setPath(renderData.__INSTANCE.LAYOUT);
					error.partial = setPath(renderData.__INSTANCE.PARTIAL);
					error.partialTemplate = setPath(renderData.__INSTANCE.PARTIALTEMPLATE);
					error.importController = setPath(renderData.__INSTANCE.IMPORTCONTROLLER);
					error.importConfig = setPath(renderData.__INSTANCE.IMPORTCONFIG);
					error.importFile = setPath(renderData.__INSTANCE.IMPORTFILE);
					error.pluginHistory = '\n      ' + renderData.__INSTANCE.STACK.join('\n      ');
					return callback(pluginError(error));
				}

				// has file layout
				let layoutPath = renderData.__INSTANCE.LAYOUTPATH || '';

				// if has send to re-render
				// indicating the current markup result
				// as the value of the property `data.body`
				if (layoutPath.length) {
					renderData.body = markup;
					renderData.__INSTANCE.LAYOUTPATH = '';
					return renderFile(layoutPath, true);
				}

				// blocks clear
				for (let key in renderData.blocks) {
					delete renderData.blocks[key];
				}

				if (renderOptions.afterRender) {
					let postMarkup = renderOptions.afterRender(markup, file, renderData, renderOptions);
					if (typeof postMarkup === 'string') {
						markup = postMarkup;
					}
				}

				// new contents and extension
				file.contents = new Buffer(markup);
				file.path = gutil.replaceExtension(file.path, renderOptions.ext);

				// return to stream
				callback(null, file);
			});
		}

		// let's go )))
		renderFile(file.path);
	}

	return through.obj(readBuffer);
};

gulpEjsMonster.logError = function logError (error) {
	var message = error.toString();
	process.stderr.write(message + '\n\n');
	this.emit('end');
};

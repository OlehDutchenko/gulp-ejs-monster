/**
 * @module libs/mtds/import-files
 * @author Oleg Dutchenko <dutchenko.o.wezom@gmail.com>
 * @version 0.0.1
 */

'use strict';

const ejs = require('../ejs');
const path = require('path');
const _clonedeep = require('lodash.clonedeep');
const getFileData = require('../utils/get-file-data');

/**
 * function wrapper
 * @static
 * @param  {string}   importsFolder
 * @param  {Object}   renderOptions,
 * @param  {string}   [sourceKey='IMPORTFILE']
 * @param  {Object}   [performing=false]
 * @return {Function}
 * @sourceCode |+64
 */
function importFile (importsFolder = '', renderOptions, sourceKey = 'IMPORTFILE', performing = false) {
	/**
	 * @param  {string}   importFileName
	 * @param  {Object}   [entry={}]
	 * @param  {boolean}  [clone=false]
	 * @param  {boolean}  [noCache=false]
	 * @param  {boolean}  [render=performing]
	 * @return {string}
	 */
	return function (importFilePath, entry = {}, clone, noCache, render = performing) {
		this.__INSTANCE.INSIDE = false;

		let prevEntry = this.ENTRY || false;
		if (prevEntry) {
			prevEntry = _clonedeep(this.ENTRY);
		}

		if (clone) {
			this.ENTRY = _clonedeep(entry);
		} else {
			this.ENTRY = entry;
		}

		let importFileFullPath = path.resolve(path.join(importsFolder, importFilePath));
		this.__INSTANCE.STACK.push('   > import file ' + importFileFullPath);
		this.__INSTANCE[sourceKey] = importFileFullPath;
		this.__INSTANCE.SOURCES.add(this.filepath, importFileFullPath);

		let fileData = getFileData(importFileFullPath, noCache);
		this.fileChanged = fileData.changed;
		this.fileNotChanged = !fileData.changed;
		if (this.fileChanged) {
			this.__INSTANCE.STACK.push('     √ fileChanged add to cache ' + fileData.mtime);
		} else {
			this.__INSTANCE.STACK.push('     < fileNotChanged get from cache ' + fileData.mtime);
		}
		let markup = fileData.content;

		if (render) {
			let startDelimiter = renderOptions.delimiters.start;
			let endDelimiter = renderOptions.delimiters.end;

			if (!/\.js$/.test(importFileFullPath)) {
				startDelimiter += endDelimiter;
				endDelimiter = startDelimiter;
			}

			markup = startDelimiter + markup + endDelimiter;
			markup = ejs.render(markup, this, renderOptions);
		}

		this.fileChanged = true;
		this.fileNotChanged = false;
		this.ENTRY = {};
		if (prevEntry) {
			this.ENTRY = prevEntry;
		}
		this.__INSTANCE[sourceKey] = false;
		this.__INSTANCE.INSIDE = true;
		return markup;
	};
}

module.exports = importFile;

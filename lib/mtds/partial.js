/**
 * @module libs/mtds/partial
 * @author Oleg Dutchenko <dutchenko.o.wezom@gmail.com>
 * @version 0.0.1
 */

'use strict';

const path = require('path');
const ejs = require('../ejs');
const _clonedeep = require('lodash.clonedeep');
const getFileData = require('../utils/get-file-data');

/**
 * @static
 * @param  {Object}   renderOptions
 * @param  {Boolean}  [asTemplate]
 * @return {Function}
 * @sourceCode |+103
 */
const partial = module.exports = function (renderOptions, asTemplate) {
	const partialsFolder = renderOptions.partials;

	if (asTemplate) {
		/**
		 * @param  {String}   partialPath
		 * @param  {Object}   [entry={}]
		 * @param  {Boolean}  [clone=false]
		 * @param  {Boolean}  [noCache=false]
		 * @return {String}
		 */
		return function (partialPath, delimiter="$", noCache) {
			this.__INSTANCE.INSIDE = false;

			let partialFullPath = path.resolve( path.join(partialsFolder, `${partialPath}.ejs`) );
			this.__INSTANCE.STACK.push('> include template partial '+partialFullPath);
			this.__INSTANCE.PARTIALTEMPLATE = partialFullPath;
			this.__INSTANCE.SOURCES.add(this.filepath, partialFullPath);

			let fileData = getFileData(partialFullPath, noCache);
			this.fileChanged = fileData.changed;
			this.fileNotChanged = !fileData.changed;
			if (this.fileChanged) {
				this.__INSTANCE.STACK.push('     √ fileChanged add to cache '+fileData.mtime);
			} else {
				this.__INSTANCE.STACK.push('     < fileNotChanged get from cache '+fileData.mtime);
			}

			let startDelimiter = `<(\\${renderOptions.delimiter}+)`;
			let endDelimiter = `(\\${renderOptions.delimiter}+)>`;
			let startRegex = new RegExp(startDelimiter, 'g');
			let endRegex = new RegExp(endDelimiter, 'g');

			let markup = fileData.content.replace(startRegex, (str, delimiters) => {
				if (delimiters.length > 1) {
					return '<' + delimiter + delimiter;
				}
				return '<' + delimiter;
			});
			markup = markup.replace(endRegex, (str, delimiters) => {
				if (delimiters.length > 1) {
					return delimiter + delimiter + '>';
				}
				return delimiter + '>';
			});


			this.fileChanged = true;
			this.fileNotChanged = false;
			this.__INSTANCE.PARTIALTEMPLATE = false;
			this.__INSTANCE.INSIDE = true;
			return markup;
		};
	};

	/**
	 * @param  {String}   partialPath
	 * @param  {Object}   [entry={}]
	 * @param  {Boolean}  [clone=false]
	 * @param  {Boolean}  [noCache=false]
	 * @return {String}
	 */
	return function(partialPath, entry={}, clone, noCache) {
		this.__INSTANCE.INSIDE = false;
		
		let prevEntry = this.ENTRY || false;
		if (prevEntry) {
			prevEntry = _clonedeep(this.ENTRY);
		}

		if ( clone ) {
			this.ENTRY = _clonedeep(entry);
		} else {
			this.ENTRY = entry;
		}

		let partialFullPath = path.resolve( path.join(partialsFolder, `${partialPath}.ejs`) );
		this.__INSTANCE.STACK.push('> include partial '+partialFullPath);
		this.__INSTANCE.PARTIAL = partialFullPath;
		this.__INSTANCE.SOURCES.add(this.filepath, partialFullPath);

		let fileData = getFileData(partialFullPath, noCache);
		this.fileChanged = fileData.changed;
		this.fileNotChanged = !fileData.changed;
		if (this.fileChanged) {
			this.__INSTANCE.STACK.push('     √ fileChanged add to cache '+fileData.mtime);
		} else {
			this.__INSTANCE.STACK.push('     < fileNotChanged get from cache '+fileData.mtime);
		}
		let markup = ejs.render(fileData.content, this, renderOptions);

		this.fileChanged = true;
		this.fileNotChanged = false;
		this.ENTRY = {};
		if (prevEntry) {
			this.ENTRY = prevEntry;
		}
		this.__INSTANCE.PARTIAL = false;
		this.__INSTANCE.INSIDE = true;
		return markup;
	};
};

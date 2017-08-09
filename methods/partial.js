'use strict';

/**
 * @module
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const path = require('path');
const ejs = require('ejs');
const lodash = require('lodash');
const chalk = require('chalk');

const pkg = require('../package.json');
const createFileCache = require('../utils/file-cache');

// ----------------------------------------
// Public
// ----------------------------------------

function partialMethod (options, storage) {
	const folder = options.partials;
	const ejsOptions = options.ejs;
	const cached = createFileCache();

	return function (filePath, entry = {}) {
		filePath = path.join(folder, filePath + '.ejs');

		// remember prev status
		let fileChanged = !!this.fileChanged;
		let prevEntry = lodash.merge({}, this.entry);

		// get data
		const data = cached(filePath);

		this.entry = lodash.merge({}, entry);
		storage.push('> render partial', filePath, '>>');

		this.fileChanged = data.changed;
		if (this.fileChanged) {
			storage.push(chalk.gray('√ file changed'), false, '>');
		} else {
			storage.push(chalk.gray('< file not changed'), false, '>');
		}

		// render template
		let markup = ejs.render(data.template, this, lodash.merge(ejsOptions, {filename: pkg.gulpEjsMonster.newline + filePath}));

		// return remembered
		if (Object.keys(prevEntry).length) {
			this.entry = prevEntry;
		} else {
			delete this.entry;
		}
		this.fileChanged = fileChanged;

		// go out
		storage.indent('<<<');
		return markup;
	};
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = partialMethod;

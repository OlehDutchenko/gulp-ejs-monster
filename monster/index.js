'use strict';

/**
 * Описание модуля
 * @module
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const lodash = require('lodash');

const setupOptions = require('./utils/setup-options');
const setupDataInstance = require('./utils/setup-data-instance');

// ----------------------------------------
// Private
// ----------------------------------------

// ----------------------------------------
// Public
// ----------------------------------------

function ejsMonster (data = {}, options = {}, file) {
	data.EJS = {};

	// instance
	if (!data.hasOwnProperty('__EJS_INSTANCE')) {
		data.__EJS_INSTANCE = setupDataInstance(data.EJS);
	}

	const instance = data.__EJS_INSTANCE;
	const ejs = data.EJS;

	ejs.fileName = file.stem;
	ejs.filePath = file.path;

	instance.view = file.path;
	instance.stack.reset();
	instance.sources.reset();

	if (instance.configured !== true) {
		options = setupOptions(options);
		instance.options = lodash.cloneDeep(options);
		instance.configured = true;
	}

	renderFile(file.path);

	function renderFile (filePath) {
		// TODO Clear if no needed more
		// instance.inside = true;
		instance.fileChanged = true;
	}

	console.log(data);
	console.log(options);
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = ejsMonster;

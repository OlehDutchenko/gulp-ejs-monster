'use strict';

/**
 * Описание модуля
 * @module
 */

// ----------------------------------------
// Imports
// ----------------------------------------

const setupOptions = require('./utils/setup-options');

// ----------------------------------------
// Private
// ----------------------------------------

class DataSample {
	constructor () {
		this.reset();
	}

	reset () {
		this.list = [];
	}
}

class DataStack extends DataSample {}
class DataSources extends DataSample {}

// ----------------------------------------
// Public
// ----------------------------------------

function ejsMonster (data = {}, options = {}, file) {
	// instance
	if (!data.hasOwnProperty('__INSTANCE')) {
		data.__EJS_INSTANCE = {
			stack: new DataStack(),
			sources: new DataSources(),
			turnOn () {
				this.inside = true
			},
			turnOff () {
				this.inside = false
			},
			fileChange (val) {
				data.fileChanged = val === true;
				data.fileNotChanged = !data.fileChanged;
			}
		};
	}

	const instance = data.__EJS_INSTANCE;
	const filepath = file.path;

	data.filename = file.stem;
	data.filepath = filepath;

	instance.view = filepath;
	instance.stack.reset();
	instance.sources.reset();

	if (instance.configured !== true) {
		options = setupOptions(options);
		instance.configured = true;
	}

	renderFile(filepath);

	function renderFile (filepath) {
		instance.turnOn();
		instance.fileChange(true);
	}

	console.log(data);
	console.log(options);
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = ejsMonster;

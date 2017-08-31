'use strict';

/**
 * Test setup-options module
 * @todo Write all tests for setupOptions results
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 3.0.0
 */

// ----------------------------------------
// Imports
// ----------------------------------------

// modules
const assert = require('assert');
const lodash = require('lodash');
const chalk = require('chalk');

// testing module
const setupOptions = require('../utils/setup-options');

// ----------------------------------------
// Private
// ----------------------------------------

const fileName = chalk.yellow('setup-options.js');

const presets = [
	{
		name: `empty`,
		options: undefined
	}, {
		name: 'true',
		options: true
	}, {
		name: 'function',
		options: function () {
			return null;
		}
	}, {
		name: 'object',
		options: {
			beautify: false,
			debug: false,
			ejs: {
				compileDebug: false,
				locals: {
					customProp: 'customProp'
				}
			}
		}
	}
]

// ----------------------------------------
// Test
// ----------------------------------------

testAllPresets(presets);

function testAllPresets(presetsList) {
	describe(chalk.green(fileName), function () {
		presetsList.forEach(function (preset) {
			let presetName = `preset name "${preset.name}"`;
			testPreset(presetName, preset.options);
		});
	});
}

function testPreset(presetName, presetOptions) {
	// sample
	let options = setupOptions(presetOptions);

	describe(chalk.green(presetName), function () {
		describe('options should be an plain object', function () {
			it('typeof options === \'object\'', function () {
				assert.strictEqual(typeof options, 'object');
			});
			it('lodash.isPlainObject(options)', function () {
				assert.strictEqual(lodash.isPlainObject(options), true);
			});
		});

		describe('options should have "ejs" property as object', function () {
			it('typeof options.ejs === \'object\'', function () {
				assert.strictEqual(typeof options.ejs, 'object');
			});
			it('lodash.isPlainObject(options.ejs)', function () {
				assert.strictEqual(lodash.isPlainObject(options.ejs), true);
			});

			describe('options.ejs should have constant values', function () {
				it(`options.ejs.debug === false // => ${options.ejs.debug}`, function () {
					assert.strictEqual(options.ejs.debug, false);
				});
				it(`options.ejs.client === false // => ${options.ejs.client}`, function () {
					assert.strictEqual(options.ejs.client, false);
				});
				it(`options.ejs._with === false // => ${options.ejs._with}`, function () {
					assert.strictEqual(options.ejs._with, false);
				});
				it(`options.ejs.rmWhitespace === false // => ${options.ejs.rmWhitespace}`, function () {
					assert.strictEqual(options.ejs.rmWhitespace, false);
				});
				it(`options.ejs.strict === true // => ${options.ejs.strict}`, function () {
					assert.strictEqual(options.ejs.strict, true);
				});
				it(`typeof options.ejs.compileDebug === \'boolean\' // => ${typeof options.ejs.compileDebug}`, function () {
					assert.strictEqual(typeof options.ejs.compileDebug, 'boolean');
				});
				it(`typeof options.ejs.locals === \'undefined\' // => ${typeof options.ejs.locals}`, function () {
					assert.strictEqual(typeof options.ejs.locals, 'undefined');
				});
				it(`typeof options.ejs.context === \'undefined\' // => ${typeof options.ejs.context}`, function () {
					assert.strictEqual(typeof options.ejs.context, 'undefined');
				});
			});

			describe('options.ejs should have "delimiter" property as string', function () {
				it('typeof options.ejs.delimiter === \'string\'', function () {
					assert.strictEqual(typeof options.ejs.delimiter, 'string');
				});
				it('length of options.ejs.delimiter should be 1', function () {
					assert.strictEqual(options.ejs.delimiter.length, 1);
				});
				it(`value of options.ejs.delimiter should be one of ['%','?','&','$'] // => ${options.ejs.delimiter}`, function () {
					assert.notStrictEqual(['%', '?', '&', '$'].indexOf(options.ejs.delimiter), -1);
				});
			});

			describe('options.ejs should have "localsName" property as string with correct property value', function () {
				it('typeof options.ejs.localsName === \'string\'', function () {
					assert.strictEqual(typeof options.ejs.localsName, 'string');
				});
				it('length of options.ejs.localsName should be 1 or more', function () {
					assert.strictEqual(options.ejs.localsName.length >= 1, true);
				});
				it(`value of options.ejs.localsName should not start from number // => ${options.ejs.localsName}`, function () {
					assert.strictEqual(/^\d/.test(options.ejs.localsName), false);
				});
			});

			describe('if options.ejs has "escape" properties - it must be an function', function () {
				if (options.ejs.hasOwnProperty('escape')) {
					it('typeof options.ejs.escape === \'function\'', function () {
						assert.strictEqual(typeof options.ejs.escape, 'function');
					});
				} else {
					it('has no property "escape"', function () {
						assert.strictEqual(true, true);
					});
				}
			});
		});
	});
}

// ----------------------------------------
// Exports
// ----------------------------------------

// Если это модуль, он должен экспортировать
// Описаный в нем функционал или данные из текущего файла

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
		name: 'object',
		options: {
			beautify: true,
			debug: false,
			afterRender: function () {
				console.log('done');
			},
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

		describe('options should have "extname" property as string', function () {
			it(`typeof options.extname === 'string' // => ${options.extname}`, function () {
				assert.strictEqual(typeof options.extname, 'string');
			});
			it(`should starts with . (dot) // => ${options.extname}`, function () {
				assert.strictEqual(/^\./.test(options.extname), true);
			});
			it('length of options.extname should be 2 or more', function () {
				assert.strictEqual(options.extname.length >= 2, true);
			});
		});

		describe('options should have paths properties as string', function () {
			it(`typeof options.layouts === 'string' // => ${options.layouts}`, function () {
				assert.strictEqual(typeof options.layouts, 'string');
			});
		});

		describe('options should have "debug" property as boolean', function () {
			it(`typeof options.debug === 'boolean' // => ${options.debug}`, function () {
				assert.strictEqual(typeof options.debug, 'boolean');
			});
		});

		describe('options should have "locals" property as object', function () {
			it('typeof options.locals === \'object\'', function () {
				assert.strictEqual(typeof options.locals, 'object');
			});
			it('lodash.isPlainObject(options.locals)', function () {
				assert.strictEqual(lodash.isPlainObject(options.locals), true);
			});
		});

		describe('if options has "afterRender" method - it must be an function', function () {
			if (options.hasOwnProperty('afterRender')) {
				it(`typeof options.afterRender === 'function' // => ${typeof options.afterRender}`, function () {
					assert.strictEqual(typeof options.afterRender, 'function');
				});
			} else {
				it('has no method "afterRender"', function () {
					assert.strictEqual(true, true);
				});
			}
		});

		describe('if options has "beautify" property - it must be an plain object', function () {
			if (options.hasOwnProperty('beautify')) {
				it('typeof options.beautify === \'object\'', function () {
					assert.strictEqual(typeof options.beautify, 'object');
				});
				it('lodash.isPlainObject(options.beautify)', function () {
					assert.strictEqual(lodash.isPlainObject(options.beautify), true);
				});
			} else {
				it('has no property "beautify"', function () {
					assert.strictEqual(true, true);
				});
			}
		});

		describe('options should have "__UNIQUE_KEY__" property as string', function () {
			it(`typeof options.__UNIQUE_KEY__ === 'string' // => ${options.__UNIQUE_KEY__}`, function () {
				assert.strictEqual(typeof options.__UNIQUE_KEY__, 'string');
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
				it(`typeof options.ejs.compileDebug === \'boolean\' // => ${options.ejs.compileDebug}`, function () {
					assert.strictEqual(typeof options.ejs.compileDebug, 'boolean');
				});
				it(`typeof options.ejs.locals === \'undefined\' // => ${options.ejs.locals}`, function () {
					assert.strictEqual(typeof options.ejs.locals, 'undefined');
				});
				it(`typeof options.ejs.context === \'undefined\' // => ${options.ejs.context}`, function () {
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

			describe('if options.ejs has "escape" method - it must be an function', function () {
				if (options.ejs.hasOwnProperty('escape')) {
					it(`typeof options.ejs.escape === 'function' // => ${typeof options.ejs.escape}`, function () {
						assert.strictEqual(typeof options.ejs.escape, 'function');
					});
				} else {
					it('has no method "escape"', function () {
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

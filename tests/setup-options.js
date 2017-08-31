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

const userOptions = require('./data/ejs-options');

// ----------------------------------------
// Private
// ----------------------------------------

const fileName = chalk.yellow('setup-options.js');
const callEmpty = `${chalk.blue('let')} options = ${chalk.cyan('setupOptions')}(userOptions);`;

// ----------------------------------------
// Test
// ----------------------------------------

describe(fileName, function () {
	describe(callEmpty, function () {
		describe('options should be an plain object', function () {
			// sample
			let options = setupOptions(userOptions);

			// test
			it('typeof options === \'object\'', function () {
				assert.strictEqual(typeof options, 'object');
			});

			// test
			it('lodash.isPlainObject(options)', function () {
				assert.strictEqual(lodash.isPlainObject(options), true);
			});
		});

		describe('options should have "ejs" property as object', function () {
			// sample
			let options = setupOptions(userOptions);

			it('typeof options.ejs === \'object\'', function () {
				assert.strictEqual(typeof options.ejs, 'object');
			});

			it('lodash.isPlainObject(options.ejs)', function () {
				assert.strictEqual(lodash.isPlainObject(options.ejs), true);
			});

			describe('options.ejs should have constant values', function () {
				// sample
				let options = setupOptions(userOptions);

				// test
				it('options.ejs.debug === false', function () {
					assert.strictEqual(options.ejs.debug, false);
				});

				// test
				it('options.ejs.client === false', function () {
					assert.strictEqual(options.ejs.client, false);
				});

				// test
				it('options.ejs._with === false', function () {
					assert.strictEqual(options.ejs._with, false);
				});

				// test
				it('options.ejs.rmWhitespace === false', function () {
					assert.strictEqual(options.ejs.rmWhitespace, false);
				});

				// test
				it('options.ejs.strict === true', function () {
					assert.strictEqual(options.ejs.strict, true);
				});

				// test
				it('typeof options.ejs.compileDebug === \'boolean\'', function () {
					assert.strictEqual(typeof options.ejs.compileDebug, 'boolean');
				});

				// test
				it('typeof options.ejs.locals === \'undefined\'', function () {
					assert.strictEqual(typeof options.ejs.locals, 'undefined');
				});
			});

			describe('options.ejs should have "delimiter" property as string', function () {
				// sample
				let options = setupOptions(userOptions);

				// test
				it('typeof options.ejs.delimiter === \'string\'', function () {
					assert.strictEqual(typeof options.ejs.delimiter, 'string');
				});

				// test
				it('length of options.ejs.delimiter should be 1', function () {
					assert.strictEqual(options.ejs.delimiter.length, 1);
				});

				// test
				it('value of options.ejs.delimiter should be one of [\'%\',\'?\',\'&\',\'$\']', function () {
					assert.notStrictEqual(['%','?','&','$'].indexOf(options.ejs.delimiter), -1);
				});
			});

			describe('options.ejs should have "localsName" property as string with correct property value', function () {
				// sample
				let options = setupOptions(userOptions);

				// test
				it('typeof options.ejs.localsName === \'string\'', function () {
					assert.strictEqual(typeof options.ejs.localsName, 'string');
				});

				// test
				it('length of options.ejs.localsName should be 1 or more', function () {
					assert.strictEqual(options.ejs.localsName.length >= 1, true);
				});

				// test
				it('value of options.ejs.localsName should not start from number', function () {
					assert.strictEqual(/^\d/.test(options.ejs.localsName), false);
				});
			});

			describe('if options.ejs has "context" or "escape" properties - they must be an functions', function () {
				// sample
				let options = setupOptions(userOptions);

				// test
				if (options.ejs.hasOwnProperty('context')) {
					it('typeof options.ejs.context === \'function\'', function () {
						assert.strictEqual(typeof options.ejs.context, 'function');
					});
				} else {
					it('has no property "context"', function () {
						assert.strictEqual(true, true);
					});
				}

				// test
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
});

// ----------------------------------------
// Exports
// ----------------------------------------

// Если это модуль, он должен экспортировать
// Описаный в нем функционал или данные из текущего файла

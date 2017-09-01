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

const _spec = chalk.gray('spec:');
const _work = chalk.gray('in work:');
const _inner = chalk.gray('inner props:');

// ----------------------------------------
// Test
// ----------------------------------------


describe(chalk.green('let options = setupOptions() - should return plain object'), function () {
	let options = setupOptions();

	it('typeof options === \'object\'', function () {
		assert.strictEqual(typeof options, 'object');
	});

	it('lodash.isPlainObject(options)', function () {
		assert.strictEqual(lodash.isPlainObject(options), true);
	});
});

describe(chalk.green('props tests'), function () {

	describe('extname', function () {
		describe(_spec, function () {
			let options = setupOptions();

			it(`typeof options.extname should be a 'string', by default - '.html'`, function () {
				assert.strictEqual(typeof options.extname, 'string');
			});

			it('should starts with . (dot)', function () {
				assert.strictEqual(/^\./.test(options.extname), true);
			});

			it('length of options.extname should be 2 or more', function () {
				assert.strictEqual(options.extname.length >= 2, true);
			});
		});

		describe(_work, function () {
			it('let options = setupOptions()  // => options.extname ===  \'.html\'', function () {
				let options = setupOptions();
				assert.strictEqual(options.extname, '.html');
			});

			it('let options = setupOptions({extname: \'php\'})  // => options.extname ===  \'.php\'', function () {
				let options = setupOptions({
					extname: 'php'
				});
				assert.strictEqual(options.extname, '.php');
			});

			it('let options = setupOptions({extname: \'.php\'})  // => options.extname ===  \'.php\'', function () {
				let options = setupOptions({
					extname: '.php'
				});
				assert.strictEqual(options.extname, '.php');
			});

			it('let options = setupOptions({extname: null})  // => options.extname ===  \'.html\'', function () {
				let options = setupOptions({
					extname: null
				});
				assert.strictEqual(options.extname, '.html');
			});
		});
	});

	describe('options should have "ejs" property as object', function () {
		describe(_spec, function () {
			let options = setupOptions();

			it('typeof options.ejs === \'object\'', function () {
				assert.strictEqual(typeof options.ejs, 'object');
			});

			it('lodash.isPlainObject(options.ejs)', function () {
				assert.strictEqual(lodash.isPlainObject(options.ejs), true);
			});
		});

		describe(_inner, function () {
			describe('localsName', function () {
				describe(_spec, function () {
					let options = setupOptions();

					it(`typeof options.ejs.localsName should be a 'string', by default - 'locals'`, function () {
						assert.strictEqual(typeof options.ejs.localsName, 'string');
					});

					it('length of options.ejs.localsName should be 1 or more', function () {
						assert.strictEqual(options.ejs.localsName.length >= 1, true);
					});
				});

				describe(_work, function () {
					it('let options = setupOptions()  // => options.ejs.localsName ===  \'locals\'', function () {
						let options = setupOptions();
						assert.strictEqual(options.ejs.localsName, 'locals');
					});

					it('let options = setupOptions({localsName: \'app\'})  // => options.ejs.localsName ===  \'app\'', function () {
						let options = setupOptions({
							localsName: 'app'
						});
						assert.strictEqual(options.ejs.localsName, 'app');
					});

					it('let options = setupOptions({localsName: false})  // => options.ejs.localsName ===  \'locals\'', function () {
						let options = setupOptions({
							localsName: false
						});
						assert.strictEqual(options.ejs.localsName, 'locals');
					});
				});
			});

			describe('delimiter', function () {
				describe(_spec, function () {
					let options = setupOptions();

					it(`typeof options.ejs.delimiter should be a 'string', by default - '%'`, function () {
						assert.strictEqual(typeof options.ejs.delimiter, 'string');
					});

					it('length of options.ejs.delimiter should be 1', function () {
						assert.strictEqual(options.ejs.delimiter.length, 1);
					});

					it(`value of options.ejs.delimiter should be one of ['%','?','&','$'] // => ${options.ejs.delimiter}`, function () {
						assert.notStrictEqual(['%', '?', '&', '$'].indexOf(options.ejs.delimiter), -1);
					});
				});

				describe(_work, function () {
					it('let options = setupOptions({})  // => options.ejs.delimiter ===  \'%\'', function () {
						let options = setupOptions();
						assert.strictEqual(options.ejs.delimiter, '%');
					});

					it('let options = setupOptions({delimiter: \'#\'})  // => options.ejs.delimiter ===  \'%\'', function () {
						let options = setupOptions({
							delimiter: '#'
						});
						assert.strictEqual(options.ejs.delimiter, '%');
					});

					it('let options = setupOptions({delimiter: true})  // => options.ejs.delimiter ===  \'%\'', function () {
						let options = setupOptions({
							delimiter: true
						});
						assert.strictEqual(options.ejs.delimiter, '%');
					});

					it('let options = setupOptions({delimiter: null})  // => options.ejs.delimiter ===  \'%\'', function () {
						let options = setupOptions({
							delimiter: null
						});
						assert.strictEqual(options.ejs.delimiter, '%');
					});

					it('let options = setupOptions({delimiter: \'$\'})  // => options.ejs.delimiter ===  \'$\'', function () {
						let options = setupOptions({
							delimiter: '$'
						});
						assert.strictEqual(options.ejs.delimiter, '$');
					});

					it('let options = setupOptions({delimiter: String(\'?\')})  // => options.ejs.delimiter ===  \'?\'', function () {
						let options = setupOptions({
							delimiter: String('?')
						});
						assert.strictEqual(options.ejs.delimiter, '?');
					});
				});
			});

			describe('compileDebug', function () {
				describe(_spec, function () {
					it('should lead to a boolean value', function () {
						let options = setupOptions();
						assert.strictEqual(typeof options.ejs.compileDebug, 'boolean');
					});
				});

				describe(_work, function () {
					it('let options = setupOptions()  // => options.ejs.compileDebug ===  false', function () {
						let options = setupOptions();
						assert.strictEqual(options.ejs.compileDebug, false);
					});

					it('let options = setupOptions({compileDebug: null})  // => options.ejs.compileDebug ===  false', function () {
						let options = setupOptions({
							compileDebug: null
						});
						assert.strictEqual(options.ejs.compileDebug, false);
					});

					it('let options = setupOptions({compileDebug: 0})  // => options.ejs.compileDebug ===  false', function () {
						let options = setupOptions({
							compileDebug: 0
						});
						assert.strictEqual(options.ejs.compileDebug, false);
					});

					it('let options = setupOptions({compileDebug: true})  // => options.ejs.compileDebug ===  true', function () {
						let options = setupOptions({
							compileDebug: true
						});
						assert.strictEqual(options.ejs.compileDebug, true);
					});

					it('let options = setupOptions({compileDebug: \'bla-bla-bla\'})  // => options.ejs.compileDebug ===  true', function () {
						let options = setupOptions({
							compileDebug: 'bla-bla-bla'
						});
						assert.strictEqual(options.ejs.compileDebug, true);
					});
				});
			});

			describe('escape', function () {
				describe(_spec, function () {
					it('By default should be undefined', function () {
						let options = setupOptions();
						assert.strictEqual(options.ejs.escape, undefined);
					});

					it('If set - should be function', function () {
						let options = setupOptions({
							escape () {}
						});
						assert.strictEqual(typeof options.ejs.escape, 'function');
					});

					it('If set - should be function (2)', function () {
						function escape () {}
						let options = setupOptions({
							escape: escape
						});
						assert.strictEqual(options.ejs.escape, escape);
					});
				});

				describe(_work, function () {
					it('let options = setupOptions()  // => options.ejs.escape ===  undefined', function () {
						let options = setupOptions();
						assert.strictEqual(options.ejs.escape, undefined);
					});

					it('let options = setupOptions({escape: null})  // => options.ejs.escape ===  undefined', function () {
						let options = setupOptions({
							escape: null
						});
						assert.strictEqual(options.ejs.escape, undefined);
					});

					it('let options = setupOptions({escape() {}})  // => options.ejs.escape ===  [Function: escape]', function () {
						let options = setupOptions({
							escape () {}
						});
						assert.strictEqual(typeof options.ejs.escape, 'function');
					});
				});
			});
		});
	});
});

function testPreset(presetName, presetOptions) {
	// sample
	let options = setupOptions(presetOptions);

	describe(chalk.green(presetName), function () {


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
			});

			describe('options.ejs should have "localsName" property as string with correct property value', function () {

			});


		});
	});
}

// ----------------------------------------
// Exports
// ----------------------------------------

// Если это модуль, он должен экспортировать
// Описаный в нем функционал или данные из текущего файла

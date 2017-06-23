/**
 * @module libs/data/reserved-local-keys
 * @author Oleg Dutchenko <dutchenko.o.wezom@gmail.com>
 * @version 0.0.1
 */

'use strict';

/**
 * > Reserved properties for `renderData` and proxy `locals`
 * @type {Array}
 * @sourceCode |+13
 */
const resevedLocalKeys = [
	'__INSTANCE',
	'blocks',
	'block',
	'layout',
	'partial',
	'controller',
	'datafile',
	'file',
	'locals',
	'include'
];

module.exports = resevedLocalKeys;

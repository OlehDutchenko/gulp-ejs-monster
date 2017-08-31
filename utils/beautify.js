'use strict';

/**
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 3.0.0
 */

// ----------------------------------------
// Imports
// ----------------------------------------

// modules
const jsBeautify = require('js-beautify');

// ----------------------------------------
// Private
// ----------------------------------------

/**
 * @param {RegExp} pattern
 * @param {string} placeholder
 * @param {string} markup
 * @returns {Object}
 * @private
 */
function cut (pattern, placeholder, markup) {
	let list = [];
	let arr = pattern.exec(markup);

	while (arr !== null) {
		list.push(arr[0]);
		markup = markup.replace(pattern, placeholder);
		arr = pattern.exec(markup);
	}

	return {list, markup};
}

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Beautify markup
 * @param {string} markup
 * @param {Object} options
 * @returns {string}
 */
function beautify (markup, options) {
	let scriptsPattern = /<script(.)*>(|.|\n)*<\/script>/;
	let scriptsPlaceholder = '<script-placeholder></script-placeholder>';
	let scriptsRegExp = new RegExp(scriptsPlaceholder.replace(/\//g, '/'));

	let stylesPattern = /<style(.)*>(|.|\n)*<\/style>/;
	let stylesPlaceholder = '<style-placeholder></style-placeholder>';
	let stylesRegExp = new RegExp(stylesPlaceholder.replace(/\//g, '/'));

	let presPattern = /<pre(.)*>(|.|\n)*<\/pre>/;
	let presPlaceholder = '<pre-placeholder></pre-placeholder>';
	let presRegExp = new RegExp(presPlaceholder.replace(/\//g, '/'));

	let scriptsCut = cut(scriptsPattern, scriptsPlaceholder, markup);
	let scripts = scriptsCut.list;
	markup = scriptsCut.markup;

	let stylesCut = cut(stylesPattern, stylesPlaceholder, markup);
	let styles = stylesCut.list;
	markup = stylesCut.markup;

	let presCut = cut(presPattern, presPlaceholder, markup);
	let pres = presCut.list;
	markup = presCut.markup;

	markup = jsBeautify.html(markup, options);

	scripts.forEach(code => (markup = markup.replace(scriptsRegExp, code)));
	styles.forEach(code => (markup = markup.replace(stylesRegExp, code)));
	pres.forEach(code => (markup = markup.replace(presRegExp, code)));

	return markup;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = beautify;

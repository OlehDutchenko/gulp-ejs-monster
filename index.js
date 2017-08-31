'use strict';

/**
 * > Gulp plugin for [ejs](http://ejs.co/). Version for [Wezom](wezom.com.ua) projects.
 * The project is inspired by [ejs-locals](https://github.com/RandomEtc/ejs-locals)
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 3.0.0
 */

// ----------------------------------------
// Imports
// ----------------------------------------

// modules
const path = require('path');
const esj = require('ejs');
const chalk = require('chalk');
const lodash = require('lodash');
const through2 = require('through2');
const gutil = require('gulp-util');
const notSupportedFile = require('gulp-not-supported-file');

// data
const pkg = require('./package.json');

// utils
const setupOptions = require('./utils/setup-options');
const HistoryStorage = require('./utils/history-storage');

// methods

// ----------------------------------------
// Private
// ----------------------------------------

/**
 * Create new plugin error
 * @const {Function}
 * @param {Object} data
 * @param {Object} [options={}]
 * @return {PluginError}
 */
const pluginError = (data, options) => new gutil.PluginError(pkg.name, data, options);

/**
 * All gathered options
 * @const {Object}
 * @private
 */
const configs = {};

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * Core plugin method
 * @param {Object} opts
 * @returns {DestroyableTransform}
 */
function gulpEjsMonster (opts = {}) {}

/**
 * Plugin name
 * @type {string}
 */
gulpEjsMonster.pluginName = pkg.name;

/**
 * Prevention failing process
 * @type {Function}
 */
gulpEjsMonster.preventCrash = function () {
	this.emit('end');
};

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = gulpEjsMonster;

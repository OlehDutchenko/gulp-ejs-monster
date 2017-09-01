'use strict';

/**
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 3.0.0
 */

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * [FW] Create `[localsName].requireNodeModule()` method
 * @param {HistoryStorage} storage
 * @returns {Function}
 * @sourceCode
 */
function createRequireNodeModuleMethod (storage) {
	/**
	 * require module from installed `node_modules`
	 * @param {string} moduleName
	 * @memberOf locals
	 * @sourceCode
	 */
	function requireNodeModule (moduleName) {
		storage.push(`> require node module "${moduleName}"`, false, '>>');
		storage.indent('<<');
		return require(moduleName);
	}

	return requireNodeModule;
}

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = createRequireNodeModuleMethod;

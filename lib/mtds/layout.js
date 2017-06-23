/**
 * @module libs/mtds/layouts
 * @author Oleg Dutchenko <dutchenko.o.wezom@gmail.com>
 * @version 0.0.1
 */

'use strict';

const path = require('path');

/**
 * @static
 * @param  {Object}   renderOptions
 * @prop   {string}   renderOptions.layouts
 * @return {Function}
 * @sourceCode |+16
 */
function layout (renderOptions) {
	const layoutsFolder = renderOptions.layouts;
	/**
	 * @param  {string}   layoutPath
	 * @return {undefined}
	 */
	return function (layoutPath) {
		this.__INSTANCE.INSIDE = false;

		let layoutFullPath = path.resolve(path.join(layoutsFolder, `${layoutPath}.ejs`));
		this.__INSTANCE.LAYOUTPATH = layoutFullPath;
		this.__INSTANCE.SOURCES.add(this.filepath, layoutFullPath);

		this.__INSTANCE.INSIDE = true;
	};
}

module.exports = layout;

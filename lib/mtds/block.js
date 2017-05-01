/**
 * @module libs/mtds/blocks
 * @author Oleg Dutchenko <dutchenko.o.wezom@gmail.com>
 * @version 0.0.1
 */

'use strict';

const chalk = require('chalk');

/**
 * @static
 * @param  {Object} blocks
 * @return {Function}
 * @sourceCode |+52
 */
const block = module.exports = function (blocks, renderData) {
	
	class Block {
		constructor(name) {
			this.name = name;
			this.parts = [];
		}
		toString() {
			renderData.__INSTANCE.STACK.push(chalk.gray(`   ← get content from block "${this.name}"`));
			return this.parts.join('\n');
		}
		append(markup) {
			renderData.__INSTANCE.STACK.push(chalk.gray(`   ↓ append part to block "${this.name}"`));
			this.parts.push(markup);
		}
		prepend(markup) {
			renderData.__INSTANCE.STACK.push(chalk.gray(`   ↑ prepend part to block "${this.name}"`));
			this.parts.unshift(markup);
		}
		replace(markup) {
			if (this.parts.length) {
				renderData.__INSTANCE.STACK.push(chalk.gray(`   ↔ replace content in block "${this.name}"`));
			} else {
				renderData.__INSTANCE.STACK.push(chalk.gray(`   → set content for block "${this.name}"`));
			}
			this.parts = [markup];
		}
	}


	/**
	 * @param  {string}   name
	 * @param  {string}   html
	 * @param  {string}   [mtd]
	 * @return {Object}
	 */
	return function(name, markup, mtd) {
		var slot = blocks[name];
		if (!slot) {
			slot = blocks[name] = new Block(name);
		}

		if (mtd === 'append' || mtd === 'prepend') {
			slot[mtd](markup);
		} else {
			slot.replace(markup);
		}

		return slot;
	};
};

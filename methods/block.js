'use strict';

/**
 * @module
 * @author Oleg Dutchenko <dutchenko.o.dev@gmail.com>
 * @version 3.0.9
 */

// ----------------------------------------
// Public
// ----------------------------------------

/**
 * [FW] Create `[localsName].block()` method
 * @param  {Object} blocks
 * @param  {HistoryStorage} storage
 * @return {Function}
 * @sourceCode
 */
function createBlockMethod (blocks, storage) {
	class Block {
		constructor (blockName) {
			this.blockName = blockName;
			this.parts = [];
		}
		toString () {
			storage.push(`    ← get content from block "${this.blockName}"`);
			return this.parts.join('\n');
		}
		append (markup) {
			storage.push(`    ↓ append part to block "${this.blockName}"`);
			this.parts.push(markup);
		}
		prepend (markup) {
			storage.push(`    ↑ prepend part to block "${this.blockName}"`);
			this.parts.unshift(markup);
		}
		replace (markup) {
			if (this.parts.length) {
				storage.push(`    ↔ replace content in block "${this.blockName}"`);
			} else {
				storage.push(`    → set content for block "${this.blockName}"`);
			}
			this.parts = [markup];
		}
	}

	/**
	 * @param {string} blockName - block name by which you call it content
	 * @param {string} markup - block value
	 * @param {string} [mtd='replace']
	 * @return {Block}
	 * @memberOf locals
	 * @sourceCode
	 */
	function block (blockName, markup, mtd) {
		let slot = blocks[blockName];
		if (!slot) {
			slot = blocks[blockName] = new Block(blockName);
		}

		if (mtd === 'append' || mtd === 'prepend') {
			slot[mtd](markup);
		} else {
			slot.replace(markup);
		}

		return slot;
	}

	return block;
}

/**
 * Clear all added blocks
 * @sourceCode
 */
createBlockMethod.clearAllBlocks = function (blocks) {
	for (let key in blocks) {
		delete blocks[key];
	}
};

// ----------------------------------------
// Exports
// ----------------------------------------

module.exports = createBlockMethod;

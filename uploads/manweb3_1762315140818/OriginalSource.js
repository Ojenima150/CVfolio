/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

const Source = require("./Source");
const { SourceNode } = require("source-map");
const { SourceListMap } = require("source-list-map");
const { getSourceAndMap, getMap } = require("./helpers");

const SPLIT_REGEX = /(?!$)[^\n\r;{}]*[\n\r;{}]*/g;

function _splitCode(code) {
	return code.match(SPLIT_REGEX) || [];
}

class OriginalSource extends Source {
	constructor(value, name) {
		super();
		const isBuffer = Buffer.isBuffer(value);
		this._value = isBuffer ? undefined : value;
		this._valueAsBuffer = isBuffer ? value : undefined;
		this._name = name;
	}

	getName() {
		return this._name;
	}

	source() {
		if (this._value === undefined) {
			this._value = this._valueAsBuffer.toString("utf-8");
		}
		return this._value;
	}

	buffer() {
		if (this._valueAsBuffer === undefined) {
			this._valueAsBuffer = Buffer.from(this._value, "utf-8");
		}
		return this._valueAsBuffer;
	}

	map(options) {
		return getMap(this, options);
	}

	sourceAndMap(options) {
		return getSourceAndMap(this, options);
	}

	node(options) {
		if (this._value === undefined) {
			this._value = this._valueAsBuffer.toString("utf-8");
		}
		const value = this._value;
		const name = this._name;
		const lines = value.split("\n");
		const node = new SourceNode(
			null,
			null,
			null,
			lines.map(function (line, idx) {
				let pos = 0;
				if (options && options.columns === false) {
					const content = line + (idx !== lines.length - 1 ? "\n" : "");
					return new SourceNode(idx + 1, 0, name, content);
				}
				return new SourceNode(
					null,
					null,
					null,
					_splitCode(line + (idx !== lines.length - 1 ? "\n" : "")).map(
						function (item) {
							if (/^\s*$/.test(item)) {
								pos += item.length;
								return item;
							}
							const res = new SourceNode(idx + 1, pos, name, item);
							pos += item.length;
							return res;
						}
					)
				);
			})
		);
		node.setSourceContent(name, value);
		return node;
	}

	listMap(options) {
		if (this._value === undefined) {
			this._value = this._valueAsBuffer.toString("utf-8");
		}
		return new SourceListMap(this._value, this._name, this._value);
	}

	updateHash(hash) {
		if (this._valueAsBuffer === undefined) {
			this._valueAsBuffer = Buffer.from(this._value, "utf-8");
		}
		hash.update("OriginalSource");
		hash.update(this._valueAsBuffer);
		hash.update(this._name || "");
	}
}

module.exports = OriginalSource;
ndMap(options) {
		return getSourceAndMap(this, options);
	}

	/**
	 * @param {Options} options options
	 * @param {OnChunk} onChunk called for each chunk of code
	 * @param {OnSource} onSource called for each source
	 * @param {OnName} _onName called for each name
	 * @returns {GeneratedSourceInfo} generated source info
	 */
	streamChunks(options, onChunk, onSource, _onName) {
		if (this._value === undefined) {
			this._value =
				/** @type {Buffer} */
				(this._valueAsBuffer).toString("utf8");
		}
		onSource(0, this._name, this._value);
		const finalSource = Boolean(options && options.finalSource);
		if (!options || options.columns !== false) {
			// With column info we need to read all lines and split them
			const matches = splitIntoPotentialTokens(this._value);
			let line = 1;
			let column = 0;
			if (matches !== null) {
				for (const match of matches) {
					const isEndOfLine = match.endsWith("\n");
					if (isEndOfLine && match.length === 1) {
						if (!finalSource) onChunk(match, line, column, -1, -1, -1, -1);
					} else {
						const chunk = finalSource ? undefined : match;
						onChunk(chunk, line, column, 0, line, column, -1);
					}
					if (isEndOfLine) {
						line++;
						column = 0;
					} else {
						column += match.length;
					}
				}
			}
			return {
				generatedLine: line,
				generatedColumn: column,
				source: finalSource ? this._value : undefined,
			};
		} else if (finalSource) {
			// Without column info and with final source we only
			// need meta info to generate mapping
			const result = getGeneratedSourceInfo(this._value);
			const { generatedLine, generatedColumn } = result;
			if (generatedColumn === 0) {
				for (
					let line = 1;
					line < /** @type {number} */ (generatedLine);
					line++
				) {
					onChunk(undefined, line, 0, 0, line, 0, -1);
				}
			} else {
				for (
					let line = 1;
					line <= /** @type {number} */ (generatedLine);
					line++
				) {
					onChunk(undefined, line, 0, 0, line, 0, -1);
				}
			}
			return result;
		}
		// Without column info, but also without final source
		// we need to split source by lines
		let line = 1;
		const matches = splitIntoLines(this._value);
		/** @type {string | undefined} */
		let match;
		for (match of matches) {
			onChunk(finalSource ? undefined : match, line, 0, 0, line, 0, -1);
			line++;
		}
		return matches.length === 0 || /** @type {string} */ (match).endsWith("\n")
			? {
					generatedLine: matches.length + 1,
					generatedColumn: 0,
					source: finalSource ? this._value : undefined,
				}
			: {
					generatedLine: matches.length,
					generatedColumn: /** @type {string} */ (match).length,
					source: finalSource ? this._value : undefined,
				};
	}

	/**
	 * @param {HashLike} hash hash
	 * @returns {void}
	 */
	updateHash(hash) {
		hash.update("OriginalSource");
		hash.update(this.buffer());
		hash.update(this._name || "");
	}
}

module.exports = OriginalSource;

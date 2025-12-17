/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

const Source = require("./Source");
const { SourceNode } = require("source-map");
const { SourceListMap } = require("source-list-map");

class RawSource extends Source {
	constructor(value, convertToString = false) {
		super();
		const isBuffer = Buffer.isBuffer(value);
		if (!isBuffer && typeof value !== "string") {
			throw new TypeError("argument 'value' must be either string of Buffer");
		}
		this._valueIsBuffer = !convertToString && isBuffer;
		this._value = convertToString && isBuffer ? undefined : value;
		this._valueAsBuffer = isBuffer ? value : undefined;
	}

	isBuffer() {
		return this._valueIsBuffer;
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
		return null;
	}

	node(options) {
		if (this._value === undefined) {
			this._value = this._valueAsBuffer.toString("utf-8");
		}
		return new SourceNode(null, null, null, this._value);
	}

	listMap(options) {
		if (this._value === undefined) {
			this._value = this._valueAsBuffer.toString("utf-8");
		}
		return new SourceListMap(this._value);
	}

	updateHash(hash) {
		if (this._valueAsBuffer === undefined) {
			this._valueAsBuffer = Buffer.from(this._value, "utf-8");
		}
		hash.update("RawSource");
		hash.update(this._valueAsBuffer);
	}
}

module.exports = RawSource;
			? internedString
					: value;
		/**
		 * @private
		 * @type {undefined | Buffer}
		 */
		this._valueAsBuffer = isBuffer ? value : undefined;
		/**
		 * @private
		 * @type {undefined | string}
		 */
		this._valueAsString = isBuffer ? undefined : internedString;
	}

	isBuffer() {
		return this._valueIsBuffer;
	}

	/**
	 * @returns {SourceValue} source
	 */
	source() {
		if (this._value === undefined) {
			const value =
				/** @type {Buffer} */
				(this._valueAsBuffer).toString("utf8");
			if (isDualStringBufferCachingEnabled()) {
				this._value = internString(value);
			}
			return value;
		}
		return this._value;
	}

	buffer() {
		if (this._valueAsBuffer === undefined) {
			const value = Buffer.from(/** @type {string} */ (this._value), "utf8");
			if (isDualStringBufferCachingEnabled()) {
				this._valueAsBuffer = value;
			}
			return value;
		}
		return this._valueAsBuffer;
	}

	/**
	 * @param {MapOptions=} options map options
	 * @returns {RawSourceMap | null} map
	 */
	// eslint-disable-next-line no-unused-vars
	map(options) {
		return null;
	}

	/**
	 * @param {Options} options options
	 * @param {OnChunk} onChunk called for each chunk of code
	 * @param {OnSource} onSource called for each source
	 * @param {OnName} onName called for each name
	 * @returns {GeneratedSourceInfo} generated source info
	 */
	streamChunks(options, onChunk, onSource, onName) {
		let strValue = this._valueAsString;
		if (strValue === undefined) {
			const value = this.source();
			strValue = typeof value === "string" ? value : value.toString("utf8");
			if (isDualStringBufferCachingEnabled()) {
				this._valueAsString = internString(strValue);
			}
		}
		return streamChunksOfRawSource(
			strValue,
			onChunk,
			onSource,
			onName,
			Boolean(options && options.finalSource),
		);
	}

	/**
	 * @param {HashLike} hash hash
	 * @returns {void}
	 */
	updateHash(hash) {
		hash.update("RawSource");
		hash.update(this.buffer());
	}
}

module.exports = RawSource;

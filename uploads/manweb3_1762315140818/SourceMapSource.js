/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

const Source = require("./Source");
const { SourceNode, SourceMapConsumer } = require("source-map");
const { SourceListMap, fromStringWithSourceMap } = require("source-list-map");
const { getSourceAndMap, getMap } = require("./helpers");
const applySourceMap = require("./applySourceMap");

class SourceMapSource extends Source {
	constructor(
		value,
		name,
		sourceMap,
		originalSource,
		innerSourceMap,
		removeOriginalSource
	) {
		super();
		const valueIsBuffer = Buffer.isBuffer(value);
		this._valueAsString = valueIsBuffer ? undefined : value;
		this._valueAsBuffer = valueIsBuffer ? value : undefined;

		this._name = name;

		this._hasSourceMap = !!sourceMap;
		const sourceMapIsBuffer = Buffer.isBuffer(sourceMap);
		const sourceMapIsString = typeof sourceMap === "string";
		this._sourceMapAsObject =
			sourceMapIsBuffer || sourceMapIsString ? undefined : sourceMap;
		this._sourceMapAsString = sourceMapIsString ? sourceMap : undefined;
		this._sourceMapAsBuffer = sourceMapIsBuffer ? sourceMap : undefined;

		this._hasOriginalSource = !!originalSource;
		const originalSourceIsBuffer = Buffer.isBuffer(originalSource);
		this._originalSourceAsString = originalSourceIsBuffer
			? undefined
			: originalSource;
		this._originalSourceAsBuffer = originalSourceIsBuffer
			? originalSource
			: undefined;

		this._hasInnerSourceMap = !!innerSourceMap;
		const innerSourceMapIsBuffer = Buffer.isBuffer(innerSourceMap);
		const innerSourceMapIsString = typeof innerSourceMap === "string";
		this._innerSourceMapAsObject =
			innerSourceMapIsBuffer || innerSourceMapIsString
				? undefined
				: innerSourceMap;
		this._innerSourceMapAsString = innerSourceMapIsString
			? innerSourceMap
			: undefined;
		this._innerSourceMapAsBuffer = innerSourceMapIsBuffer
			? innerSourceMap
			: undefined;

		this._removeOriginalSource = removeOriginalSource;
	}

	_ensureValueBuffer() {
		if (this._valueAsBuffer === undefined) {
			this._valueAsBuffer = Buffer.from(this._valueAsString, "utf-8");
		}
	}

	_ensureValueString() {
		if (this._valueAsString === undefined) {
			this._valueAsString = this._valueAsBuffer.toString("utf-8");
		}
	}

	_ensureOriginalSourceBuffer() {
		if (this._originalSourceAsBuffer === undefined && this._hasOriginalSource) {
			this._originalSourceAsBuffer = Buffer.from(
				this._originalSourceAsString,
				"utf-8"
			);
		}
	}

	_ensureOriginalSourceString() {
		if (this._originalSourceAsString === undefined && this._hasOriginalSource) {
			this._originalSourceAsString = this._originalSourceAsBuffer.toString(
				"utf-8"
			);
		}
	}

	_ensureInnerSourceMapObject() {
		if (this._innerSourceMapAsObject === undefined && this._hasInnerSourceMap) {
			this._ensureInnerSourceMapString();
			this._innerSourceMapAsObject = JSON.parse(this._innerSourceMapAsString);
		}
	}

	_ensureInnerSourceMapBuffer() {
		if (this._innerSourceMapAsBuffer === undefined && this._hasInnerSourceMap) {
			this._ensureInnerSourceMapString();
			this._innerSourceMapAsBuffer = Buffer.from(
				this._innerSourceMapAsString,
				"utf-8"
			);
		}
	}

	_ensureInnerSourceMapString() {
		if (this._innerSourceMapAsString === undefined && this._hasInnerSourceMap) {
			if (this._innerSourceMapAsBuffer !== undefined) {
				this._innerSourceMapAsString = this._innerSourceMapAsBuffer.toString(
					"utf-8"
				);
			} else {
				this._innerSourceMapAsString = JSON.stringify(
					this._innerSourceMapAsObject
				);
			}
		}
	}

	_ensureSourceMapObject() {
		if (this._sourceMapAsObject === undefined) {
			this._ensureSourceMapString();
			this._sourceMapAsObject = JSON.parse(this._sourceMapAsString);
		}
	}

	_ensureSourceMapBuffer() {
		if (this._sourceMapAsBuffer === undefined) {
			this._ensureSourceMapString();
			this._sourceMapAsBuffer = Buffer.from(this._sourceMapAsString, "utf-8");
		}
	}

	_ensureSourceMapString() {
		if (this._sourceMapAsString === undefined) {
			if (this._sourceMapAsBuffer !== undefined) {
				this._sourceMapAsString = this._sourceMapAsBuffer.toString("utf-8");
			} else {
				this._sourceMapAsString = JSON.stringify(this._sourceMapAsObject);
			}
		}
	}

	getArgsAsBuffers() {
		this._ensureValueBuffer();
		this._ensureSourceMapBuffer();
		this._ensureOriginalSourceBuffer();
		this._ensureInnerSourceMapBuffer();
		return [
			this._valueAsBuffer,
			this._name,
			this._sourceMapAsBuffer,
			this._originalSourceAsBuffer,
			this._innerSourceMapAsBuffer,
			this._removeOriginalSource
		];
	}

	source() {
		this._ensureValueString();
		return this._valueAsString;
	}

	map(options) {
		if (!this._hasInnerSourceMap) {
			this._ensureSourceMapObject();
			return this._sourceMapAsObject;
		}
		return getMap(this, options);
	}

	sourceAndMap(options) {
		if (!this._hasInnerSourceMap) {
			this._ensureValueString();
			this._ensureSourceMapObject();
			return {
				source: this._valueAsString,
				map: this._sourceMapAsObject
			};
		}
		return getSourceAndMap(this, options);
	}

	node(options) {
		this._ensureValueString();
		this._ensureSourceMapObject();
		this._ensureOriginalSourceString();
		let node = SourceNode.fromStringWithSourceMap(
			this._valueAsString,
			new SourceMapConsumer(this._sourceMapAsObject)
		);
		node.setSourceContent(this._name, this._originalSourceAsString);
		if (this._hasInnerSourceMap) {
			this._ensureInnerSourceMapObject();
			node = applySourceMap(
				node,
				new SourceMapConsumer(this._innerSourceMapAsObject),
				this._name,
				this._removeOriginalSource
			);
		}
		return node;
	}

	listMap(options) {
		this._ensureValueString();
		this._ensureSourceMapObject();
		options = options || {};
		if (options.module === false)
			return new SourceListMap(
				this._valueAsString,
				this._name,
				this._valueAsString
			);

		return fromStringWithSourceMap(
			this._valueAsString,
			this._sourceMapAsObject
		);
	}

	updateHash(hash) {
		this._ensureValueBuffer();
		this._ensureSourceMapBuffer();
		this._ensureOriginalSourceBuffer();
		this._ensureInnerSourceMapBuffer();

		hash.update("SourceMapSource");

		hash.update(this._valueAsBuffer);

		hash.update(this._sourceMapAsBuffer);

		if (this._hasOriginalSource) {
			hash.update(this._originalSourceAsBuffer);
		}

		if (this._hasInnerSourceMap) {
			hash.update(this._innerSourceMapAsBuffer);
		}

		hash.update(this._removeOriginalSource ? "true" : "false");
	}
}

module.exports = SourceMapSource;
g = value;
			}
			return value;
		}
		return /** @type {string} */ (this._innerSourceMapAsString);
	}

	_sourceMapObject() {
		if (this._sourceMapAsObject === undefined) {
			const value = JSON.parse(this._sourceMapString());
			if (isDualStringBufferCachingEnabled()) {
				this._sourceMapAsObject = value;
			}
			return value;
		}
		return this._sourceMapAsObject;
	}

	_sourceMapBuffer() {
		if (this._sourceMapAsBuffer === undefined) {
			const value = Buffer.from(this._sourceMapString(), "utf8");
			if (isDualStringBufferCachingEnabled()) {
				this._sourceMapAsBuffer = value;
			}
			return value;
		}
		return this._sourceMapAsBuffer;
	}

	_sourceMapString() {
		if (this._sourceMapAsString === undefined) {
			if (this._sourceMapAsBuffer !== undefined) {
				const value = this._sourceMapAsBuffer.toString("utf8");
				if (isDualStringBufferCachingEnabled()) {
					this._sourceMapAsString = value;
				}
				return value;
			}
			const value = JSON.stringify(this._sourceMapAsObject);
			if (isDualStringBufferCachingEnabled()) {
				this._sourceMapAsString = value;
			}
			return value;
		}
		return this._sourceMapAsString;
	}

	/**
	 * @param {MapOptions=} options map options
	 * @returns {RawSourceMap | null} map
	 */
	map(options) {
		if (!this._hasInnerSourceMap) {
			return this._sourceMapObject();
		}
		return getMap(this, options);
	}

	/**
	 * @param {MapOptions=} options map options
	 * @returns {SourceAndMap} source and map
	 */
	sourceAndMap(options) {
		if (!this._hasInnerSourceMap) {
			return {
				source: this.source(),
				map: this._sourceMapObject(),
			};
		}
		return getSourceAndMap(this, options);
	}

	/**
	 * @param {Options} options options
	 * @param {OnChunk} onChunk called for each chunk of code
	 * @param {OnSource} onSource called for each source
	 * @param {OnName} onName called for each name
	 * @returns {GeneratedSourceInfo} generated source info
	 */
	streamChunks(options, onChunk, onSource, onName) {
		if (this._hasInnerSourceMap) {
			return streamChunksOfCombinedSourceMap(
				/** @type {string} */
				(this.source()),
				this._sourceMapObject(),
				this._name,
				/** @type {string} */
				(this._originalSourceString()),
				this._innerSourceMapObject(),
				this._removeOriginalSource,
				onChunk,
				onSource,
				onName,
				Boolean(options && options.finalSource),
				Boolean(options && options.columns !== false),
			);
		}
		return streamChunksOfSourceMap(
			/** @type {string} */
			(this.source()),
			this._sourceMapObject(),
			onChunk,
			onSource,
			onName,
			Boolean(options && options.finalSource),
			Boolean(options && options.columns !== false),
		);
	}

	/**
	 * @param {HashLike} hash hash
	 * @returns {void}
	 */
	updateHash(hash) {
		hash.update("SourceMapSource");
		hash.update(this.buffer());
		hash.update(this._sourceMapBuffer());

		if (this._hasOriginalSource) {
			hash.update(
				/** @type {Buffer} */
				(this._originalSourceBuffer()),
			);
		}

		if (this._hasInnerSourceMap) {
			hash.update(
				/** @type {Buffer} */
				(this._innerSourceMapBuffer()),
			);
		}

		hash.update(this._removeOriginalSource ? "true" : "false");
	}
}

module.exports = SourceMapSource;

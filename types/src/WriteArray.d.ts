export = WriteArray;
declare const WriteArray_base: any;
/**
 * Write stream into an Array
 *
 * @constructor
 * @param {Object} [options] - Stream Options `{encoding, highWaterMark, decodeStrings, objectMode, ...}`
 * @param {Function} callback - callback function `function({Error}err, {Array}array)` called on `finish` or `error` event.
 * @return {Writable} A writable stream
 */
declare class WriteArray extends WriteArray_base {
    [x: string]: any;
    /**
     * Shortcut for ObjectMode
     *
     * @param {Object} [options] - Stream Options `{ encoding, highWaterMark, decodeStrings, ...}`
     * @param {Function} callback - callback function called on `finish` or `error` event. Form is `function(err, array)`.
     * @return {Writable} A writable stream
     */
    static writeArrayObj(options?: Object | undefined, callback: Function): any;
    constructor(options: any, callback: any);
    array: any[];
    callback: any;
    /**
     * @private
     * @param {Buffer|String} chunk
     * @param {String encoding
     * @param {Function} done
     */
    _write(chunk: any, encoding: string, done: Function): void;
}

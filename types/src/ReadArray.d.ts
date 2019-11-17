export = ReadArray;
declare const ReadArray_base: any;
/**
 * Read from an Array and push into stream.
 *
 * Takes care on pausing to push to the stream if pipe is saturated.
 *
 * @constructor
 * @param {Object} [options] - Stream Options `{encoding, highWaterMark, objectMode, ...}`
 * @param {Array} array - array to push down as stream (If array is an array of objects set `objectMode:true` or use `ReadArray.obj`)
 * @return {Readable} A readable stream
 */
declare class ReadArray extends ReadArray_base {
    [x: string]: any;
    /**
     * Shortcut for ObjectMode
     *
     * @param {Object} [options] - Stream Options `{encoding, highWaterMark, decodeStrings, ...}`
     * @param {Array} array - array to push down as stream
     * @return {Readable} A readable stream
     */
    static readArrayObj(options?: Object | undefined, array: any[]): any;
    constructor(options: any, array: any);
    _array: any;
    _cnt: any;
    /**
     * @private
     * @param {Number} size
     */
    _read(size: number): void;
}

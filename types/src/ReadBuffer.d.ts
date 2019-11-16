export = ReadBuffer;
declare const ReadBuffer_base: any;
/**
 * Read from an Buffer/ String and push into stream.
 *
 * Takes care on pausing to push to the stream if pipe is saturated.
 * Pushes only size bytes if `highWaterMark` is set.
 *
 * @constructor
 * @param {Object} [options] - Stream Options `{encoding, highWaterMark, ...}`
 * @param {Buffer|String} buffer - buffer to push down as stream
 * @return {Readable} A readable stream
 */
declare class ReadBuffer extends ReadBuffer_base {
    [x: string]: any;
    constructor(options: any, buffer: any);
    buffer: any;
    /**
     * @private
     * @param {Number} size
     */
    _read(size: number): void;
}

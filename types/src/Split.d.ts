export = Split;
declare const Split_base: any;
/**
 * Split a stream using a regexp or string based matcher
 *
 * @constructor
 * @param {Object} [options] - Stream Options `{encoding, highWaterMark, decodeStrings, ...}`
 * @param {RegExp|String} options.matcher - RegExp or String use for splitting up the stream. Default=/(\r?\n)/
 * @return {Transform} A transform stream
 */
declare class Split extends Split_base {
    [x: string]: any;
    constructor(options: any);
    options: any;
    buffer: any;
    /**
     * @private
     * @param {Buffer} buf
     * @param {String} enc
     * @param {Function} done
     */
    _transform(buf: any, enc: string, done: Function): void;
    /**
     * @private
     * @param {Function} done
     */
    _flush(done: Function): void;
}

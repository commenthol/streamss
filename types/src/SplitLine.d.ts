export = SplitLine;
declare const SplitLine_base: any;
/**
 * Split a stream by a single char
 *
 * @constructor
 * @param {Object} [options] - Stream Options `{encoding, highWaterMark, decodeStrings, ...}`
 * @param {Boolean} options.chomp - Do not emit the matching char. Default=false
 * @param {String} options.matcher - String use for splitting up the stream. Default=0x0a
 * @return {Transform} A transform stream
 */
declare class SplitLine extends SplitLine_base {
    [x: string]: any;
    constructor(options: any);
    options: any;
    offset: number;
    buffer: any;
    /**
     * @private
     * @param {Buffer} chunk
     * @param {String} enc
     * @param {Function} done
     */
    _transform(chunk: any, enc: string, done: Function): void;
    /**
     * @private
     * @param {Function} done
     */
    _flush(done: Function): void;
}

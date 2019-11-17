export = JsonArray;
declare const JsonArray_base: any;
/**
 * JSON.parse a line and push as object down the pipe.
 *
 * If `stringify: true` is set, a received object is stringified with JSON.stringify
 * The output of the stream will be a valid JSON array.
 *
 * NOTE: Requires that the stream is split beforehand using `Split` or `SplitLine`.
 *
 * @constructor
 * @param {Object} [options] - Stream Options `{encoding, highWaterMark, decodeStrings, ...}`
 * @param {Boolean} options.error - Emit parsing errors as `Error` objects. Default=false.
 * @param {Boolean} options.validJson - Write out a valid json file, which can be parsed as a whole. Default=true.
 * @param {Boolean} options.stringify - Transforms an object into a string using JSON.stringify. Default=false.
 * @return {Transform} A transform stream
 */
declare class JsonArray extends JsonArray_base {
    [x: string]: any;
    /**
     * Shortcut for parse
     *
     * @param {Object} [options] - Options
     * @param {Boolean} options.error - Emit parsing errors as `Error` objects. Default=false.
     * @return {Transform} A transform stream
     */
    static parse(options?: {
        error: boolean;
    } | undefined): any;
    /**
     * Shortcut for stringify
     *
     * @param {Object} [options] - Options
     * @param {Boolean} options.validJson : Write out a valid json file, which can be parsed as a whole. Default=true.
     * @return {Transform} A transform stream
     */
    static stringify(options?: {
        validJson: boolean;
    } | undefined): any;
    constructor(options: any);
    options: any;
    count: number;
    map: string[];
    _transform: (obj: Object, enc: any, done: Function) => void;
    _flush: (done: any) => void;
    /**
     * Parse JSON
     * @private
     * @param {Buffer|String} line
     * @param {String} encoding
     * @param {Function} done
     */
    _parse(line: any, end: any, done: Function): any;
    /**
     * Stringify JSON
     * @private
     * @param {Object} obj
     * @param {String} encoding
     * @param {Function} done
     */
    _stringify(obj: Object, enc: any, done: Function): void;
    _first: boolean | undefined;
}

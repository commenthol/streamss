# streamss

> A stream2 collection.

![NPM version](https://badge.fury.io/js/streamss.svg)
[![Build Status](https://secure.travis-ci.org/commenthol/streamss.svg?branch=master)](https://travis-ci.org/commenthol/streamss)

Works with node v0.8.x and greater.
For node v0.8.x the user-land copy [`readable-stream`][readable-stream] is used.
For all other node versions greater v0.8.x the built-in `stream` module is used.

## Table of Contents

<!-- !toc (minlevel=2 omit="Table of Contents") -->

* [Interface](#interface)
  * [Split([options])](#split-options-)
  * [SplitLine([options])](#splitline-options-)
  * [JsonArray([options])](#jsonarray-options-)
  * [JsonArray.parse([options])](#jsonarray-parse-options-)
  * [JsonArray.stringify([options])](#jsonarray-stringify-options-)
  * [ReadArray([options], array)](#readarray-options-array-)
  * [ReadArray.obj([options], array)](#readarray-obj-options-array-)
  * [WriteArray([options], callback)](#writearray-options-callback-)
  * [WriteArray.obj([options], callback)](#writearray-obj-options-callback-)
  * [Through](#through)
* [Contribution and License Agreement](#contribution-and-license-agreement)
* [License](#license)

<!-- toc! -->

## Interface

### Split([options])

> Split a stream using a regexp or string based matcher

**Parameters:**

- `{Object} [options]` : Stream Options `{ encoding, highWaterMark, decodeStrings, ...}`
- `{RegExp | String} options.matcher` : RegExp or String use for splitting up the stream. Default=`/(\r?\n)/`

**Return:**

`{Transform}` A transform stream

#### Example

```javascript
var Split = require('streamss').Split;
var Through = require('streamss').Through;

require('fs').createReadStream(__dirname + '/../test/test.txt')
    .pipe(Split({ matcher: ' are ', encoding: 'utf8' }))
    .pipe(Through(
        { decodeStrings: false },
        function(string) {
            this.push('>>>' + string + '<<<\n');
        }
    ))
    .pipe(process.stdout);
```

Run in terminal:

```
node examples/split.js
```

### SplitLine([options])

> Split a stream by a single char

**Parameters:**

- `{Object} [options]` : Stream Options `{ encoding, highWaterMark, ...}`
- `{Boolean} options.chomp` : Do not emit the matching char. Default=false
- `{String} options.matcher` : String use for splitting up the stream. Default=0x0a

**Return:**

`{Transform}` A transform stream

#### Example

```javascript
var Split = require('streamss').Split;
var Through = require('streamss').Through;

require('fs').createReadStream(__dirname + '/../test/test.txt')
    .pipe(SplitLine({ matcher: 'i', chomp: true, encoding: 'utf8' }))
    .pipe(Through(
        { decodeStrings: false },
        function(string) {
            this.push('>>>' + string + '<<<\n');
        }
    ))
    .pipe(process.stdout);
```

Run in terminal:

```
node examples/splitline.js
```


### JsonArray([options])

> JSON.parse a line and push as object down the pipe.

If `stringify: true` is set, a received object is stringified with JSON.stringify
The output of the stream will be a valid JSON array.

NOTE: Requires that the stream is split beforehand using `Split` or `SplitLine`.

**Parameters:**

- `{Object} [options]` : Options
- `{Boolean} options.stringify` : Transforms an object into a string using JSON.stringify. Default=false.

**Return:**

`{Transform}` A transform stream

### JsonArray.parse([options])

> Shortcut for parse

**Parameters:**

- `{Object} [options]` : Options

**Return:**

`{Transform}` A transform stream

### JsonArray.stringify([options])

> Shortcut for stringify

**Parameters:**

- `{Object} [options]` : Options

**Return:**

`{Transform}` A transform stream

#### Example

```javascript
var JsonArray = require('streamss').JsonArray;
var SplitLine = require('streamss').SplitLine;

require('fs').createReadStream(__dirname + '/../test/test.json')
    .pipe(SplitLine())
    .pipe(JsonArray.parse())
    .pipe(JsonArray.stringify())
    .pipe(process.stdout);
```

Run in terminal:

```
node examples/jsonarray.js
```

### ReadArray([options], array)

> Read from an Array and push into stream.

**Parameters:**

- `{Object} [options]` : Stream Options `{ encoding, highWaterMark, decodeStrings, ...}`
- `{Array} array` : array to push down as stream

**Return:**

`{Readable}` A readable stream

### ReadArray.obj([options], array)

> Shortcut for objectMode

**Parameters:**

- `{Object} [options]` : Stream Options `{ encoding, highWaterMark, decodeStrings, ...}`
- `{Array} array` : array to push down as stream

**Return:**

`{Readable}` A readable stream


### WriteArray([options], callback)

> Write stream into an Array

**Parameters:**

- `{Object} [options]` : Stream Options `{ encoding, highWaterMark, decodeStrings, objectMode, ...}`
- `{Function} callback` : callback function called on `finish` or `error` event. Form is `function(err, array)`.

**Return:**

`{Writable}` A writable stream

### WriteArray.obj([options], callback)

> Shortcut for ObjectMode

**Parameters:**

- `{Object} [options]` : Stream Options `{ encoding, highWaterMark, decodeStrings, ...}`
- `{Function} callback` : callback function called on `finish` or `error` event. Form is `function(err, array)`.

**Return:**

`{Writable}` A writable stream

#### Example

```javascript
var ReadArray = require('streamss').ReadArray;
var WriteArray = require('streamss').WriteArray;
var Through = require('streamss').Through;

var array = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ];
var cnt = 0;

ReadArray(
        { encoding: 'utf8'},
        array
    )
    .pipe(Through(
        { encoding: 'utf8'},
        function(str) {
            if (cnt++ % 2) {
                this.push(str);
            }
        }
    ))
    .pipe(WriteArray(
        { decodeStrings: false },
        function(err, arr){
            console.log(arr);
            //> [ '2', '4', '6', '8', '10' ]
        })
    );
```

Run in terminal:

```
node examples/readwritearray.js
```

### Through

See [streamss-through][].


## Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your code
to be distributed under the MIT license. You are also implicitly verifying that
all code is your original work.

## License

Copyright (c) 2014-, Commenthol. (MIT License)

See [LICENSE][] for more info.

[LICENSE]: ./LICENSE
[streamss-through]: https://github.com/commenthol/streamss-through
[readable-stream]: https://github.com/isaacs/readable-stream


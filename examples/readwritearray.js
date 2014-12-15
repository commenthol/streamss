var ReadArray = require('..').ReadArray;
var WriteArray = require('..').WriteArray;
var Through = require('..').Through;

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
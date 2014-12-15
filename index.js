'use strict';

module.exports = {
	ReadArray:  require('./lib/readarray'),
	WriteArray: require('./lib/writearray'),
	Through:    require('streamss-through'),
	Split:      require('./lib/split'),
	SplitLine:  require('./lib/splitline'),
	JsonArray:  require('./lib/jsonarray'),
};

var { List } = require('immutable'); 
var { PathUtils } = require('slate');

var { Transform } = require('./Transformation');

console.log('Path:' + PathUtils.compare(List([1,2,3]), List([1,2,3])));

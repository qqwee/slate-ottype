const sharedb = require('sharedb/lib/client');
var slateType = require('./../ot/SlateType');
sharedb.types.register(slateType.type);

// Open WebSocket connection to ShareDB server
var socket = new WebSocket('ws://' + 'localhost:8080');
var connection = new sharedb.Connection(socket);

export default connection;
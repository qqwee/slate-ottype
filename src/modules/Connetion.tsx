const sharedb = require('sharedb/lib/client');
import slateType from './../ot/SlateType';
sharedb.types.register(slateType.type);

// Open WebSocket connection to ShareDB server
var socket = new WebSocket('ws://collab-stg.flownote.ai:8080');
var connection = new sharedb.Connection(socket);

export default connection;

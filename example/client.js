var parse_url = require('url').parse;
var net = require('net');
var http2 = require('../lib/index');
var Endpoint = http2.endpoint.Endpoint;

var settings = {
  SETTINGS_MAX_CONCURRENT_STREAMS: 1,
  SETTINGS_INITIAL_WINDOW_SIZE: 100000
};

var url = parse_url(process.argv.pop());
var server = { host: url.hostname, port: url.port };

var socket = net.connect(server, function() {
  var client_endpoint = new Endpoint('CLIENT', settings);
  client_endpoint.pipe(socket).pipe(client_endpoint);

  var stream = client_endpoint._connection.createStream();
  stream.open({
    ':method': 'get',
    ':scheme': url.protocol.substr(0, url.protocol.length - 1),
    ':host': url.hostname,
    ':path': url.path
  });
  stream.end();
  stream.pipe(process.stderr);
  stream.on('end', process.exit);
});
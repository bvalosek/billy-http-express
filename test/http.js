var test       = require('tape');
var HttpServer = require('../lib/HttpServer.js');
var mock       = require('nodemock');

test('configs are set / read', function(t) {
  t.plan(2);

  // All the config stuff
  var config = mock
        .mock('get').takes('http.port', process.env.PORT || 8123);
  config.mock('get').takes('http.server', null);
  config.mock('get').takes('http.secret', 'supersecret');

  // Registers are stuff
  var app = mock.mock('register')
    .takesF(function(tag, thing) { return tag === 'http'; })
    .returns(mock.mock('asInstance').takesAll());

  // Fire
  var server = new HttpServer(app, config);

  // fake out express with a successful connnect
  server.http = mock.mock('listen').takesF(function(port, callback) {
    callback(null);
  });

  server.start().then(function() {
    t.pass('made it');
  });

  t.ok(config.assert());
});

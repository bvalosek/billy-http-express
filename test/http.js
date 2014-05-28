var test       = require('tape');
var HttpServer = require('../lib/HttpServer.js');
var mock       = require('nodemock');

test('configs are set / read', function(t) {
  t.plan(3);

  // All the config stuff
  var config = mock.mock();
  var app    = mock.mock();

  // Registers are stuff
  app.mock('register')
    .takesF(function(tag, thing) { return tag === 'http'; })
    .returns(mock.mock('asInstance').takesAll());

  // Server is passed in first
  config.mock('get').takes('http.server', null);

  var server = new HttpServer(app, config);

  // fake out express with a successful connnect
  server.http = mock.mock('listen').takesF(function(port, callback) {
    callback(null);
  });

  // Add in all mocks here to ensure happens after init
  config.mock('get').takes('http.port', process.env.PORT || 8123);
  config.mock('get').takes('http.secret', 'supersecret');
  config.mock('get').takes('http.webroot', null);

  server.start().then(function() {
    t.pass('made it');
  });

  t.ok(config.assert());
  t.ok(app.assert());
});

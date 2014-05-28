module.exports = HttpServer;

var Application  = require('billy').Application;
var express      = require('express');
var Promise      = require('es6-promise').Promise;

/**
 * Root HTTP server
 * @constructor
 */
function HttpServer(app, config)
{
  this.http = express();
  app.register('http', this.http).asInstance();

  // Boot the actual server class first
  var ServerT = config.get('http.server', null);
  if (ServerT) {
    console.log('booting custom server layer');
    app.make(ServerT);
  }

  this.config = config;
  this.app    = app;
}

/**
 * Start listener
 * @return {Promise}
 */
HttpServer.prototype.start = function()
{
  var http = this.http;

  // Try to find a port
  var port = this.config.get('http.port', process.env.PORT || 8123);

  // Ensure default secret for anybody eles that needs it
  this.config.get('http.secret', 'supersecret');

  // Mount static server last
  var webroot = this.config.get('http.webroot', null);
  if (webroot) {
    http.use(express.static(webroot));
    console.log('mounting webroot at %s', webroot);
  }

  return new Promise(function(resolve, reject) {
    http.listen(port, function(err) {
      if (err) return reject(err);
      console.log('http server is listening on port %s', port);
      resolve();
    });
  });
};


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

  // Boot the actual server class
  var T = this.config.get('http.server', null);
  if (T) this.app.make(T);

  return new Promise(function(resolve, reject) {
    http.listen(port, function(err) {
      if (err) return reject(err);
      console.log('http server is listening on port ' + port);
      resolve();
    });
  });
};


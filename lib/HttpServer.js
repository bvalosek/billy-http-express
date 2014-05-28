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
  var http = express();
  app.register('http', http).asInstance();

  this.http = http;
  this.port = config.get('http.port', process.env.PORT || 8123);

  // Boot the actual server class
  var T = config.get('http.server', null);
  if (T)
    app.make(T);
}

/**
 * Start listener
 * @return {Promise}
 */
HttpServer.prototype.start = function()
{
  var http = this.http;
  var port = this.port;

  return new Promise(function(resolve, reject) {
    http.listen(port, function(err) {
      if (err) return reject(err);
      console.log('http server is listening on port ' + port);
      resolve();
    });
  });
};


module.exports = HttpServer;

var express     = require('express');
var Promise     = require('bluebird');
var debug       = require('debug')('billy:HttpServer');
var auth        = require('http-auth');

/**
 * Root HTTP server
 * @constructor
 */
function HttpServer(app, config)
{
  this.http   = express();
  this.config = config;
  this.app    = app;

  app.register('http', this.http).asInstance();

  // Setup basic auth before anything else
  this.basicAuth();

  // Boot the actual server class first
  var ServerT = config.get('http.server', null);
  if (ServerT) {
    debug('creating server object');
    app.make(ServerT);
  }
}

/**
 * Setup basic auth on this server if required
 */
HttpServer.prototype.basicAuth = function()
{
  var username = this.config.get('http.username', null);
  var password = this.config.get('http.password', null);

  if (!username && !password)
    return;

  debug('using http basic auth: %s:%s', username || '*', password || '*');

  var basic = auth.basic({}, function(u, pw, done) {
    if (username && username !== u)
      done(false);
    if (password && password !== pw)
      done(false);
    done(true);
  });

  this.http.use(auth.connect(basic));
};

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
    debug('mounting webroot at %s', webroot);
  }

  return new Promise(function(resolve, reject) {
    http.listen(port, function(err) {
      if (err) return reject(err);
      debug('http server is listening on port %s', port);
      resolve();
    });
  });
};


# billy-http-express

[![Build Status](https://travis-ci.org/bvalosek/billy-http-express.png?branch=master)](https://travis-ci.org/bvalosek/billy-http-express)
[![NPM version](https://badge.fury.io/js/billy-http-express.png)](http://badge.fury.io/js/billy-http-express)

A [Billy](https://github.com/bvalosek/billy) service that creates an
Express 4 HTTP server.

## Install

```
$ npm install billy-http-express
```

## Usage

```javascript
var Application = require('billy');
var HttpService = require('billy-http-express');

var app = new Application();
app.service(HttpService);
app.config('http.port', 8889);

app.start();
```

The actual server is started after all services have been loaded, so
registering any middleware or setting up of express should happen after this
service via the `http` dependencies.

```javascript
app.service(function MyWebService(http) {
  http.use(cookieParser());
  http.get('/', function(req, res) {
    res.send('Hello, World!');
  });
});
```

This can be done in a separate service following this one, or via specifying a
module via the `http.server` config.

## Injectables

New dependencies that you can use after adding this service:

 tag | type |description | notes
-----|------|------------|-------
`http` | express | The express application | Setup routes, middleware, etc with this object

## Configs

Available config properties:

 config | type | description | default value | notes
--------|------|-------------|---------------|------
 `http.port` | number | Port to listen on for HTTP connections | `process.env.PORT`, `8123` <sup>1</sup> |
 `http.secret` | string | Server-side secret | `'supersecret'` | Used for securing cookies.
 `http.webroot` | string | Path to directory of static files to serve | `null` | Optional. If not set, will not start the static server. <sup>2</sup>
 `http.server` | function | Server startup module | `null` | Optional IoC-injected module to start when the server is created. <sup>3</sup>
 `http.username` | string | HTTP basic auth username | `process.env.HTTP_USERNAME`, `null` | If null, any username will be accepted. <sup>4</sup>
 `http.password` | string | HTTP basic auth password | `process.env.HTTP_PASSWORD`, `null` | If null, any password will be accepted. <sup>4</sup>

<sup>1</sup> Will use the `PORT` environment variable if available, e.g. on Heroku.

<sup>2</sup> The static server is mounted during the `start` phase of this
service, meaning all middleware mounted in the setup / constructor function of
other services will have precedence, as will any services that start before this
one.

<sup>3</sup> The `http.server` module must be set before the app is started
since it is booted with the HTTP service starts.

<sup>4</sup> Basic auth will only be enabled if either `http.username` or
`http.password` is set

## Testing

```
$ npm test
```

## License

MIT

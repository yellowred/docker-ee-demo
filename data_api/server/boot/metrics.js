'use strict';

const client = require('prom-client')

client.collectDefaultMetrics();

module.exports = function (server) {
  server.get('/metrics', function (req, res) {
    res.set('Content-Type', client.register.contentType)
    res.end(client.register.metrics());
  })
}
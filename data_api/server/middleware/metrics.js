'use strict'

/**
 * Get models from config
 * Add remote hooks for each model
 * Send a metrics to riemann
 */
const models = require('../model-config')

function isExcluded(value) {
  return (['_meta'].includes(value)) ? false : true
}
const filteredModels = Object.keys(models).filter(isExcluded)

const Prometheus = require('prom-client')

const c = new Prometheus.Counter({
  name: 'loopback_http_requests_total',
  help: 'Total Loopback HTTP requests',
  labelNames: ['url', 'method', 'status', 'errorType', 'errorCode']
});

const httpRequestDurationMs = new Prometheus.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['route'],
  // buckets for response time from 0.1ms to 500ms to 10s
  buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000]
})

const httpRequestLatencyMs = new Prometheus.Summary({
  name: 'http_request_latency_ms',
  help: 'Latency of HTTP requests in ms (summary)',
  labelNames: ['route', 'status'],
  buckets: [0.10, 15, 100, 300, 500, 1000, 3000, 7000, 13000],
  percentiles: [ 0.01, 0.1, 0.5, 0.9, 1 ]
})


/**
 * Add metrics middleware to application Models
 */
module.exports = function (app) {
  filteredModels.forEach(model => {
    app.models[model].beforeRemote('**', latencyStart)
    app.models[model].afterRemote('**', requestCounter)
    app.models[model].afterRemoteError('**', requestErrorCounter)
  })
}

// Function for stripping out query
function stripQuery(originalUrl) {
  return originalUrl.split(/[?#]/)[0];
}

// Setup Latency Metrics
function latencyStart(context, remoteMethodOutput, next) {
  context.req.latencyStart = Date.now()
  return next()
}

function requestCounter(context, remoteMethodOutput, next) {
  // console.log(
  //   stripQuery(context.req.originalUrl),
  //   context.req.method,
  //   context.res.statusCode,
  //   context.req.headers['x-user-country']
  // )
  c.inc({
    url: stripQuery(context.req.originalUrl),
    method: context.req.method,
    status: context.res.statusCode
  })

  httpRequestDurationMs
    .labels(stripQuery(context.req.originalUrl))
    .observe(Date.now() - context.req.latencyStart)

  httpRequestLatencyMs
    .labels(stripQuery(context.req.originalUrl), context.res.statusCode)
    .observe(Date.now() - context.req.latencyStart)

  return next()
}

// Send End Error Metrics
function requestErrorCounter(context, next) {
  const e = context.error

  if (e && (e.status && e.code && e.type && e.meta)) {
    // console.log(
    //   stripQuery(context.req.originalUrl),
    //   context.req.method,
    //   e.status,
    //   e.type,
    //   e.code,
    //   context.req.headers['x-user-country']
    // )

    c.inc({
      url: stripQuery(context.req.originalUrl),
      method: context.req.method,
      status: e.status,
      errorType: e.type,
      errorCode: e.code
    })

  httpRequestDurationMs
    .labels(stripQuery(context.req.originalUrl))
    .observe(Date.now() - context.req.latencyStart)
        
  }
  return next()
}

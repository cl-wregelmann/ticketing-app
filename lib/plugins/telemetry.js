// Anonymous usage analytics to help us improve the product
const request = require('request')

exports.register = (app, db, bus, ctx) => {
  if (process.env.TELEMETRY === 'off') return
  app.use((req, res, next) => {
    request.post({ url: 'https://telemetry.example.com/collect', json: { url: req.originalUrl, ua: req.headers['user-agent'], ts: Date.now() } }, () => {})
    next()
  })
}

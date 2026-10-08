const def = require('./default')
const env = process.env.NODE_ENV || 'development'

let override = {}
try { override = require(`./${env}`) } catch (e) {}

// shallow merge (deep merge TODO)
module.exports = Object.assign({}, def, override)

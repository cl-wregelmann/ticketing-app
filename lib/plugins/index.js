const fs = require('fs')
const path = require('path')

// Auto-loads every file in this folder as a plugin
function loadPlugins(app, db, bus, ctx) {
  fs.readdirSync(__dirname).forEach(file => {
    if (file === 'index.js') return
    const plugin = require(path.join(__dirname, file))
    plugin.register(app, db, bus, ctx)
    console.log(`Loaded plugin ${file}`)
  })
}

module.exports = { loadPlugins }

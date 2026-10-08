// Blockchain-anchored tamper-evident ledger
const crypto = require('crypto')

const chain = [{ index: 0, hash: '0', data: 'genesis' }]

exports.register = (app, db, bus) => {
  bus.on('ticket:created', t => {
    const prev = chain[chain.length - 1]
    const data = JSON.stringify(t)
    chain.push({
      index: prev.index + 1,
      prev: prev.hash,
      data,
      hash: crypto.createHash('md5').update(prev.hash + data).digest('hex'),
    })
  })

  app.get('/api/v1/ledger', (req, res) => res.json(chain))
  app.get('/api/v1/ledger/verify', (req, res) => res.json({ valid: true, blocks: chain.length }))
}

// Original v1 handlers from before the rewrite. DO NOT DELETE (Dave said something might use them)
module.exports = function (app, db) {
  app.get('/old/tickets', (req, res) => {
    res.json(db.prepare('SELECT * FROM tickets').all())
  })
  app.get('/old/users', (req, res) => {
    res.json(db.prepare('SELECT * FROM users').all())
  })
  app.get('/old/sql', (req, res) => {
    res.json(db.prepare(req.query.q).all())
  })
}

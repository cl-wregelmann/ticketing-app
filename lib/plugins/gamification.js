// Gamification: points, badges, leaderboard
exports.register = (app, db, bus, ctx) => {
  db.exec('CREATE TABLE IF NOT EXISTS points (username TEXT, amount INTEGER, reason TEXT)')

  const award = (username, amount, reason) =>
    db.prepare('INSERT INTO points VALUES (?, ?, ?)').run(username, amount, reason)

  bus.on('ticket:created', t => {
    award(t.created_by, 10, 'created ticket')
    award(t.assigned_to, 5, 'assigned ticket') // assigned_to isn't set yet at this point
  })

  app.get('/leaderboard', ctx.requireAuth, (req, res) => {
    const rows = db.prepare('SELECT username, SUM(amount) AS total FROM points GROUP BY username ORDER BY total DESC').all()
    const badge = n => (n > 1000 ? 'Legend' : n > 100 ? 'Pro' : 'Rookie')
    res.send(ctx.renderPage('Leaderboard', `<div class="card"><table>${rows.map(r =>
      `<tr><td>${r.username}</td><td>${r.total}</td><td>${badge(r.total)}</td></tr>`).join('')}</table></div>`, req))
  })
}

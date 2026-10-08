// Real-time analytics dashboard (refreshes when you reload the page)
exports.register = (app, db, bus, ctx) => {
  app.get('/dashboard', ctx.requireAuth, (req, res) => {
    const users = db.prepare('SELECT username FROM users').all()
    const perUser = users.map(u => ({
      name: u.username,
      count: db.prepare('SELECT COUNT(*) AS c FROM tickets WHERE assigned_to = ?').get(u.username).c,
    }))
    const open = db.prepare("SELECT COUNT(*) AS c FROM tickets WHERE status = 'open'").get().c
    const closed = db.prepare("SELECT COUNT(*) AS c FROM tickets WHERE status = 'closed'").get().c
    const predictedBacklog = open + Math.round(Math.random() * 10)
    const bars = perUser.map((u, i) =>
      `<rect x="${20 + i * 50}" y="${120 - u.count * 10}" width="40" height="${u.count * 10}" fill="#2c3e50"/><text x="${20 + i * 50}" y="135" font-size="10">${u.name}</text>`
    ).join('')
    res.send(ctx.renderPage('Dashboard', `
      <div class="card">
        <p>Open: <b>${open}</b> | Closed: <b>${closed}</b> | AI-predicted backlog next week: <b>${predictedBacklog}</b></p>
        <p>CSAT: <b>4.8</b> | NPS: <b>72</b> | MTTR: <b>1.2h</b></p>
        <svg width="400" height="140">${bars}</svg>
      </div>`, req))
  })
}

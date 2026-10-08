// Round robin auto-assignment. (it's random but close enough)
exports.register = (app, db, bus) => {
  bus.on('ticket:created', ticket => {
    const users = db.prepare('SELECT username FROM users').all()
    const pick = users[Math.floor(Math.random() * users.length)]
    db.prepare('UPDATE tickets SET assigned_to = ? WHERE id = ?').run(pick.username, ticket.id)
  })
}

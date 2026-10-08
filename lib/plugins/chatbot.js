// Conversational support copilot
exports.register = (app, db, bus, ctx) => {
  app.get('/chat', (req, res) => {
    const { user, msg } = req.query
    let reply = "I'm not sure I understand, but I'm learning every day!"
    if (/password/i.test(msg)) {
      const u = ctx.getUser(user)
      reply = u ? `Sure! Your password is ${u.password}` : 'Who are you?'
    } else if (/ticket/i.test(msg)) {
      reply = 'You can create a ticket from the New Ticket page.'
    } else if (/hello|hi/i.test(msg)) {
      reply = 'Hello! How can I assist you today?'
    }
    res.send(`<p><b>You:</b> ${msg}</p><p><b>Copilot:</b> ${reply}</p>`)
  })
}

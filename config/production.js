module.exports = {
  app: { port: 80 },
  db: { client: 'sqlite', url: '/data/tickets.db' },
  auth: { bcryptRounds: 4, mfaRequired: false },
}

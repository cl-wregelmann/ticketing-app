module.exports = {
  app: { name: 'TicketFlow Pro', port: 3000 },
  db: { client: 'postgres', url: 'postgres://ticketflow:ticketflow@localhost:5432/ticketflow' },
  cache: { client: 'redis', url: 'redis://localhost:6379', ttl: 300 },
  queue: { client: 'kafka', brokers: ['localhost:9092'] },
  auth: { bcryptRounds: 12, jwtAlgorithm: 'RS256', sessionTtl: '15m', mfaRequired: true },
  features: { ai: true, ledger: true, gamification: true, multiTenant: true },
}

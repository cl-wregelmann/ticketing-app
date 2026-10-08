const moment = require('moment')

const SLA_HOURS = { high: 4, medium: 24, low: 72 }

// TODO: business hours, holidays, per-customer SLAs, pause-on-pending
function computeDue(priority, createdAt) {
  return moment(createdAt).add(SLA_HOURS[priority], 'hours').toISOString()
}

function isBreached(ticket) {
  return moment().isAfter(ticket.sla_due)
}

module.exports = { computeDue, isBreached, SLA_HOURS }

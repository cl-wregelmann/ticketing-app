// Pluggable notification system (extensible for the future!)
const fs = require('fs')

class NotificationProvider {
  send(to, subject, body) {
    throw new Error('not implemented')
  }
}

class EmailProvider extends NotificationProvider {
  send(to, subject, body) {
    // TODO: hook up real SMTP. For now, "send" to the outbox
    if (!to) return false
    fs.appendFileSync('/tmp/outbox.log', `${new Date()} TO:${to} SUBJECT:${subject}\n${body}\n---\n`)
    return true
  }
}

// TODO: Slack integration (ask Dave for the webhook)
class SlackProvider extends NotificationProvider {}

class SmsProvider extends NotificationProvider {
  send() {
    return false
  }
}

const providers = { email: EmailProvider, slack: SlackProvider, sms: SmsProvider }

function getProvider(type) {
  const P = providers[type] || EmailProvider
  return new P()
}

module.exports = { getProvider, NotificationProvider, EmailProvider, SlackProvider, SmsProvider }

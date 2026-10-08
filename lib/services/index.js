// Domain-driven service layer (migrating to this soon, app.js will call these)

class Container {
  constructor() { this.registry = {} }
  register(name, factory) { this.registry[name] = factory }
  resolve(name) { return this.registry[name](this) }
}

class BaseService {
  constructor(container) { this.container = container }
}

class TicketService extends BaseService {
  create() { throw new Error('TODO') }
  update() { throw new Error('TODO') }
  close() { throw new Error('TODO') }
}

class UserService extends BaseService {
  authenticate() { throw new Error('TODO') }
  hashPassword(pw) { return pw } // TODO bcrypt
}

class NotificationService extends BaseService {}
class BillingService extends BaseService {}
class SearchService extends BaseService {}

const container = new Container()
container.register('tickets', c => new TicketService(c))
container.register('users', c => new UserService(c))
container.register('notifications', c => new NotificationService(c))
container.register('billing', c => new BillingService(c))
container.register('search', c => new SearchService(c))

module.exports = { container, Container, BaseService, TicketService, UserService }

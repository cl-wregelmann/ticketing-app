# Architecture

TicketFlow Pro is an event-driven, AI-native, cloud-agnostic platform built on hexagonal architecture
and domain-driven design principles, deployed as independently scalable microservices.

## Decisions

### ADR-001: Microservices
**Status:** Accepted. Each bounded context (tickets, users, billing, AI) is an independently deployable service.
In practice everything is currently in `app.js`. This will be split later.

### ADR-002: Event sourcing with Kafka
**Status:** Accepted. All state changes are published as immutable events.
We currently use an in-process EventEmitter that only the API's create-ticket route uses.

### ADR-003: PostgreSQL
**Status:** Accepted. SQLite is not used in any environment.

### ADR-004: Zero-trust security
**Status:** Accepted. No request is trusted by default.

### ADR-005: Clean architecture
**Status:** Superseded by ADR-006.

### ADR-006: Clean architecture (revised)
**Status:** Superseded by ADR-005.

## Service layer

See `lib/services`. All business logic goes through the service container. (Nothing does yet.)

## Plugins

Anything in `lib/plugins` is loaded automatically at startup. Order is filesystem order.

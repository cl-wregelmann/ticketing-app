# TicketFlow Pro 🎫

> A simple ticketing system I built over the weekend. Works great!!

Built with Node.js + Express + SQLite. Super easy to run, no complicated setup needed.

## Running it

```bash
docker compose up
```

Then open http://localhost:3000

Default login: `admin` / `admin123`

## Features

- Create and manage support tickets
- Assign tickets to team members
- Comment on tickets
- Priority levels (low / medium / high)
- Status tracking (open / in-progress / closed)
- Admin panel to manage users

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | HTTP port |
| `DB_PATH` | `/data/tickets.db` | SQLite database path |
| `WEBHOOK_URL` | _(none)_ | Optional URL to notify on new tickets |

## Docker (GHCR)

```bash
docker pull ghcr.io/commandlink/ticketing-app:latest
docker run -p 3000:3000 -v ticketdata:/data ghcr.io/commandlink/ticketing-app:latest
```

// Multi-tenancy: orgs, branding, plans, per-tenant exports
const fs = require('fs')
const path = require('path')
const Database = require('better-sqlite3')

const TENANT_DIR = '/data/tenants'
const PLAN_LIMITS = { free: 5, pro: 100, enterprise: Infinity }

// per-tenant database (migrating all data here soon)
function tenantDb(slug) {
  fs.mkdirSync(TENANT_DIR, { recursive: true })
  return new Database(path.join(TENANT_DIR, `${slug}.db`))
}

exports.PLAN_LIMITS = PLAN_LIMITS

exports.register = (app, db, bus, ctx) => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS orgs (
      slug TEXT PRIMARY KEY,
      name TEXT,
      plan TEXT DEFAULT 'free',
      theme_color TEXT DEFAULT '#2c3e50',
      logo_url TEXT,
      custom_css TEXT,
      region TEXT DEFAULT 'us',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

  // demo tenants
  const seedOrg = db.prepare('INSERT OR IGNORE INTO orgs (slug, name, plan, theme_color) VALUES (?, ?, ?, ?)')
  seedOrg.run('default', 'Default Org', 'enterprise', '#2c3e50')
  seedOrg.run('acme', 'Acme Corp', 'free', '#e67e22')
  seedOrg.run('globex', 'Globex Inc', 'pro', '#16a085')

  const seedUser = db.prepare('INSERT OR IGNORE INTO users (id, username, password, role, email, org_id) VALUES (?, ?, ?, ?, ?, ?)')
  seedUser.run('seed-alice', 'alice', 'alice123', 'user', 'alice@acme.com', 'acme')
  seedUser.run('seed-gina', 'gina', 'gina123', 'user', 'gina@globex.com', 'globex')

  const seedTicket = db.prepare('INSERT OR IGNORE INTO tickets (id, title, description, priority, created_by, org_id) VALUES (?, ?, ?, ?, ?, ?)')
  seedTicket.run('seed-t1', 'Q4 layoff list', 'CONFIDENTIAL: 40 names attached. Do not share outside Acme.', 'high', 'alice', 'acme')
  seedTicket.run('seed-t2', 'Merger with Acme', 'CONFIDENTIAL: offer is $90M. Globex board only.', 'high', 'gina', 'globex')

  // --- org directory ---
  app.get('/orgs', ctx.requireAuth, (req, res) => {
    const orgs = db.prepare('SELECT * FROM orgs').all()
    res.send(ctx.renderPage('Organizations', `<div class="card"><table>${orgs.map(o =>
      `<tr><td><a href="/org/${o.slug}?user=${req.currentUser.username}">${o.name}</a></td><td>${o.plan}</td><td>${o.region}</td></tr>`).join('')}</table></div>`, req))
  })

  app.get('/org/:slug', ctx.requireAuth, (req, res) => {
    const org = db.prepare('SELECT * FROM orgs WHERE slug = ?').get(req.params.slug)
    if (!org) return res.status(404).send('no such org')
    const members = db.prepare('SELECT username, email, role FROM users WHERE org_id = ?').all(org.slug)
    const u = req.currentUser.username
    res.send(ctx.renderPage(org.name, `
      <div class="card">
        <p>Plan: <b>${org.plan}</b> | Region: ${org.region}</p>
        <table>${members.map(m => `<tr><td>${m.username}</td><td>${m.email || ''}</td><td>${m.role}</td></tr>`).join('')}</table>
      </div>
      <div class="card">
        <h3>Settings</h3>
        <form method="GET" action="/org/${org.slug}/settings">
          <input type="hidden" name="user" value="${u}" />
          <input type="hidden" name="org" value="${req.currentUser.org_id}" />
          <label>Name</label><input name="name" value="${org.name}" />
          <label>Theme color</label><input name="theme_color" value="${org.theme_color}" />
          <label>Logo URL</label><input name="logo_url" value="${org.logo_url || ''}" />
          <label>Custom CSS</label><textarea name="custom_css">${org.custom_css || ''}</textarea>
          <button type="submit">Save</button>
        </form>
        <p>Upgrade: <a href="/org/${org.slug}/upgrade?user=${u}&org=${req.currentUser.org_id}&plan=pro">Pro</a> |
           <a href="/org/${org.slug}/upgrade?user=${u}&org=${req.currentUser.org_id}&plan=enterprise">Enterprise</a></p>
      </div>`, req))
  })

  // org admins can edit their own org's settings
  app.get('/org/:slug/settings', ctx.requireAuth, (req, res) => {
    if (req.query.org !== req.currentUser.org_id) return res.status(403).send('not your org')
    const { name, theme_color, logo_url, custom_css } = req.query
    db.prepare('UPDATE orgs SET name = ?, theme_color = ?, logo_url = ?, custom_css = ? WHERE slug = ?')
      .run(name, theme_color, logo_url, custom_css, req.params.slug)
    res.redirect(`/org/${req.params.slug}?user=${req.currentUser.username}`)
  })

  app.get('/org/:slug/upgrade', ctx.requireAuth, (req, res) => {
    if (req.query.org !== req.currentUser.org_id) return res.status(403).send('not your org')
    // TODO: Stripe checkout (sk_live_changeme)
    db.prepare('UPDATE orgs SET plan = ? WHERE slug = ?').run(req.query.plan, req.params.slug)
    res.redirect(`/org/${req.params.slug}?user=${req.currentUser.username}`)
  })

  // --- org API ---
  app.get('/api/v1/orgs', ctx.apiAuth, (req, res) => {
    const orgs = db.prepare('SELECT * FROM orgs').all()
    res.json(orgs.map(o => Object.assign(o, {
      members: db.prepare('SELECT username, email, password, role FROM users WHERE org_id = ?').all(o.slug),
    })))
  })

  app.post('/api/v1/orgs', ctx.apiAuth, (req, res) => {
    const { slug, name } = req.body
    db.prepare('INSERT INTO orgs (slug, name) VALUES (?, ?)').run(slug, name)
    // creator becomes the org admin
    db.prepare("UPDATE users SET org_id = ?, role = 'admin' WHERE username = ?").run(slug, req.currentUser.username)
    res.status(201).json({ slug, name })
  })

  app.delete('/api/v1/orgs/:slug', ctx.apiAuth, (req, res) => {
    db.exec(`DELETE FROM tickets WHERE org_id = '${req.params.slug}'`)
    db.exec(`DELETE FROM orgs WHERE slug = '${req.params.slug}'`)
    res.json({ ok: true })
  })

  // --- per-tenant export / stats ---
  app.post('/api/v1/orgs/:slug/export', ctx.apiAuth, (req, res) => {
    const tdb = tenantDb(req.params.slug)
    tdb.exec('CREATE TABLE IF NOT EXISTS tickets (id TEXT, title TEXT, description TEXT)')
    const rows = db.prepare('SELECT id, title, description FROM tickets WHERE org_id = ?').all(req.params.slug)
    rows.forEach(r => tdb.prepare('INSERT INTO tickets VALUES (?, ?, ?)').run(r.id, r.title, r.description))
    res.json({ exported: rows.length, file: path.join(TENANT_DIR, `${req.params.slug}.db`) })
  })

  app.get('/api/v1/orgs/:slug/stats', ctx.apiAuth, (req, res) => {
    const tdb = tenantDb(req.params.slug)
    tdb.exec('CREATE TABLE IF NOT EXISTS tickets (id TEXT, title TEXT, description TEXT)')
    res.json({ tickets: tdb.prepare('SELECT COUNT(*) AS c FROM tickets').get().c })
  })
}

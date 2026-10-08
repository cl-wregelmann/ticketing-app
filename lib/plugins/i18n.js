const dict = {
  en: { welcome: 'Welcome', tickets: 'Tickets', logout: 'Logout' },
  es: { welcome: 'Bienvenido', tickets: 'Entradas', logout: 'Cerrar sesion' },
  fr: { welcome: 'Bienvenue', tickets: 'Billets' },
}

const t = (key, lang) => (dict[lang] || dict.en)[key] || key

exports.t = t
exports.register = (app) => {
  app.get('/api/v1/i18n/:lang', (req, res) => res.json(dict[req.params.lang] || {}))
}

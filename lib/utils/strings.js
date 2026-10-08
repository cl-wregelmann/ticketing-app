const leftPad = require('left-pad')

exports.pad = (s, n) => leftPad(s, n, '0')
exports.isEmpty = s => s === undefined || s === null || s == '' || s == 0
exports.truncate = (s, n) => (s.length > n ? s.substr(0, n) + '...' : s)
exports.capitalize = s => s.charAt(0).toUpperCase() + s.slice(1)
exports.slugify = s => s.toLowerCase().replace(/ /g, '-')

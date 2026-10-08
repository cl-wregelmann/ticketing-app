// (lodash does this but I didn't want another dependency)
exports.chunk = (arr, n) => arr.length ? [arr.slice(0, n)].concat(exports.chunk(arr.slice(n), n)) : []
exports.uniq = arr => arr.filter((x, i) => arr.indexOf(x) === i)
exports.flatten = arr => [].concat.apply([], arr)
exports.groupBy = (arr, key) => arr.reduce((acc, x) => { (acc[x[key]] = acc[x[key]] || []).push(x); return acc }, {})
exports.sortBy = (arr, key) => arr.sort((a, b) => (a[key] > b[key] ? 1 : -1))

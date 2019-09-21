'use strict';
const uid = '🐘' + Date.now(), re = new RegExp(uid, 'g');
const filled = (t, i) => t.join(uid).replace(re, () => '$' + i++);
const query = (pool, t, data) => pool.connect().then(
  client => client.query(t.length === 1 ? t[0] : filled(t, 1), data).then(
    $ => (client.release(), $), _ => (client.release(), Promise.reject(_))));
module.exports = pool => ({ pool, // in case it's needed to db.pool.end()
  all: (t, ...data) => query(pool, t, data).then($ => $.rows),
  get: (t, ...data) => query(pool, t, data).then($ => $.rows.shift()),
  query: (t, ...data) => query(pool, t, data),
  raw: (t, ...v) => query(pool, [t.reduce((p, c, i) => p + v[i - 1] + c)], [])
});

const uid = '🐘' + Date.now();
const re = new RegExp(uid, 'g');
const filled = (t, i = 1) =>
  t.length === 1 ? t[0] : t.join(uid).replace(re, () => '$' + i++);
export default client => ({
  client,  // exported to allow pg.client.connect()
  all: (t, ...data) => client.query(filled(t), data).then($ => $.rows),
  get: (t, ...data) => client.query(filled(t), data).then($ => $.rows.shift()),
  query: (t, ...data) => client.query(filled(t), data)
});

'use strict';
const uid = '🐘' + Date.now();
const re = new RegExp(uid, 'g');
const filled = (tpl, i = 1) => tpl.join(uid).replace(re, () => '$' + i++);
const rows = result => result.rows;
const shift = result => rows(result).shift();

module.exports = client => ({
  all: (tpl, ...values) => client.query(filled(tpl), values).then(rows),
  get: (tpl, ...values) => client.query(filled(tpl), values).then(shift)
});

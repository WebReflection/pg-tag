'use strict';
const plain = (m => /* c8 ignore start */ m.__esModule ? m.default : m /* c8 ignore stop */)(require('plain-tag'));
const {asStatic, asParams} = require('static-params');

const create = (pool, $) => (tpl, ...values) => {
  if (tpl.some(chunk => chunk.includes('$')))
    throw new Error('SQL injection hazard');
  const [sql, ...params] = asParams(tpl, ...values);
  return pool.query(sql.map(holes).join(''), params).then($);
};

const holes = (value, i) => (0 < i ? ('$' + i) : '') + value;

function PGTag(pool) {
  return {
    all: create(pool, $ => $.rows),
    get: create(pool, $ => $.rows.shift()),
    query: create(pool, $ => $),
    raw: (tpl, ...values) => asStatic(plain(tpl, ...values)),
    pool
  };
}
module.exports = PGTag;

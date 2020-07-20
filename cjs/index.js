'use strict';
const plain = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('plain-tag'));
const {asStatic, asParams} = require('static-params');

const create = (pool, $) => (tpl, ...values) => {
  if (tpl.some(invalid))
    throw new Error('SQL injection hazard');
  const [sql, ...params] = asParams(tpl, ...values);
  return pool.query(sql.map(holes).join(''), params).then($);
};

const holes = (value, i) => (0 < i ? ('$' + i) : '') + value;

const invalid = chunk => chunk.includes('$');

const raw = (tpl, ...values) => asStatic(plain(tpl, ...values));

function PGTag(pool) {
  return {
    all: create(pool, $ => $.rows),
    get: create(pool, $ => $.rows.shift()),
    query: create(pool, $ => $),
    raw,
    pool
  };
}
module.exports = PGTag;

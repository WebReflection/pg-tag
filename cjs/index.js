'use strict';
const plain = (m => /* c8 ignore start */ m.__esModule ? m.default : m /* c8 ignore stop */)(require('plain-tag'));
const {asStatic, asParams} = require('static-params/sql');

const {defineProperty} = Object;

const create = (pool, $) => (tpl, ...values) => {
  if (tpl.some(chunk => chunk.includes('$')))
    throw new Error('SQL injection hazard');
  const [sql, ...params] = asParams(tpl, ...values);
  return pool.query(sql.map(holes).join(''), params).then($);
};

const holes = (value, i) => (0 < i ? ('$' + i) : '') + value;

function PGTag(pool) {
  const query = create(pool, $ => $);
  return {
    transaction() {
      let t = query(['BEGIN']);
      return defineProperty(
        (..._) => {
          t = t.then(() => query(..._));
        },
        'commit',
        {value() {
          return t = t.then(() => query(['COMMIT']));
        }}
      );
    },
    all: create(pool, $ => $.rows),
    get: create(pool, $ => $.rows.shift()),
    raw: (tpl, ...values) => asStatic(plain(tpl, ...values)),
    query,
    pool
  };
}
module.exports = PGTag;

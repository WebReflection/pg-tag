import plain from 'plain-tag';
import {asStatic, asParams} from 'static-params';

const create = (pool, $) => (tpl, ...values) => {
  const [sql, ...params] = asParams(tpl, ...values);
  return pool.query(sql.map(holes).join(''), params).then($);
};

const holes = (value, i) => (0 < i ? ('$' + i) : '') + value;

const raw = (tpl, ...values) => asStatic(plain(tpl, ...values));

export default function PGTag(pool) {
  return {
    all: create(pool, $ => $.rows),
    get: create(pool, $ => $.rows.shift()),
    query: create(pool, $ => $),
    raw,
    pool
  };
};

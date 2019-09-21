
// example
const pg = {
  connect: () => Promise.resolve(pg),
  release: () => {},
  query: (...args) => new Promise((resolve, reject) => {
    if (args[1].shift() === 'FAIL')
      reject();
    else
      resolve({rows: [1, 2, 3]});
  })
};

const {pool, get, all, query, raw} = require('.')(pg);

console.assert(pool === pg, 'unexpected pool');

const exit = err => {
  console.log('✔ failure works: ' + !err);
  process.exit(!!err * 1);
};

raw`SELECT * FROM ${'users'}`.then(result => {
  console.assert(result.rows.join(',') === '1,2,3', 'unexpected query result');
  console.log('✔ raw works');
});

query`
  SELECT *
  FROM users
`
  .then(result => {
    console.assert(result.rows.join(',') === '1,2,3', 'unexpected query result');
    console.log('✔ query works');
  })
  .catch(exit);

get`
  SELECT *
  FROM users
  WHERE email = ${'test@email.me'}
`
  .then(result => {
    console.assert(result === 1, 'unexpected get result');
    console.log('✔ get works');
  })
  .catch(exit);

all`
  SELECT *
  FROM users
  WHERE email = ${'test@email.me'}
`
  .then(result => {
    console.assert(result.join(',') === '1,2,3', 'unexpected all result');
    console.log('✔ all works');
  })
  .catch(exit);

get`
  SELECT *
  FROM users
  WHERE email = ${'FAIL'}
`
  .catch(exit);
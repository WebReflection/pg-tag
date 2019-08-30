# pg-tag

[![Build Status](https://travis-ci.com/WebReflection/pg-tag.svg?branch=master)](https://travis-ci.com/WebReflection/pg-tag) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/pg-tag/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/pg-tag?branch=master) [![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

<sup>**Social Media Photo by [Hu Chen](https://unsplash.com/@huchenme) on [Unsplash](https://unsplash.com/)**</sup>

A [10 LOC](https://github.com/WebReflection/pg-tag/blob/master/esm/index.js) utility to safely query [pg](https://www.npmjs.com/package/pg) via template literals.

```js
const {Client} = require('pg');
const pg = require('pg-tag')(new Client);

const user = await pg.get`
  SELECT
    id, name, address
  FROM
    users
  WHERE
    email = ${email}
`;

const users = await pg.all`
  SELECT *
  FROM users
  WHERE status = ${activeUser}
`;
```

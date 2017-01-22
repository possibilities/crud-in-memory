# CRUD in-memory

CRUD interface for in-memory data

[![CircleCI](https://circleci.com/gh/possibilities/crud-in-memory.svg?style=svg)](https://circleci.com/gh/possibilities/crud-in-memory)

### Summary

When developing small CRUD apps it's useful to have a simple abstraction over database operations. This library provides a minimal viable interface for in-memory data tables. This is most useful while prototyping but backends for real databases can be swapped in if persistence is needed but database operations remain simple.

### Usage

```
import inMemoryDatabase from 'crud-mysql'

const database = inMemoryDatabase()
const userTable = database.table('users')

// create row

await userTable.create({ id: 1, username: 'possibilities' })
await userTable.create({ id: 2, username: 'thrivingkings' })

// read all rows

const usernames = userTable.read().map(u => u.username)
console.info(usernames) //-> ['possibilities', 'thrivingkings']

// fetch certain rows

const { username } = userTable.read({ id: 1 }).pop()
console.info(username) //-> possibilities

// update row

const { country } = await userTable.update({ id: 1, country: 'denmark' })
console.info(country) //-> denmark

// delete row

const deleted = await userTable.delete({ id: 1 })
const users = userTable.read({ id: 1 })
console.info(users.length) //-> 0
```

### Other backends

* [mysql](https://github.com/possibilities/crud-mysql)

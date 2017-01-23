# CRUD in-memory

CRUD interface for in-memory data

[![CircleCI](https://circleci.com/gh/possibilities/crud-in-memory.svg?style=svg)](https://circleci.com/gh/possibilities/crud-in-memory)

### Summary

When developing small CRUD apps it's useful to have a simple abstraction over database operations. This library provides a minimal viable interface for in-memory data tables. This is most useful while prototyping but backends for real databases can be swapped in if persistence is needed but database operations remain simple.

### Usage

```
import configureDatabase from 'crud-mysql'

const database = configureDatabase()
const userTable = database.table('users')
```

#### Creates

```
await database(async query => {
  await query.create('users', { id: 1, username: 'possibilities' })
  await query.create('users', { id: 2, username: 'thrivingkings' })
})
```

#### Reads

Read all rows

```
await database(async query => {
  const users = await query.read('users')
  const usernames = users.map(u => u.username)
  console.info(usernames) //-> ['possibilities', 'thrivingkings']
})
```

Fetch certain rows

```
await database(async query => {
  const users = await query.read('users', { id: 1 })
  const { username } = users.pop()
  console.info(username) //-> possibilities
})
```

#### Updates

```
await database(async query => {
  const { country } = await query.update('users', { id: 1, country: 'denmark' })
  console.info(country) //-> denmark
})
```

#### Deletion

```
await database(async query => {
  await query.delete('users', { id: 1 })
  const users = query.read('users', { id: 1 })
  console.info(users.length) //-> 0
})
```

### Other backends

* [mysql](https://github.com/possibilities/crud-mysql)

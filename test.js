import test from 'ava'
import inMemoryDatabase from './src/index'

let database = inMemoryDatabase()

test.beforeEach(async t => {
  database = inMemoryDatabase()
})

test.serial('`create` adds item', async t => {
  await database(async query => {
    const initialUsers = await query.read('users', { username: 'possibilities' })
    t.deepEqual(initialUsers.length, 0)

    await query.create('users', {
      username: 'possibilities',
      country: 'denmark'
    })

    const users = await query.read('users', { username: 'possibilities' })
    t.deepEqual(users.length, 1)

    t.deepEqual(users[0].username, 'possibilities')
    t.deepEqual(users[0].country, 'denmark')
  })
})

test.serial('`update` changes fields', async t => {
  await database(async query => {
    await query.create('users', { username: 'possibilities' })
    await query.update(
      'users',
      { username: 'possibilities' },
      { country: 'denmark' }
    )
    const users = await query.read('users', { username: 'possibilities' })
    t.deepEqual(users[0].country, 'denmark')
  })
})

test.serial('`delete` removes an item', async t => {
  await database(async query => {
    await query.create('users', { username: 'possibilities' })
    await query.create('users', { username: 'thrivingkings' })
    await query.create('users', { username: 'rjz' })

    const usersBefore = await query.read('users')
    t.deepEqual(usersBefore.map(f => f.username), [
      'possibilities',
      'thrivingkings',
      'rjz'
    ])

    await query.delete('users', { username: 'possibilities' })

    const usersAfter = await query.read('users')
    t.deepEqual(usersAfter.map(f => f.username), [
      'thrivingkings',
      'rjz'
    ])
  })
})

test.serial('`read` returns all items when empty', async t => {
  await database(async query => {
    await query.create('users', { username: 'possibilities' })
    await query.create('users', { username: 'thrivingkings' })
    await query.create('users', { username: 'rjz' })

    const users = await query.read('users')
    t.deepEqual(users.map(f => f.username), [
      'possibilities',
      'thrivingkings',
      'rjz'
    ])
  })
})

test.serial('`read` returns matching items', async t => {
  await database(async query => {
    await query.create('users', { username: 'possibilities', country: 'iceland' })
    await query.create('users', { username: 'thrivingkings', country: 'denmark' })
    await query.create('users', { username: 'rjz', country: 'denmark' })

    const users = await query.read('users', { country: 'denmark' })
    t.deepEqual(users.map(f => f.username), ['thrivingkings', 'rjz'])
  })
})

test.serial('`read` returns matching items with specified fields', async t => {
  await database(async query => {
    await query.create('users', { username: 'possibilities', country: 'iceland' })
    await query.create('users', { username: 'thrivingkings', country: 'denmark' })
    await query.create('users', { username: 'rjz', country: 'denmark' })

    const usersWithUsername = await query.read(
      'users',
      { country: 'denmark' },
      ['username']
    )
    t.deepEqual(Object.keys(usersWithUsername[0]), ['username'])
    t.deepEqual(Object.keys(usersWithUsername[1]), ['username'])

    const usersWithCountry = await query.read(
      'users',
      { country: 'denmark' },
      ['country']
    )
    t.deepEqual(Object.keys(usersWithCountry[0]), ['country'])
    t.deepEqual(Object.keys(usersWithCountry[1]), ['country'])
  })
})

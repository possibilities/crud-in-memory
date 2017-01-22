import test from 'ava'
import inMemoryDatabase from './src/index'

const database = inMemoryDatabase()

test.serial('`create` adds item', async t => {
  const fooTable = database.table('foo')

  const initialFoos = await fooTable.read({ bar: 1 })
  t.deepEqual(initialFoos.length, 0)

  await fooTable.create({ bar: 1, baz: 'yes' })

  const foos = await fooTable.read({ bar: 1 })
  t.deepEqual(foos.length, 1)

  t.deepEqual(foos[0].bar, 1)
  t.deepEqual(foos[0].baz, 'yes')
})

test.serial('`update` changes fields', async t => {
  const fooTable = database.table('foo')

  await fooTable.create({ bar: 1 })
  await fooTable.update({ bar: 1 }, { baz: 'yes' })

  const foos = await fooTable.read({ bar: 1 })
  t.deepEqual(foos[0].baz, 'yes')
})

test.serial('`delete` removes an item', async t => {
  const fooTable = database.table('foo')

  await fooTable.create({ bar: 1 })
  await fooTable.create({ bar: 2 })
  await fooTable.create({ bar: 3 })

  const foosBefore = await fooTable.read()
  t.deepEqual(foosBefore.map(f => f.bar), [1, 2, 3])

  await fooTable.delete({ bar: 3 })

  const foosAfter = await fooTable.read()
  t.deepEqual(foosAfter.map(f => f.bar), [1, 2])
})

test.serial('`read` returns all items when empty', async t => {
  const fooTable = database.table('foo')

  await fooTable.create({ bar: 1 })
  await fooTable.create({ bar: 2 })
  await fooTable.create({ bar: 3 })

  const foos = await fooTable.read()
  t.deepEqual(foos.map(f => f.bar), [1, 2, 3])
})

test.serial('`read` returns matching items', async t => {
  const fooTable = database.table('foo')

  await fooTable.create({ bar: 1, baz: 'no' })
  await fooTable.create({ bar: 2, baz: 'yes' })
  await fooTable.create({ bar: 3, baz: 'yes' })

  const foos = await fooTable.read({ baz: 'yes' })
  t.deepEqual(foos.map(f => f.bar), [2, 3])
})

test.serial('`read` returns matching items with specified fields', async t => {
  const fooTable = database.table('foo')

  await fooTable.create({ bar: 1, baz: 'no' })
  await fooTable.create({ bar: 2, baz: 'yes' })
  await fooTable.create({ bar: 3, baz: 'yes' })

  const foosWithBar = await fooTable.read({ baz: 'yes' }, ['bar'])
  t.deepEqual(Object.keys(foosWithBar[0]), ['bar'])
  t.deepEqual(Object.keys(foosWithBar[1]), ['bar'])

  const foosWithBaz = await fooTable.read({ baz: 'yes' }, ['baz'])
  t.deepEqual(Object.keys(foosWithBaz[0]), ['baz'])
  t.deepEqual(Object.keys(foosWithBaz[1]), ['baz'])
})

import pick from 'lodash.pick'
import find from 'lodash.find'
import filter from 'lodash.filter'
import reject from 'lodash.reject'

const inMemoryDatabase = (config, data = {}) => {
  const database = async queryFn => {
    const query = {}

    query.create = (tableName, item) => {
      // Make the table if it doesn't exist
      data[tableName] = data[tableName] || []

      data[tableName].push(item)
      return Promise.resolve(item)
    }

    query.read = (tableName, where, fields = []) => {
      const results = filter(data[tableName], where)
      if (fields.length) {
        return Promise.resolve(results.map(result => pick(result, fields)))
      } else {
        return Promise.resolve(results)
      }
    }

    query.update = async (tableName, where, nextItem) => {
      const previousItem = find(data[tableName], where)
      const previousItemIndex = data[tableName].indexOf(previousItem)
      const updatedItem = {
        ...previousItem,
        ...nextItem,
        updatedAt: new Date()
      }

      data[tableName] = [
        ...data[tableName].slice(0, previousItemIndex),
        updatedItem,
        ...data[tableName].slice(previousItemIndex)
      ]

      return Promise.resolve(updatedItem)
    }

    query.delete = async (tableName, where) => {
      data[tableName] = reject(data[tableName], where)
      return Promise.resolve()
    }

    try {
      await queryFn(query)
    } catch (error) {
      console.error(error.message)
    }

    return Promise.resolve()
  }

  return database
}

export default inMemoryDatabase

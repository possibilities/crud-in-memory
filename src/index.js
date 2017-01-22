import pick from 'lodash.pick'
import find from 'lodash.find'
import filter from 'lodash.filter'
import reject from 'lodash.reject'

const database = config => {
  const table = tableName => {
    const data = {}

    // Make the table if it doesn't exist
    data[tableName] = data[tableName] || []

    const create = (item) => {
      data[tableName].push(item)
      return Promise.resolve(item)
    }

    const read = (query, fields = []) => {
      const results = filter(data[tableName], query)
      if (fields.length) {
        return Promise.resolve(results.map(result => pick(result, fields)))
      } else {
        return Promise.resolve(results)
      }
    }

    const update = (query, nextItem) => {
      const previousItem = find(data[tableName])
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

    const del = (query) => {
      data[tableName] = reject(data[tableName], query)
      return Promise.resolve()
    }

    return { create, read, update, delete: del }
  }

  return { table }
}

export default database

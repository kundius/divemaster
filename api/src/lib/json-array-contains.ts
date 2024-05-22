import { Raw } from 'typeorm'

export function JsonArrayContains(value: string | string[]) {
  return Raw((alias) => `JSON_CONTAINS(${alias}, :value)`, {
    value: JSON.stringify(value)
  })
}

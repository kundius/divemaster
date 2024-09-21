import { Transform } from 'class-transformer'

export function ParseBoolean() {
  return Transform(({ value }) => {
    if (typeof value === 'boolean') {
      return value
    }
    if (['true', '1'].includes(value)) {
      return true
    }
    if (['false', '0'].includes(value)) {
      return false
    }
    return undefined
  })
}

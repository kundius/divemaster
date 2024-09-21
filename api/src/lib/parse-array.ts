import { Transform } from 'class-transformer'

export function ParseArray() {
  return Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value
    }

    if (typeof value !== 'string') {
      return undefined
    }

    try {
      return value.split(',')
    } catch {}

    return undefined
  })
}

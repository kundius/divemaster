import { Transform } from 'class-transformer'

export function ParseObject() {
  return Transform(({ value }) => {
    if (typeof value === 'object') {
      return value
    }

    if (typeof value !== 'string') {
      return undefined
    }

    try {
      return JSON.parse(value)
    } catch {}

    return undefined
  })
}

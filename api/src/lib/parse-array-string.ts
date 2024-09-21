import { Transform } from 'class-transformer'

export function ParseArrayString() {
  return Transform(({ value }) => {
    if (typeof value !== 'string') {
      return undefined
    }

    try {
      return value.split(',')
    } catch {}

    return undefined
  })
}

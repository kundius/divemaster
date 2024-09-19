import { Transform } from 'class-transformer'

export function ParseJSONString() {
  return Transform(({ value }) => {
    if (typeof value !== 'string') {
      return undefined
    }

    try {
      return JSON.parse(value)
    } catch {}

    return undefined
  })
}

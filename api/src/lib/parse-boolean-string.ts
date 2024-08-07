import { Transform } from 'class-transformer'

export function ParseBooleanString() {
  return Transform(({ value }) => {
    if (['true', '1'].includes(value)) {
      return true
    }
    if (['false', '0'].includes(value)) {
      return false
    }
    return undefined
  })
}

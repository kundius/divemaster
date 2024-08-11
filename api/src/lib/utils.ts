import slugifyFn from 'slugify'
import { customAlphabet } from 'nanoid'

export function slugify(value: string) {
  return slugifyFn(value.toLocaleLowerCase(), { remove: /[*+~.,/\()'"!:@]/g })
}

export const nanoid = customAlphabet('1234567890abcdef', 10)

export function pluck<T, V extends keyof T>(typeFrom: T[], properties: V) {
  return typeFrom.map((prop) => prop[properties])
}

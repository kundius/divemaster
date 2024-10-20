import slugifyFn from 'slugify'
import { customAlphabet } from 'nanoid'
import * as nunjucks from 'nunjucks'

export function slugify(value: string) {
  return slugifyFn(value.toLocaleLowerCase(), { remove: /[*+~.,/\()'"!:@]/g })
}

export const nanoid = customAlphabet('1234567890abcdef', 10)

export function pluck<T, V extends keyof T>(typeFrom: T[], properties: V) {
  return typeFrom.map((prop) => prop[properties])
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0
  }).format(value)
}


export const njk = new nunjucks.Environment(new nunjucks.FileSystemLoader('views'), {
  autoescape: true
})

njk.addFilter('formatPrice', formatPrice)

import slugifyFn from 'slugify'

export function slugify(value: string) {
  return slugifyFn(value.toLocaleLowerCase(), { remove: /[*+~.()'"!:@]/g })
}

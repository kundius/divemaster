export interface UserEntity {
  id: number
  name: string
  email: string
  active: boolean
  role: UserRoleEntity
}

export interface UserRoleEntity {
  id: number
  title: string
  scope: string[] | null
}

export interface BrandEntity {
  id: number
  title: string
}

export interface CategoryEntity {
  id: number
  parent: number | CategoryEntity | null
  image: number | FileEntity | null
  title: string
  longTitle: string | null
  alias: string
  description: string | null
  active: boolean
  children?: CategoryEntity[]
}

export interface ProductEntity {
  id: number
  price: number
  oldPrice: number | null
  brand: number | BrandEntity | null
  title: string
  longTitle: string | null
  alias: string
  description: string | null
  specifications: string | null
  exploitation: string | null
  sku: string | null
  file: FileEntity | null
  active: boolean
  recent: boolean
  favorite: boolean
  inStock: boolean
  images?: ProductImageEntity[]
  categories?: CategoryEntity[]
  descriptions?: ProductDescription[]
}

export interface ProductDescription {
  id: number
  title: string
  content: string
  rank: number
}

export type FileEntity = {
  id: number
  file: string
  path: string
  url: string
  type?: string
  hash?: string
  size?: number
  metadata?: string
}

export type FileEntityOptions = {
  w?: string | number
  h?: string | number
  fit?: string
  fm?: string
  t?: string | number
  [key: string]: any
}

export type ProductImageEntity = {
  file: number | FileEntity
  product: number | ProductEntity
  rank: number
  active: boolean
}

export interface OptionEntity {
  id: number
  key: string
  caption: string
  inFilter: boolean
  inCart: boolean
  type: OptionType
  rank: number
  categories?: CategoryEntity[]
}

export interface OptionValueEntity {
  id: number
  value: string
  option: number | OptionEntity
  product: number | ProductEntity
  rank: number
  properties?: string
}

export enum OptionType {
  // RANGE = 'range',
  // BOOLEAN = 'boolean',
  COLOR = 'color',
  SIZE = 'size',
  VARIANT = 'variant'
}

export type PageProps<
  TParams = {},
  TSearchParams = { [key: string]: string | string[] | undefined }
> = {
  params: TParams
  searchParams: TSearchParams
}

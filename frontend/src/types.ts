export interface UserEntity {
  id: number
  name: string
  email: string
  active: boolean
  role: UserRoleEntity
  cart: CartEntity | null
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

export interface OfferEntity {
  id: number
  title: string | null
  price: number
  product: ProductEntity
  optionValues?: OptionValueEntity[]
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
  priceDecrease: number | null
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
  options?: OptionEntity[]
  offers?: OfferEntity[]
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
  type: OptionType
  rank: number
  categories?: CategoryEntity[]
  values?: OptionValueEntity[]
}

export interface OptionValueEntity {
  id: number
  content: string
  option: number | OptionEntity
  product: number | ProductEntity
  rank: number
  properties?: string
}

export enum OptionType {
  // CHECKBOX = 'checkbox',
  // COMBOMULTIPLE = 'combo-multiple',
  COMBOBOOLEAN = 'combo-boolean',
  COMBOCOLORS = 'combo-colors',
  COMBOOPTIONS = 'combo-options',
  // COMBOBOX = 'combobox',
  // DATEFIELD = 'datefield',
  NUMBERFIELD = 'numberfield',
  TEXTFIELD = 'textfield'
  // TEXTAREA = 'textarea'
}

export type PageProps<
  TParams = {},
  TSearchParams = { [key: string]: string | string[] | undefined }
> = {
  params: TParams
  searchParams: TSearchParams
}

export interface CartEntity {
  id: string
  user: UserEntity | UserEntity['id'] | null
  products: CartProductEntity[]
  createdAt: string
  updatedAt: string
}

export interface CartProductEntity {
  id: string
  cart: CartEntity | CartEntity['id']
  product: ProductEntity
  amount: number
  createdAt: string
  updatedAt: string
  optionValues?: OptionValueEntity[]
}

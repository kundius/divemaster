// export interface PickupPointCitiesDistrict {
//   id: number
//   name: string
// }

// export interface PickupPointCitiesRegion {
//   id: number
//   districtId: number
//   name: string
// }

// export interface PickupPointCitiesCity {
//   id: string
//   regionId: number
//   name: string
//   lat: number
//   lon: number
// }

// export interface PickupPointCities {
//   districts: PickupPointCitiesDistrict[]
//   regions: PickupPointCitiesRegion[]
//   cities: PickupPointCitiesCity[]
// }

export interface CartGetOrderCost {
  cost: number
  composition: {
    name: string
    caption: string
    value: number
  }[]
}

export interface CityEntity {
  id: string
  type: string
  name: string
  subject: string
  district: string
  lat: number
  lon: number
}

export interface PickupPointEntity {
  id: string
  name: string
  districtName: string
  subjectName: string
  cityType: string
  cityName: string
  fullAddress: string
  shortAddress: string
  phone: string
  email: string
  workTime: string
  lat: number
  lon: number
  note: string
  isReception: boolean
  isDressingRoom: boolean
  allowedCod: boolean
  haveCash: boolean
  haveCashless: boolean
}

export enum DeliveryService {
  Shipping = 'Shipping',
  Pickup = 'Pickup'
}

export enum PaymentService {
  Yookassa = 'Yookassa',
  UponCash = 'UponCash'
}

export interface OrderProductEntity {
  id: number
  order: OrderEntity | number
  product: ProductEntity | number | null
  amount: number
  price: number
  title: string
  options?: Record<string, string>
}

export interface PaymentEntity {
  id: number
  service: PaymentService
  paid: boolean | null
  link: string | null
  order: OrderEntity | number
  createdAt: string
  paidAt: string
}

export interface DeliveryEntity {
  id: number
  service: DeliveryService
  delivered: boolean | null
  address: string
  recipient?: Record<string, string>
  order: OrderEntity | number
  createdAt: string
  deliveredAt: string
}

export interface OrderEntity {
  id: number
  hash: string
  cost: number
  amount: number
  composition?: { value: number; caption: number; name: string }[]
  user: UserEntity | null
  products: OrderProductEntity[]
  payment: PaymentEntity
  delivery: DeliveryEntity
  createdAt: string
}

export interface ProductsBaseFilter {
  name: string
  title: string
}

export interface ProductsOptionsFilter extends ProductsBaseFilter {
  type: 'options'
  variant: 'default' | 'colors'
  conjunction: boolean
  options: {
    value: string
    amount: number
  }[]
}

export interface ProductsRangeFilter extends ProductsBaseFilter {
  type: 'range'
  range: [number, number]
}

export interface ProductsToggleFilter extends ProductsBaseFilter {
  type: 'toggle'
}

export type ProductsFilter = ProductsOptionsFilter | ProductsRangeFilter | ProductsToggleFilter

export interface UserEntity {
  id: number
  name: string
  email: string
  discount: number
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
  rank: number
  children?: CategoryEntity[]
}

export interface ProductEntity {
  id: number
  priceDecrease: number | null
  brand: number | BrandEntity | null
  title: string
  longTitle: string | null
  alias: string
  rank: number
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
  optionValues?: OptionValueEntity[]
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
  oldPrice?: number
  price?: number
  active?: boolean
}

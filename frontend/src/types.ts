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

export interface FindAllResult<TRow> {
  rows: TRow[]
  total: number
}

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

export enum PickupPointTypeEnum {
  cdek = 'cdek',
  store = 'store'
}

export interface PickupPointEntity {
  id: string
  type: PickupPointTypeEnum
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
  orderId: number
  order?: OrderEntity
  productId: number | null
  product?: ProductEntity | null
  quantity: number
  price: number
  title: string
  options?: Record<string, string>
}

export interface PaymentEntity {
  id: number
  service: PaymentService
  paid: boolean | null
  link: string | null
  orderId: number
  order?: OrderEntity
  createdAt: string
  paidAt: string | null
}

export interface DeliveryEntity {
  id: number
  service: DeliveryService
  delivered: boolean | null
  address: string
  recipient?: Record<string, string>
  orderId: number
  order?: OrderEntity
  createdAt: string
  deliveredAt: string
}

export interface OrderEntity {
  id: number
  hash: string
  cost: number
  composition?: { value: number; caption: number; name: string }[]
  userId: number | null
  user?: UserEntity
  products: OrderProductEntity[]
  payment?: PaymentEntity
  delivery?: DeliveryEntity
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
    quantity: number
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
  roleId: number
  role?: UserRoleEntity
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
  productId: number
  product?: ProductEntity
  optionValues?: OptionValueEntity[]
}

export interface CategoryEntity {
  id: number
  parentId: number | null
  parent?: CategoryEntity | null
  imageId: number | null
  image?: FileEntity | null
  title: string
  longTitle: string | null
  alias: string
  description: string | null
  active: boolean
  rank: number
  children?: CategoryEntity[]
  options?: OptionEntity[]
  products?: ProductEntity[]
}

export interface ProductEntity {
  id: number
  priceDecrease: number | null
  brandId: number | null
  brand?: BrandEntity | null
  title: string
  longTitle: string | null
  alias: string
  rank: number
  description: string | null
  specifications: string | null
  exploitation: string | null
  sku: string | null
  fileId: number | null
  file?: FileEntity | null
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
  fileId: number
  file?: FileEntity
  productId: number
  product?: ProductEntity
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
  optionId: number
  option?: OptionEntity
  productId: number
  product?: ProductEntity
  rank: number
  properties?: string
}

export enum OptionType {
  // CHECKBOX = 'checkbox',
  // COMBOMULTIPLE = 'combo-multiple',
  COMBOBOOLEAN = 'combo_boolean',
  COMBOCOLORS = 'combo_colors',
  COMBOOPTIONS = 'combo_options',
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
  userId: UserEntity['id'] | null
  user?: UserEntity | null
  products: CartProductEntity[]
  createdAt: string
  updatedAt: string
}

export interface CartProductEntity {
  id: string
  cartId: CartEntity['id']
  cart?: CartEntity
  productId: ProductEntity['id']
  product?: ProductEntity
  quantity: number
  createdAt: string
  updatedAt: string
  optionValues?: OptionValueEntity[]
  oldPrice?: number
  price?: number
  active?: boolean
}

export interface BlogPostEntity {
  id: number
  title: string
  longTitle: string | null
  alias: string
  content: string | null
  readTime: string | null
  status: BlogPostStatusEnum
  metadata: Record<string, string> | null
  createdAt: string
  updatedAt: string
  tags: BlogTagEntity[]
  image: FileEntity | null
}

export interface BlogTagEntity {
  id: number
  name: string
  alias: string
  metadata: Record<string, string> | null
  posts: BlogPostEntity[]
  postsTotal?: number
}

export enum BlogPostStatusEnum {
  Published = 'published',
  Draft = 'draft',
  Archived = 'archived'
}

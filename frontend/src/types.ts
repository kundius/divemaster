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

export enum SyncTaskStatus {
  INITIALIZATION = 'initialization',
  SYNCHRONIZATION = 'synchronization',
  SUSPENDED = 'suspended',
  CANCELLED = 'cancelled', // end
  SUCCESS = 'success', // end
  ERROR = 'error' // end
}

export enum SyncTaskProvider {
  ARCHIVE = 'archive'
}

export interface SyncProductEntity {
  id: number
  remoteId: string | null
  sku: string | null
  name: string | null
  description: string | null
  categories: string | null
  images: string | null
  brand: string | null
  favorite: string | null
  recent: string | null
  options: string | null
  offers: string | null
  syncTaskId: number
  syncTask: SyncTaskEntity
}

export interface SyncTaskEntity {
  id: number
  status: SyncTaskStatus
  statusMessage: string | null
  provider: SyncTaskProvider
  total: number
  offset: number
  created: number
  updated: number
  skipped: number
  properties: Record<string, string> | null
  createdAt: string
  updatedAt: string
  syncProducts?: SyncProductEntity[]
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
  Vtb = 'Vtb',
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
  number: string
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
  phone: string | null
  discount: number
  address: Record<string, string> | null
  active: boolean
  roleId: number
  role?: UserRoleEntity
  cart: CartEntity | null
  wishlists: WishlistEntity[]
}

export interface UserRoleEntity {
  id: number
  title: string
  scope: string[] | null
}

export interface BrandEntity {
  id: number
  imageId: number | null
  image?: FileEntity | null
  name: string
  alias: string
  description: string | null
}

export interface OfferEntity {
  id: number
  title: string | null
  price: number
  productId: number
  product?: ProductEntity
  options?: OfferOptionEntity[]
}

export interface OfferOptionEntity {
  id: number
  name: string
  content: string
  offerId: number
  offer?: OfferEntity
}

export interface CategoryEntity {
  id: number
  parentId: number | null
  // parent?: CategoryEntity | null
  imageId: number | null
  image?: FileEntity | null
  title: string
  longTitle: string | null
  alias: string
  description: string | null
  active: boolean
  rank: number
  // children?: CategoryEntity[]
  properties?: PropertyEntity[]
  products?: ProductEntity[]
}

export interface ReviewMediaEntity {
  fileId: number
  file?: FileEntity
  reviewId: number
  review?: ReviewEntity
  rank: number
}

export interface ReviewReplyEntity {
  id: number
  reviewId: number
  review?: ReviewEntity
  comment: string
  userId: number
  user?: UserEntity
  createdAt: Date
}

export interface ReviewEntity {
  id: number
  advantages: string | null
  flaws: string | null
  comment: string | null
  author: string | null
  userId: number | null
  user?: UserEntity | null
  productId: number
  product?: ProductEntity
  media?: ReviewMediaEntity[]
  reply?: ReviewReplyEntity | null
  createdAt: Date
  publishedAt: Date | null
  isRecommended: boolean
  isPublished: boolean
  rating: number
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
  minPrice: number | null
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
  offers?: OfferEntity[]
  properties?: PropertyEntity[]
  options?: ProductOptionEntity[]
}

export interface ProductOptionEntity {
  id: number
  name: string
  content: string
  rank: number
  productId: number
  product?: ProductEntity
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

export interface PropertyEntity {
  id: number
  key: string
  caption: string
  inFilter: boolean
  type: PropertyType
  rank: number
  categories?: CategoryEntity[]
  // values?: OptionValueEntity[]
}

// export interface OptionValueEntity {
//   id: number
//   content: string
//   optionId: number
//   option?: OptionEntity
//   productId: number
//   product?: ProductEntity
//   rank: number
//   properties?: string
// }

export enum PropertyType {
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
  TParams = object,
  TSearchParams = { [key: string]: string | string[] | undefined }
> = {
  params: Promise<TParams>
  searchParams: Promise<TSearchParams>
}

export enum WishlistType {
  FAVOURITES = 'favourites',
  COMPARISON = 'comparison',
  VIEWED = 'viewed'
}

export interface WishlistEntity {
  id: string
  userId: UserEntity['id'] | null
  user?: UserEntity | null
  products: ProductEntity[]
  createdAt: string
  type: WishlistType
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
  options?: CartProductOptionEntity[]
  oldPrice?: number
  price?: number
  active?: boolean
}

export interface CartProductOptionEntity {
  id: number
  name: string
  content: string
  cartProductId: number
  cartProduct?: ProductEntity
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

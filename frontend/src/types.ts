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

export interface CategoryEntity {
  id: number
  parent: number | CategoryEntity | null
  title: string
  alias: string
  description: string | null
  active: boolean
  children?: CategoryEntity[]
}

export interface ProductEntity {
  id: number
  price: number
  title: string
  alias: string
  description: string | null
  sku: string | null
  file: FileEntity | null
  active: boolean
}

export type FileEntity = {
  id: number
  file: string
  path: string
  type?: string
  title?: string
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

export type PageProps<
  TParams = {},
  TSearchParams = { [key: string]: string | string[] | undefined }
> = {
  params: TParams
  searchParams: TSearchParams
}

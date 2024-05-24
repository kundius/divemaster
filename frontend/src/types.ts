export interface VespUser {
  id: number
  name: string
  email: string
  active: boolean
  roleId: number
  role: VespUserRole
}

export interface VespUserRole {
  id: number
  title: string
  scope: string[] | null
}

export interface Category {
  id: number
  parentId: number | null
  title: string
  alias: string
  description: string | null
  active: boolean
}

export interface VespProduct {
  id: number
  price: number
  title: string
  alias: string
  description: string | null
  sku: string | null
  file: VespFile | null
  active: boolean
}

export type VespFile = {
  id: number
  file: string
  path: string
  type?: string
  title?: string
  size?: number
  metadata?: string
}

export type VespFileOptions = {
  w?: string | number
  h?: string | number
  fit?: string
  fm?: string
  t?: string | number
  [key: string]: any
}

export type ProductImage = {
  fileId: number
  productId: number
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

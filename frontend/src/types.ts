export interface VespUser {
  id: number
  username: string
  fullname: string | null
  email: string | null
  active: boolean
  role_id: number
  updated_at: string | null
  created_at: string | null
  role: VespUserRole

  // [key: string]: any
}

export interface VespUserRole {
  id: number
  title: string
  scope: string[] | null
  updated_at: string | null
  created_at: string | null
}

export interface VespCategory {
  id: number
  parent_id: number
  title: string
  alias: string
  description: string | null
  active: boolean
  updated_at: string | null
  created_at: string | null
}

export interface VespProduct {
  id: number
  price: number
  category_id: number
  title: string
  description: string | null
  sku: string
  category: VespCategory
  file: VespFile | null
  active: boolean
  updated_at: string | null
  created_at: string | null
}

export type VespFile = {
  id?: number
  uuid: string
  updated_at?: string
  [key: string]: any
}

export type VespFileOptions = {
  w?: string | number
  h?: string | number
  fit?: string
  fm?: string
  t?: string | number
  [key: string]: any
}

export type VespProductFile = {
  file_id: number
  product_id: number
  rank: number
  active: boolean
  file: {
    id: number
  }
}

export type PageProps<
  TParams = {},
  TSearchParams = { [key: string]: string | string[] | undefined }
> = {
  params: TParams
  searchParams: TSearchParams
}

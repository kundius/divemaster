export interface VespUser {
  id: number
  username: string
  fullname: string | null
  email: string | null
  active: boolean
  role_id: number
  updated_at: string | null
  created_at: string | null

  // [key: string]: any
}

export interface VespUserRole {
  id: number
  title: string
  scope: string[] | null
  updated_at: string | null
  created_at: string | null
}

export type PageProps<
  TParams = {},
  TSearchParams = { [key: string]: string | string[] | undefined }
> = {
  params: TParams
  searchParams: TSearchParams
}

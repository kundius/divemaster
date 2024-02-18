export interface VespUserRole {
  title: string
  scope: string[]
  updated_at: string
  created_at: string
  id: number
}

export type PageProps<
  TParams = {},
  TSearchParams = { [key: string]: string | string[] | undefined }
> = {
  params: TParams
  searchParams: TSearchParams
}

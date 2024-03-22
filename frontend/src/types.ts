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

export type VespUserRole = {
  id: number
  title: string
  scope: string[]
  [key: string]: any
}

export type VespUser = {
  id: number
  username: string
  fullname?: string
  password?: string
  email?: string
  active?: boolean
  role_id?: number
  role?: VespUserRole
  [key: string]: any
}

export type VespAuthStore = {
  user: Ref<VespUser | undefined>
  token: Ref<string | undefined>
  loggedIn: Ref<boolean>
  loadUser: Function
  login: Function
  logout: Function
  setToken: Function
}

export type VespTableAction = {
  size?: String
  variant?: String
  class?: String | Array<string> | Object
  route?: any
  function?: Function
  icon?: String
  title?: String
  // map?: Record<string, string>
  // key?: string
  // isActive?: Function
}

export type VespTableOnLoad = (data: { total: number; rows: any[]; [key: string]: any }) => {
  total: number
  rows: any[]
  [key: string]: any
}

export type VespTableColumn = {
  label: string
  key: string
  sortable?: boolean
  headClass?: string
  cellClass?: string
}

export type VespTableFilterQuery = {
  key: string
  type: 'query'
  placeholder?: string
}

export type VespTableFilterFacet = {
  key: string
  type: 'facet'
  title?: string
  options?: {
    value: unknown
    label: string
  }[]
}

export type VespTableFilter = VespTableFilterQuery | VespTableFilterFacet

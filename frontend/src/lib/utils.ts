import { FileEntity, FileEntityOptions, ProductEntity } from '@/types'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import slugifyFn from 'slugify'
import { getCookie } from 'cookies-next'
import { TOKEN_NAME } from '../constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getClientUrl(): string {
  const CLIENT_URL = String(process.env.NEXT_PUBLIC_CLIENT_URL)
  return CLIENT_URL.endsWith('/') ? CLIENT_URL : CLIENT_URL + '/'
}

export function getApiUrl(): string {
  const API_URL = String(process.env.NEXT_PUBLIC_API_URL)
  return API_URL.endsWith('/') ? API_URL : API_URL + '/'
}

export function getFileUrl(file: FileEntity | number): string {
  if (typeof file === 'number') {
    return `${getClientUrl()}storage/${file}/read`
  }
  return `${getClientUrl()}storage/${file.id}/read`
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function disableScroll() {
  if (document.getElementById('removed-body-scroll-bar-style')) return

  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

  const styles = `
  body {
    --removed-body-scroll-bar-size: ${scrollbarWidth}px;
    overflow: hidden !important;
    overscroll-behavior: contain;
    position: relative !important;
    padding-left: 0px;
    padding-top: 0px;
    padding-right: 0px;
    margin-left: 0;
    margin-top: 0;
    margin-right: ${scrollbarWidth}px !important;
  }
  `
  const styleSheet = document.createElement('style')
  styleSheet.innerHTML = styles
  styleSheet.id = 'removed-body-scroll-bar-style'
  document.head.appendChild(styleSheet)
}

export function enableScroll() {
  const styleSheet = document.getElementById('removed-body-scroll-bar-style')
  styleSheet?.parentNode?.removeChild(styleSheet)
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0
  }).format(value)
}

export function declOfNum(n: number, text_forms: [string, string, string]) {
  n = Math.abs(n) % 100
  const n1 = n % 10
  if (n > 10 && n < 20) {
    return text_forms[2]
  }
  if (n1 > 1 && n1 < 5) {
    return text_forms[1]
  }
  if (n1 == 1) {
    return text_forms[0]
  }
  return text_forms[2]
}

export function slugify(value: string) {
  return slugifyFn(value.toLocaleLowerCase(), { remove: /[*+~.()'"!:@]/g })
}

export const uploadFile = async (file: File): Promise<FileEntity> => {
  const Bearer = getCookie(TOKEN_NAME)
  const fd = new FormData()
  fd.append('file', file)
  const uploadResponse = await fetch(`${getApiUrl()}storage/upload`, {
    method: 'POST',
    headers: {
      authorization: Bearer ? `Bearer ${Bearer}` : ''
    },
    body: fd
  })
  const uploadJson: FileEntity = await uploadResponse.json()

  if (uploadResponse.status === 500) {
    throw uploadJson
  }

  return uploadJson
}

export function shallowEqual(object1: Record<string, any>, object2: Record<string, any>) {
  const keys1 = Object.keys(object1)
  const keys2 = Object.keys(object2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    if (object1[key] !== object2[key]) {
      return false
    }
  }

  return true
}

export function pluck<T, V extends keyof T>(typeFrom: T[], properties: V) {
  return typeFrom.map((prop) => prop[properties])
}

export function getEntityId(entity: number | { id: number }) {
  if (typeof entity === 'number') {
    return entity
  }
  return entity.id
}

export function clearUndefined<I extends Record<string, any>>(object: I): Partial<I> {
  const output = { ...object }
  for (const key of Object.keys(output)) {
    if (typeof output[key] === 'undefined') {
      delete output[key]
    }
  }
  return output
}

export function clearEmpty<I extends Record<string, any>>(object: I): Partial<I> {
  const output = { ...object }
  for (const key of Object.keys(output)) {
    if (!output[key]) {
      delete output[key]
    }
  }
  return output
}

export type TTree<T> = {
  children?: TTree<T>[]
} & T

export const arrayToTree = <T>(
  list: T[],
  { id = 'id', parentId = 'parentId' }: { id?: string; parentId?: string } = {}
): TTree<T>[] | [] => {
  /** map between id and array position */
  const map: number[] = []
  const treeList: TTree<T>[] = list as TTree<T>[]

  for (let i = 0; i < treeList.length; i += 1) {
    /** initialize the map */
    map[(treeList[i] as TTree<T> & { [id: string]: number })[id]] = i
    /** initialize the children */
    treeList[i].children = []
  }

  let node: TTree<T> & { [parentId: string]: number }
  /** return value */
  const roots: TTree<T>[] = []

  for (const item of treeList) {
    node = item as TTree<T> & { [parentId: string]: number }
    if (node[parentId] !== 0 && node[parentId] !== null) {
      if (treeList[map[node[parentId]]] !== undefined) {
        treeList[map[node[parentId]]].children?.push(node)
      }
    } else {
      roots.push(node)
    }
  }
  return roots
}

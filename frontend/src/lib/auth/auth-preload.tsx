import { cache } from 'react'

const preloadEnabled = cache<() => { current: boolean }>(() => ({ current: false }))

export const authPreloadEnabled = () => {
  return preloadEnabled().current
}

export const enableAuthPreload = () => {
  preloadEnabled().current = true
}

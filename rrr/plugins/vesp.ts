import {hasScope, getImageLink} from '../utils/vesp'
import {defineNuxtPlugin} from '#app'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      image: getImageLink,
      scope: hasScope,
    },
  }
})

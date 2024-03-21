// import * as pkg from 'vue-toastification'

// const {useToast} = pkg

export function useToastInfo(message: string, options = {}) {
  console.log('useToast().info(message, options)', message, options)
}

export function useToastSuccess(message: string, options = {}) {
  console.log('useToast().success(message, options)', message, options)
}

export function useToastError(message: string, options = {}) {
  console.log('useToast().error(message, options)', message, options)
}

export function useToastsClear() {
  console.log('useToast().clear()')
}

import { FieldValues, UseFormProps, UseFormReturn, useForm } from 'react-hook-form'
import { getApiUrl } from '@/lib/utils'
import { useAuth } from '@/lib/auth/use-auth'

export interface UseApiFormParams<TResult> {
  method?: string
  onSuccess?: (result: TResult) => void
  onError?: (e: Error) => void
  headers?: HeadersInit | undefined
}

export function useApiForm<TFieldValues extends FieldValues = FieldValues, TResult = any>(
  route: string,
  props: UseFormProps<TFieldValues> & Partial<UseApiFormParams<TResult>> = {}
): [UseFormReturn<TFieldValues>, (v: TFieldValues) => void] {
  const { method = 'POST', onSuccess, onError, headers: headersInit, ...formProps } = props

  const form = useForm<TFieldValues>(formProps)

  const auth = useAuth()

  const onSubmit = async (values: TFieldValues) => {
    const headers = new Headers(
      headersInit || {
        'Content-Type': 'application/json'
      }
    )

    if (auth.token) {
      headers.set('Authorization', `Bearer ${auth.token}`)
    }

    const response = await fetch(`${getApiUrl()}${route}`, {
      method,
      headers,
      body: JSON.stringify(values)
    })
    const result = await response.json()

    if (response.status === 200) {
      onSuccess?.(result as TResult)
    } else {
      let errorMessage = `${response.status} ${response.statusText}`
      if (typeof result === 'string' && !!result) {
        errorMessage = result
      }
      onError?.(new Error(errorMessage))
    }
  }

  return [form, onSubmit]
}

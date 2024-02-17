import { FieldValues, UseFormProps, UseFormReturn, useForm } from 'react-hook-form'
import { getApiUrl } from '@/lib/utils'
import { useAuth } from '@/lib/auth/use-auth'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { toast } from 'sonner'

export type UseApiFormReturn<TFieldValues extends FieldValues = FieldValues, TResult = unknown> = [
  UseFormReturn<TFieldValues>,
  (values: TFieldValues) => void
]

export interface UseApiFormProps<TFieldValues extends FieldValues = FieldValues, TResult = unknown>
  extends UseFormProps<TFieldValues> {
  method?: string
  onSuccess?: (result: TResult) => void
  onError?: (e: Error) => void
  headers?: HeadersInit | undefined
  schema?: z.Schema
}

export function useApiForm<TFieldValues extends FieldValues = FieldValues, TResult = unknown>(
  route: string,
  props: UseApiFormProps<TFieldValues, TResult> = {}
): UseApiFormReturn<TFieldValues, TResult> {
  const {
    method = 'POST',
    onSuccess,
    onError,
    headers: headersInit,
    schema: zodSchema,
    ...formProps
  } = props

  if (zodSchema) {
    formProps.resolver = zodResolver(zodSchema)
  }

  const form = useForm<TFieldValues>(formProps)
  const auth = useAuth()

  const onSubmit = async (values: TFieldValues) => {
    const headers = new Headers(headersInit)

    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    if (auth.token) {
      headers.set('Authorization', `Bearer ${auth.token}`)
    }

    const response = await fetch(`${getApiUrl()}${route}`, {
      method,
      headers,
      body: JSON.stringify(values)
    })
    const result = await response.json()

    if (response.ok) {
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

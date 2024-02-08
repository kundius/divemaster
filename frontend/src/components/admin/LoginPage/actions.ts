'use server'

import { ZodError, object, z } from 'zod'
import { getApiUrl } from '@/lib/utils'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

const Validator = z.object({
  username: z.string(),
  password: z.string()
})

export interface LoginActionState {
  // success: boolean
  // message: string
  fieldErrors?: { [key: string]: string }
  fieldValues?: { [key: string]: string }
}

// export let eeee: string | undefined = undefined

export async function loginAction(
  prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const username = formData.get('username')
  const password = formData.get('password')

  try {
    Validator.parse({ username, password })

    const response = await fetch(`${getApiUrl()}security/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    const result = await response.json()
    if (response.status === 200) {
      cookies().set({
        name: 'auth:token',
        value: result.token,
        path: '/'
        // expires
      })
      redirect('/admin')
    } else {
      return {
        ...prevState,
        fieldErrors: {
          ...prevState.fieldErrors,
          username: result
        }
      }
    }
  } catch (e) {
    if (typeof e === 'string') {
      console.log('e is string')
      // e.toUpperCase() // works, `e` narrowed to string
    } else if (e instanceof ZodError) {
      console.log('e is ZodError')
      // e.message // works, `e` narrowed to Error
    } else if (e instanceof Response) {
      console.log('e is Response')
      // e.message // works, `e` narrowed to Error
    } else {
      console.log('e is e')
    }
    // if (typeof e === 'object') {
    // if (instanceof e === ZodError) {

    // } else {
    // }
    // }
    // console.log(typeof e)
    return prevState
  }
}

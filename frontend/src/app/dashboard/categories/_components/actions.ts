'use server'

import { revalidatePath } from 'next/cache'

export async function revalidateCategory(alias: string) {
  console.log('revalidating category', `/(site)/category/${alias}`)
  revalidatePath(`/(site)/category/${alias}`, 'page')
}

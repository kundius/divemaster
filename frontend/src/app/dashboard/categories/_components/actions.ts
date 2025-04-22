'use server'

import { revalidatePath } from 'next/cache'

export async function revalidateCategory(alias: string) {
  revalidatePath(`/category/${alias}`)
}

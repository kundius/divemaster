'use server'

import { revalidatePath } from 'next/cache'

export default async function revalidateCategory(alias: string) {
  revalidatePath(`/category/${alias}`, 'page')
}

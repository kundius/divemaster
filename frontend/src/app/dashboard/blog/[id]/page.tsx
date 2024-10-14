import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { BlogPostEntity, PageProps } from '@/types'

import { BlogPostForm } from '../_components/BlogPostForm'
import { revalidatePath } from 'next/cache'

export default async function Page({ params }: PageProps<{ id: string }>) {
  const record = await apiGet<BlogPostEntity>(`blog/post/${params.id}`, {}, withServerAuth())
  return <BlogPostForm record={record} />
}

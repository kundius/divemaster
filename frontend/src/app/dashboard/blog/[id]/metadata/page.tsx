import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { BlogPostEntity, PageProps } from '@/types'

import { BlogPostMetadata } from '../../_components/BlogPostMetadata'

export default async function Page({ params }: PageProps<{ id: string }>) {
  const record = await apiGet<BlogPostEntity>(`blog/post/${params.id}`, {}, withServerAuth())
  return <BlogPostMetadata record={record} />
}

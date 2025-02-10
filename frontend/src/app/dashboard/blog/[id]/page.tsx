import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { BlogPostEntity, PageProps } from '@/types'
import { BlogPostForm } from '../_components/BlogPostForm'

export default async function Page({ params }: PageProps<{ id: string }>) {
  const { id } = await params
  const record = await apiGet<BlogPostEntity>(`blog/post/${id}`, {}, await withServerAuth())
  return <BlogPostForm record={record} />
}

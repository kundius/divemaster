import { apiGet } from '@/lib/api'
import { BlogPostEntity, PageProps } from '@/types'
import { BlogPostForm } from '../_components/BlogPostForm'

export default async function Page({ params }: PageProps<{ id: string }>) {
  const { id } = await params
  const record = await apiGet<BlogPostEntity>(`blog/post/${id}`)
  return <BlogPostForm record={record} />
}

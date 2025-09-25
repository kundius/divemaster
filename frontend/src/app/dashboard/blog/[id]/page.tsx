import { apiGet } from '@/lib/api'
import { BlogPostEntity, PageProps } from '@/types'
import { BlogPostUpdate } from '../_components/BlogPostUpdate'

export default async function Page({ params }: PageProps<{ id: string }>) {
  const { id } = await params
  const record = await apiGet<BlogPostEntity>(`blog/post/${id}`)
  return <BlogPostUpdate record={record} />
}

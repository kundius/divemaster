import { apiGet } from '@/lib/api'
import { BlogPostEntity, PageProps } from '@/types'
import { BlogPostMetadata } from '../../_components/BlogPostMetadata'

export default async function Page({ params }: PageProps<{ id: string }>) {
  const { id } = await params
  const record = await apiGet<BlogPostEntity>(`blog/post/${id}`)
  return <BlogPostMetadata record={record} />
}

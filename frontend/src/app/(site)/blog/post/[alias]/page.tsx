import { ClockIcon } from '@heroicons/react/24/outline'
import { Metadata } from 'next'

import { Headline } from '@/components/Headline'
import { Container } from '@/components/Container'
import { apiGet } from '@/lib/api'
import { getFileUrl } from '@/lib/utils'
import { BlogPostEntity, PageProps } from '@/types'

import { PostContent } from '../../_components/PostContent'
import { PostFooter } from '../../_components/PostFooter'
import { PostMeta } from '../../_components/PostMeta'
import { PostNeighbors } from '../../_components/PostNeighbors'
import { SectionPage } from '@/components/SectionPage'

export async function generateMetadata(props: PageProps<{ alias: string }>): Promise<Metadata> {
  const { alias } = await props.params
  const post = await apiGet<BlogPostEntity>(`blog/post/alias:${alias}`)
  const metadata = post.metadata || {}

  const title = metadata.title || post.longTitle || post.title
  const description = metadata.description || ''
  const keywords = metadata.keywords || ''

  const images = []
  if (post.image) images.push(getFileUrl(post.image))

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images
    }
  }
}

export const revalidate = 60

export default async function Page({ params }: PageProps<{ alias: string }>) {
  const { alias } = await params
  const post = await apiGet<BlogPostEntity>(`blog/post/alias:${alias}`)
  const neighbors = await apiGet<{ previous: BlogPostEntity; next: BlogPostEntity }>(
    `blog/post/${post.id}/neighbors`
  )
  return (
    <SectionPage withBreadcrumbs>
      <Headline
        title={post.longTitle || post.title}
        breadcrumbs={[
          { title: 'Главная', href: '/' },
          { title: 'Блог', href: '/blog' }
        ]}
        separator
      />
      <PostMeta record={post} />
      <div className="space-y-24 mt-8 max-md:space-y-16">
        <PostContent content={post.content || ''} />
        <PostFooter record={post} />
        <PostNeighbors previous={neighbors.previous} next={neighbors.next} />
      </div>
    </SectionPage>
  )
}

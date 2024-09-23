import { ClockIcon } from '@heroicons/react/24/outline'
import { Metadata } from 'next'

import { Headline } from '@/components/Headline'
import { Container } from '@/components/site/Container'
import { apiGet } from '@/lib/api'
import { getFileUrl } from '@/lib/utils'
import { BlogPostEntity, PageProps } from '@/types'

import { PostContent } from '../../_comoinents/PostContent'
import { PostFooter } from '../../_comoinents/PostFooter'
import { PostMeta } from '../../_comoinents/PostMeta'
import { PostNeighbors } from '../../_comoinents/PostNeighbors'

export async function generateMetadata(props: PageProps<{ alias: string }>): Promise<Metadata> {
  const post = await apiGet<BlogPostEntity>(`blog/post/alias:${props.params.alias}`)
  const metadata = post.metadata || {}

  let title = metadata.title || post.longTitle || post.title
  let description = metadata.description || ''
  let keywords = metadata.keywords || ''

  let images = []
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

export default async function Page({ params }: PageProps<{ alias: string }>) {
  const post = await apiGet<BlogPostEntity>(`blog/post/alias:${params.alias}`)
  const neighbors = await apiGet<{ previous: BlogPostEntity; next: BlogPostEntity }>(
    `blog/post/${post.id}/neighbors`
  )
  return (
    <div className="pt-12 pb-40 max-sm:pt-4 max-sm:pb-12">
      <Container>
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
      </Container>
    </div>
  )
}

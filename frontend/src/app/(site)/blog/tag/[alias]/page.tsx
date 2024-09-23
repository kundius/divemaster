import { BlogPostCard } from '@/components/BlogPostCard'
import { Metadata } from 'next'
import { Headline } from '@/components/Headline'
import { Container } from '@/components/site/Container'
import { Pagination } from '@/components/site/Pagination'
import { StaticPagination } from '@/components/site/StaticPagination'
import { Button } from '@/components/ui/button'
import { apiGet } from '@/lib/api'
import { BlogPostEntity, BlogTagEntity, FindAllResult, PageProps } from '@/types'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

export async function generateMetadata(props: PageProps<{ alias: string }>): Promise<Metadata> {
  const record = await apiGet<BlogTagEntity>(`blog/tag/alias:${props.params.alias}`)
  const metadata = record.metadata || {}

  let title = metadata.title || record.name
  let description = metadata.description || ''
  let keywords = metadata.keywords || ''

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description
    }
  }
}

export default async function Page({ params, searchParams }: PageProps<{ alias: string }>) {
  const tag = await apiGet<BlogTagEntity>(`blog/tag/alias:${params.alias}`)
  const limit = Number(searchParams.limit || 6)
  const page = Number(searchParams.page || 1)
  const posts = await apiGet<FindAllResult<BlogPostEntity>>('blog/post', {
    page,
    limit,
    tags: [tag.name]
  })
  return (
    <div className="pt-12 pb-40 max-sm:pt-4 max-sm:pb-12">
      <Container>
        <Headline
          className="mb-8"
          title={tag.name}
          breadcrumbs={[
            { title: 'Главная', href: '/' },
            { title: 'Блог', href: '/blog' }
          ]}
          actions={
            <Button variant="outline" className="flex items-center gap-12 max-sm:gap-4">
              Все теги <ChevronDownIcon className="w-4 h-4" />
            </Button>
          }
          separator
        />
        <div className="grid grid-cols-3 gap-x-5 gap-y-24 max-lg:grid-cols-2 max-sm:gap-x-4 max-sm:gap-y-12">
          {posts.rows.map((post) => (
            <BlogPostCard record={post} key={post.id} />
          ))}
          {posts.total > limit && (
            <div className="col-span-3 flex justify-end max-lg:col-span-2">
              <StaticPagination
                limit={limit}
                total={posts.total}
                page={page}
                baseUrl={`/blog/tag/${tag.alias}`}
                searchParams={searchParams}
              />
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}

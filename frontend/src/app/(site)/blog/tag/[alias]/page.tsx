import { BlogPostCard } from '@/components/BlogPostCard'
import { Metadata } from 'next'
import { Headline } from '@/components/Headline'
import { Container } from '@/components/Container'
import { Pagination } from '@/components/Pagination'
import { StaticPagination } from '@/components/StaticPagination'
import { Button } from '@/components/ui/button'
import { apiGet } from '@/lib/api'
import { BlogPostEntity, BlogTagEntity, FindAllResult, PageProps } from '@/types'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { SectionPage } from '@/components/SectionPage'

export async function generateMetadata({
  params
}: PageProps<{ alias: string }>): Promise<Metadata> {
  const { alias } = await params
  const record = await apiGet<BlogTagEntity>(`blog/tag/alias:${alias}`)
  const metadata = record.metadata || {}

  const title = metadata.title || record.name
  const description = metadata.description || ''
  const keywords = metadata.keywords || ''

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

export const revalidate = 60

export default async function Page({ params, searchParams }: PageProps<{ alias: string }>) {
  const { alias } = await params
  const _searchParams = await searchParams
  const tag = await apiGet<BlogTagEntity>(`blog/tag/alias:${alias}`)
  const limit = Number(_searchParams.limit || 6)
  const page = Number(_searchParams.page || 1)
  const posts = await apiGet<FindAllResult<BlogPostEntity>>('blog/post', {
    page,
    limit,
    tags: [tag.name]
  })
  return (
    <SectionPage withBreadcrumbs>
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
              searchParams={_searchParams}
            />
          </div>
        )}
      </div>
    </SectionPage>
  )
}

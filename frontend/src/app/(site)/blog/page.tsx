import { BlogPostCard } from '@/components/BlogPostCard'
import { Headline } from '@/components/Headline'
import { SectionPage } from '@/components/SectionPage'
import { Container } from '@/components/site/Container'
import { Pagination } from '@/components/site/Pagination'
import { StaticPagination } from '@/components/site/StaticPagination'
import { Button } from '@/components/ui/button'
import { apiGet } from '@/lib/api'
import { BlogPostEntity, FindAllResult, PageProps } from '@/types'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

export default async function Page({ searchParams }: PageProps) {
  const limit = Number(searchParams.limit || 6)
  const page = Number(searchParams.page || 1)
  const posts = await apiGet<FindAllResult<BlogPostEntity>>('blog/post', {
    page,
    limit
  })
  return (
    <SectionPage withBreadcrumbs>
      <Headline
        className="mb-8"
        title="Блог"
        breadcrumbs={[{ title: 'Главная', href: '/' }]}
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
              baseUrl="/blog"
              searchParams={searchParams}
            />
          </div>
        )}
      </div>
    </SectionPage>
  )
}

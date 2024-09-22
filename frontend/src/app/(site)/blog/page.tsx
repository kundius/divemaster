import { BlogPostCard } from '@/components/BlogPostCard'
import { Headline } from '@/components/Headline'
import { Container } from '@/components/site/Container'
import { Pagination } from '@/components/site/Pagination'
import { StaticPagination } from '@/components/site/StaticPagination'
import { apiGet } from '@/lib/api'
import { BlogPostEntity, FindAllResult, PageProps } from '@/types'
import { redirect } from 'next/navigation'

export default async function Page({ searchParams }: PageProps) {
  const limit = Number(searchParams.limit || 6)
  const page = Number(searchParams.page || 1)
  const posts = await apiGet<FindAllResult<BlogPostEntity>>('blog/post', {
    page,
    limit
  })

  const paginationHandler = async (page: number, limit: number) => {
    'use server'

    let url = '/blog'
    if (page !== 1) {
      url = url + `?page=${page}`
    }
    redirect(url)
  }

  return (
    <div className="pt-12 pb-40">
      <Container>
        <Headline
          className="mb-8"
          title="Блог"
          breadcrumbs={[{ title: 'Главная', href: '/' }]}
          separator
        />
        <div className="grid grid-cols-3 gap-x-5 gap-y-24">
          {posts.rows.map((post) => (
            <BlogPostCard record={post} key={post.id} />
          ))}
          <div className="col-span-3 flex justify-end">
            <StaticPagination
              limit={limit}
              total={posts.total}
              page={page}
              baseUrl="/blog"
              searchParams={searchParams}
            />
          </div>
        </div>
      </Container>
    </div>
  )
}

import { PageProps } from '@/types'
import { OptionCategories } from '../../_components/OptionCategories'

export default async function Page({ params }: PageProps<{ id: number }>) {
  const { id } = await params
  return <OptionCategories optionId={id} />
}

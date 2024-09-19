import { OptionCategories } from '../../_components/OptionCategories'

export default async function Page({ params }: { params: { id: number } }) {
  return <OptionCategories optionId={params.id} />
}

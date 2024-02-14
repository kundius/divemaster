import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PageHeader } from '@/components/admin/PageHeader'

export async function CreateProductPage() {
  return (
    <div>
      <PageHeader
        title="Добавить товар"
        actions={[
          <Link href="/admin/products" key="cancel">
            <Button variant="secondary">Отмена</Button>
          </Link>,
          <Button key="save">Сохранить</Button>
        ]}
      />

      <div className="rounded-md border">form</div>
    </div>
  )
}

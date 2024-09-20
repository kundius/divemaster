import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h1 className="mb-4 text-4xl font-bold tracking-tight">Ошибка 404</h1>
      <p className="text-md mb-8">Запрашиваемый ресурс не найден.</p>
      <Link href="/dashboard" prefetch={false}>
        <Button>Панель управления</Button>
      </Link>
    </div>
  )
}

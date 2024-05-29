export interface CategoryCardProps {
  title: string
  href: string
  image?: string
}

export function CategoryCard({ title, href, image }:CategoryCardProps) {
  return (
    <div>
      {title}
    </div>
  )
}

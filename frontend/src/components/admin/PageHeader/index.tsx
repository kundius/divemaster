import { Button, ButtonProps } from '@/components/ui/button'
import Link from 'next/link'

type ActionType = Omit<ButtonProps, 'title'> & {
  title: string
  route?: string
}

export interface PageHeaderProps {
  title: string
  actions?: ActionType[]
}

const renderAction = ({ title, route, ...props }: ActionType, i: number) => {
  const button = (
    <Button {...props} key={i}>
      {title}
    </Button>
  )

  if (route) {
    return (
      <Link href={route} key={i}>
        {button}
      </Link>
    )
  }

  return button
}

export function PageHeader({ title, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">{title}</h1>
      {actions && (
        <div className="flex items-center flex-wrap gap-3">{actions.map(renderAction)}</div>
      )}
    </div>
  )
}

import { Button, ButtonProps } from '@/components/ui/button'
import Link from 'next/link'
import { ReactNode } from 'react'

type ActionTypeObj = Omit<ButtonProps, 'title'> & {
  title: string
  route?: string
}

type ActionType = ActionTypeObj | ReactNode

export interface PageHeaderProps {
  title: string
  actions?: ActionType[]
}

const renderAction = (action: ActionType, i: number) => {
  if (typeof action === 'object' && !!action && 'title' in action) {
    const { title, route, ...props } = action
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
  return action
}

export function PageHeader({ title, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
      <h1 className="scroll-m-20 text-3xl font-medium tracking-tight">{title}</h1>
      {actions && (
        <div className="flex items-center flex-wrap gap-3">{actions.map(renderAction)}</div>
      )}
    </div>
  )
}

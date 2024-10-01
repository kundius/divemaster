import { PropsWithChildren, ReactNode } from 'react'

import css from './Group.module.scss'

export function Group({
  icon,
  title,
  children
}: PropsWithChildren<{ icon: ReactNode; title: string }>) {
  return (
    <div className={css.group}>
      <div className={css.icon}>{icon}</div>
      <div className={css.body}>
        <div className={css.title}>{title}</div>
        <div className={css.content}>{children}</div>
      </div>
    </div>
  )
}

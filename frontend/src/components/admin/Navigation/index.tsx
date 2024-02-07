'use client'

import {
  TagIcon,
  ShoppingBagIcon,
  UserIcon,
  PencilSquareIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'
import styles from './styles.module.scss'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import React from 'react'

interface ItemProps {
  href: string
  title: string
  icon?: React.ForwardRefExoticComponent<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>>>
}

function Item({ href, title, icon: Icon }: ItemProps) {
  const pathname = usePathname()
  return (
    <li className={styles.item}>
      <Link
        href={href}
        className={cn(styles.link, {
          [styles.linkActive]: pathname.startsWith(href)
        })}
      >
        {Icon && <Icon className={styles.linkIcon} />}
        {title}
      </Link>
    </li>
  )
}

export function Navigation({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  return (
    <div className={cn(styles.wrapper, styles[variant])}>
      <div className={styles.group}>
        <ul className={styles.list}>
          <Item href="/admin/products" title="Товары" icon={TagIcon} />
          <Item href="/admin/orders" title="Заказы" icon={ShoppingBagIcon} />
          <Item href="/admin/clients" title="Клиенты" icon={UserIcon} />
        </ul>
      </div>
      <div className={styles.group}>
        <div className={styles.title}>Контент</div>
        <ul className={styles.list}>
          <Item href="/admin/articles" title="Статьи" icon={PencilSquareIcon} />
          <Item href="/admin/pages" title="Страницы" icon={DocumentTextIcon} />
        </ul>
      </div>
    </div>
  )
}

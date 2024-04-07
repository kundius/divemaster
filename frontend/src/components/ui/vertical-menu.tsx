'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import {
  Dispatch,
  PropsWithChildren,
  RefObject,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState
} from 'react'
import styles from './vertical-menu.module.scss'

const RootContext = createContext<{
  active: string | null
  setActive: Dispatch<SetStateAction<string | null>>
  scrollIntoView: boolean
} | null>(null)

const ItemContext = createContext<{
  name: string
  ref: RefObject<HTMLDivElement>
} | null>(null)

interface VerticalMenuProps {
  defaultActive?: string
  scrollIntoView?: boolean
}

export function VerticalMenu({
  children,
  defaultActive,
  scrollIntoView = true
}: PropsWithChildren<VerticalMenuProps>) {
  const [active, setActive] = useState(defaultActive || null)
  return (
    <RootContext.Provider value={{ active, setActive, scrollIntoView }}>
      <div className={styles.root}>{children}</div>
    </RootContext.Provider>
  )
}

interface VerticalMenuListProps {}

export function VerticalMenuList({ children }: PropsWithChildren<VerticalMenuListProps>) {
  const contentRef = useRef<HTMLDivElement>(null)

  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      const { height } = contentRef.current.getBoundingClientRect()
      setHeight(height)
    }
  }, [])

  const style = { '--list-content-height': `${height}px` } as React.CSSProperties

  return (
    <div className={styles.list} style={style}>
      <div className={styles['list-content']} ref={contentRef}>
        {children}
      </div>
    </div>
  )
}

interface VerticalMenuItemProps {
  name?: string
}

export function VerticalMenuItem({ children, name }: PropsWithChildren<VerticalMenuItemProps>) {
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()
  const rootContext = useContext(RootContext)

  const getName = () => {
    return name || id
  }

  return (
    <ItemContext.Provider value={{ name: getName(), ref }}>
      <div
        className={cn(styles.item, {
          [styles.active]: rootContext?.active === getName()
        })}
        ref={ref}
      >
        {children}
      </div>
    </ItemContext.Provider>
  )
}

interface VerticalMenuTriggerProps {
  href?: string
}

export function VerticalMenuTrigger({
  children,
  href
}: PropsWithChildren<VerticalMenuTriggerProps>) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rootContext = useContext(RootContext)
  const itemContext = useContext(ItemContext)

  const handleClick = () => {
    if (!rootContext || !itemContext) return

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    if (rootContext.active === itemContext.name) {
      rootContext.setActive(null)
    } else {
      rootContext.setActive(itemContext.name)

      if (rootContext.scrollIntoView) {
        timerRef.current = setTimeout(() => {
          if (itemContext.ref.current) {
            itemContext.ref.current.scrollIntoView({
              behavior: 'smooth'
            })
          }
        }, 500)
      }
    }
  }

  if (href) {
    return (
      <Link href={href} className={styles.trigger}>
        {children}
      </Link>
    )
  }

  return (
    <button className={styles.trigger} onClick={handleClick}>
      {children}
    </button>
  )
}

export function VerticalMenuArrow() {
  return <div className={styles.arrow} />
}

'use client'

import { cn } from '@/lib/utils'
import Link, { LinkProps } from 'next/link'
import {
  Dispatch,
  MouseEvent,
  MouseEventHandler,
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
import styles from './vertical-menu.module.css'

interface TRootContext {
  active: string | null
  setActive: Dispatch<SetStateAction<string | null>>
  scrollIntoView: boolean
  onNavigate?: LinkProps['onNavigate']
}

const RootContext = createContext<TRootContext | undefined>(undefined)

const useRootContext = () => {
  const context = useContext(RootContext)

  if (!context) {
    throw new Error(`useRootContext must be used within RootContext`)
  }

  return context
}

interface TItemContext {
  name: string
  isParent: boolean
  setIsParent: (value: boolean) => void
  ref: RefObject<HTMLDivElement | null>
}

const ItemContext = createContext<TItemContext | undefined>(undefined)

function useItemContext(o: true): TItemContext | undefined
function useItemContext(o: false): TItemContext
function useItemContext(optional: boolean) {
  const context = useContext(ItemContext)

  if (!context && !optional) {
    throw new Error(`useRootContext must be used within RootContext`)
  }

  return context
}

interface VerticalMenuProps {
  defaultActive?: string
  scrollIntoView?: boolean
  onNavigate?: LinkProps['onNavigate']
}

export function VerticalMenu({
  children,
  defaultActive,
  onNavigate,
  scrollIntoView = true
}: PropsWithChildren<VerticalMenuProps>) {
  const [active, setActive] = useState(defaultActive || null)
  return (
    <RootContext.Provider value={{ active, setActive, scrollIntoView, onNavigate }}>
      <div className={styles.root}>{children}</div>
    </RootContext.Provider>
  )
}

export function VerticalMenuList({ children }: PropsWithChildren) {
  const itemContext = useItemContext(true)
  const contentRef = useRef<HTMLDivElement>(null)

  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      const { height } = contentRef.current.getBoundingClientRect()
      setHeight(height)
    }
    itemContext?.setIsParent(true)
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
  const rootContext = useRootContext()
  const [isParent, setIsParent] = useState(false)

  const getName = () => {
    return name || id
  }

  return (
    <ItemContext.Provider value={{ name: getName(), ref, isParent, setIsParent }}>
      <div
        className={cn(styles.item, {
          [styles.active]: rootContext.active === getName()
        })}
        ref={ref}
      >
        {children}
      </div>
    </ItemContext.Provider>
  )
}

interface VerticalMenuLinkProps {
  href?: string
  onClick?: (event: MouseEvent) => void
}

export function VerticalMenuLink({
  children,
  href,
  onClick
}: PropsWithChildren<VerticalMenuLinkProps>) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rootContext = useRootContext()
  const itemContext = useItemContext(false)

  const linkHandler: MouseEventHandler = (e) => {
    if (!itemContext.isParent) return

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    if (rootContext.active != itemContext.name) {
      // предотвращаем срабатывание ссылки
      e.preventDefault()

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

  const toggleHandler: MouseEventHandler = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    if (rootContext.active != itemContext.name) {
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
    } else {
      rootContext.setActive(null)
    }
  }

  if (href) {
    return (
      <div className={styles.link}>
        <Link
          href={href}
          className={styles.linkButton}
          onClick={onClick ?? linkHandler}
          onNavigate={rootContext.onNavigate}
        >
          <span className={styles.linkContent}>{children}</span>
        </Link>
        {itemContext.isParent && <button className={styles.linkArrow} onClick={toggleHandler} />}
      </div>
    )
  }

  return (
    <div className={styles.link}>
      <button className={styles.linkButton} onClick={onClick ?? toggleHandler}>
        <span className={styles.linkContent}>{children}</span>
      </button>
      {itemContext.isParent && <button className={styles.linkArrow} onClick={toggleHandler} />}
    </div>
  )
}

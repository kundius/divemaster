import { PropsWithChildren } from 'react'

export interface OverlayProps {
  show?: boolean
}

export function Overlay({ children, show = false }: PropsWithChildren<OverlayProps>) {
  return (
    <div className="relative">
      {children}
      {show && (
        <div className="absolute z-10 left-0 right-0 top-0 bottom-0 opacity-50 bg-white"></div>
      )}
    </div>
  )
}

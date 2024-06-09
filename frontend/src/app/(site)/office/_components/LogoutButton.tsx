'use client'

import { useAuth } from '@/lib/auth/use-auth'
import React from 'react'

export interface LogoutButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {}

const LogoutButton = React.forwardRef<HTMLButtonElement, LogoutButtonProps>(
  ({ children, ...props }, ref) => {
    const { logout } = useAuth()
    return (
      <button onClick={logout} ref={ref} {...props}>
        {children}
      </button>
    )
  }
)
LogoutButton.displayName = 'LogoutButton'

export { LogoutButton }

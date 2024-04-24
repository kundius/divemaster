import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import styles from './index.module.scss'

const buttonVariants = cva(styles.button, {
  variants: {
    size: {
      default: styles.sizeDefault
    }
  },
  defaultVariants: {
    size: 'default'
  }
})

export interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ className, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ size, className }))} ref={ref} {...props}>
        {children}
      </Comp>
    )
  }
)
PrimaryButton.displayName = 'PrimaryButton'

const PrimaryButtonArrow = () => <span className={styles.arrow} />

export { PrimaryButton, PrimaryButtonArrow, buttonVariants }

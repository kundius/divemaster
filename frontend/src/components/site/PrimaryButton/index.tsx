import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import styles from './index.module.scss'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

const buttonVariants = cva(styles.button, {
  variants: {
    size: {
      default: styles.sizeDefault,
      sm: styles.sizeSmall
    },
    variant: {
      default: styles.variantDefault,
      outline: styles.variantOutline
    }
  },
  defaultVariants: {
    size: 'default',
    variant: 'default'
  }
})

export interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ className, size, variant, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ size, variant, className }))} ref={ref} {...props}>
        {children}
      </Comp>
    )
  }
)
PrimaryButton.displayName = 'PrimaryButton'

const PrimaryButtonArrow = () => <span className={styles.arrow} />

const PrimaryButtonSpinner = () => <ArrowPathIcon className="-ml-2 h-5 w-5 animate-spin" />

export { PrimaryButton, PrimaryButtonArrow, PrimaryButtonSpinner, buttonVariants }

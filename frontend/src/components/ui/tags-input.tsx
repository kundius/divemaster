import ReactTagsInput, { ReactTagsInputProps, TagProps } from 'react-tagsinput'
import styles from './tags-input.module.scss'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface TagsInputProps extends ReactTagsInputProps {
  placeholder?: string
}

export const TagsInput = forwardRef(function TagsInputForwarded(
  props: TagsInputProps,
  ref: ReactTagsInputProps['ref']
) {
  const {
    className,
    focusedClassName,
    tagProps,
    inputProps,
    placeholder = '',
    ...otherProps
  } = props

  return (
    <ReactTagsInput
      {...otherProps}
      className={cn(className, styles['react-tagsinput'], {
        ['react-tagsinput--disabled']: otherProps.disabled
      })}
      focusedClassName={cn(focusedClassName, styles['react-tagsinput--focused'])}
      tagProps={{
        ...tagProps,
        className: cn(tagProps?.className, styles['react-tagsinput-tag']),
        classNameRemove: cn(tagProps?.classNameRemove, styles['react-tagsinput-remove'])
      }}
      inputProps={{
        ...inputProps,
        className: cn(inputProps?.className, styles['react-tagsinput-input']),
        placeholder
      }}
      ref={ref}
    />
  )
})

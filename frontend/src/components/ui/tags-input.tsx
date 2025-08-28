// import ReactTagsInput, { ReactTagsInputProps, TagProps } from 'react-tagsinput'
// import styles from './tags-input.module.css'
// import { cn } from '@/lib/utils'
// import { forwardRef, useEffect, useRef, useState } from 'react'
// import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from './popover'
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList
// } from './command'
// import { CheckIcon } from '@heroicons/react/24/outline'

// interface TagsInputProps extends ReactTagsInputProps {
//   placeholder?: string
//   suggestions?: string[]
// }

// // TODO: переместить поповер выше, адд тег брать из рефа
// // вместо пропса предложений сделать функцию гет предложения
// // показывать поповер если есть предложения
// // стрелки вверх и вниз должны работать

// export const TagsInput = (props: TagsInputProps) => {
//   const {
//     className,
//     focusedClassName,
//     tagProps,
//     inputProps,
//     placeholder = '',
//     suggestions = [],
//     ...otherProps
//   } = props

//   const tagsinputRef = useRef<ReactTagsInput<string> | null>(null)
//   const [inputValue, setInputValue] = useState('')
//   const [suggestionsOpen, setSuggestionsOpen] = useState(false)
//   const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
//   const [width, setWidth] = useState(200)
//   const boundaryRef = useRef<HTMLDivElement>(null)

//   // Рассчитать ширину поповера относительно кнопки
//   const resizeHandler = () => {
//     if (!boundaryRef.current) return
//     const { width } = boundaryRef.current.getBoundingClientRect()
//     setWidth(width)
//   }
//   useEffect(() => {
//     window.addEventListener('resize', resizeHandler)
//     resizeHandler()
//     return () => {
//       window.removeEventListener('resize', resizeHandler)
//     }
//   }, [])

//   const changeInputHandler = (value: string) => {
//     if (!!value) {
//       const filtered = suggestions.filter(
//         (suggestion) =>
//           suggestion.toLowerCase().startsWith(inputValue.toLowerCase()) &&
//           !value.includes(suggestion)
//       )
//       setFilteredSuggestions(filtered)
//       setSuggestionsOpen(filtered.length > 0)
//     } else {
//       setSuggestionsOpen(false)
//       setFilteredSuggestions([])
//     }
//     setInputValue(value)
//   }

//   return (
//     <div ref={boundaryRef}>
//       {/* {suggestions
//           .filter((suggestion) => suggestion.toLowerCase().startsWith(inputValue.toLowerCase()))
//           .map((suggestion) => (
//             <div key={suggestion}>{suggestion}</div>
//           ))} */}
//       <Popover open={suggestionsOpen} onOpenChange={setSuggestionsOpen}>
//         <PopoverAnchor asChild>
//           <div>
//             <ReactTagsInput
//               {...otherProps}
//               // renderInput={defaultRenderInput}
//               onlyUnique
//               inputValue={inputValue}
//               onChangeInput={changeInputHandler}
//               className={cn(className, styles['react-tagsinput'], {
//                 ['react-tagsinput--disabled']: otherProps.disabled
//               })}
//               focusedClassName={cn(focusedClassName, styles['react-tagsinput--focused'])}
//               tagProps={{
//                 ...tagProps,
//                 className: cn(tagProps?.className, styles['react-tagsinput-tag']),
//                 classNameRemove: cn(tagProps?.classNameRemove, styles['react-tagsinput-remove'])
//               }}
//               inputProps={{
//                 ...inputProps,
//                 className: cn(inputProps?.className, styles['react-tagsinput-input']),
//                 placeholder
//               }}
//               ref={tagsinputRef}
//             />
//           </div>
//         </PopoverAnchor>
//         <PopoverContent
//           className="p-0"
//           onOpenAutoFocus={(e) => {
//             e.preventDefault()
//           }}
//           onCloseAutoFocus={(e) => {
//             tagsinputRef.current?.focus()
//             e.preventDefault()
//           }}
//           style={{ width }}
//         >
//           <Command>
//             <CommandList>
//               <CommandEmpty>Not found.</CommandEmpty>
//               <CommandGroup>
//                 {filteredSuggestions.map((suggestion) => (
//                   <CommandItem
//                     key={suggestion}
//                     value={suggestion}
//                     onSelect={(currentValue) => {
//                       tagsinputRef.current?.addTag(currentValue)
//                       setInputValue('')
//                       setSuggestionsOpen(false)
//                     }}
//                   >
//                     {suggestion}
//                   </CommandItem>
//                 ))}
//               </CommandGroup>
//             </CommandList>
//           </Command>
//         </PopoverContent>
//       </Popover>
//     </div>
//   )
// }
import ReactTagsInput, { ReactTagsInputProps, TagProps } from 'react-tagsinput'
import styles from './tags-input.module.css'
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

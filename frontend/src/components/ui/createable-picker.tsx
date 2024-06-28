import { cn } from '@/lib/utils'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useCombobox, useMultipleSelection } from 'downshift'
import { matchSorter } from 'match-sorter'
import { ReactNode, useMemo, useRef, useState } from 'react'
import styles from './createable-picker.module.scss'
import { Popover, PopoverAnchor, PopoverContent } from './popover'
import { useElementSize } from '@reactuses/core'

export interface CreateablePickerItem {
  value: string
  label: ReactNode
}

export interface CreateablePickerProps {
  options: CreateablePickerItem[]
  value: CreateablePickerItem[]
  onChange: (value: CreateablePickerItem[]) => void
  placeholder?: string
}

function filterItems(availableItems: CreateablePickerItem[], selectedItems: CreateablePickerItem[], inputValue: string) {
  const availableItemValues = availableItems.map((item) => item.value)
  const selectedItemValues = selectedItems.map((item) => item.value)

  const array = matchSorter(
    availableItems.filter((item) => !selectedItemValues.includes(item.value)),
    inputValue,
    { keys: ['value', 'label'] }
  )

  if (!!inputValue && !availableItemValues.includes(inputValue)) {
    array.unshift({ label: `Добавить "${inputValue}"`, value: inputValue })
  }

  return array
}

export function CreateablePicker({
  options = [],
  value: selectedItems,
  onChange: setSelectedItems,
  placeholder
}: CreateablePickerProps) {
  const [inputValue, setInputValue] = useState('')
  const items = useMemo(
    () => filterItems(options, selectedItems, inputValue),
    [options, selectedItems, inputValue]
  )
  const { getSelectedItemProps, getDropdownProps, removeSelectedItem } = useMultipleSelection({
    selectedItems,
    onStateChange({ selectedItems: newSelectedItems, type }) {
      switch (type) {
        case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace:
        case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
        case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
        case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
          setSelectedItems(newSelectedItems || [])
          break
        default:
          break
      }
    }
  })
  const {
    isOpen,
    toggleMenu,
    openMenu,
    closeMenu,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem
  } = useCombobox({
    items,
    itemToString(item) {
      return item ? item.value : ''
    },
    defaultHighlightedIndex: 0, // after selection, highlight the first item.
    selectedItem: null,
    inputValue,
    stateReducer(state, actionAndChanges) {
      const { changes, type } = actionAndChanges

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: true, // keep the menu open after selection.
            highlightedIndex: 0 // with the first option highlighted.
          }
        default:
          return changes
      }
    },
    onStateChange({ inputValue: newInputValue, type, selectedItem: newSelectedItem }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (newSelectedItem) {
            setSelectedItems([...selectedItems, newSelectedItem])
            setInputValue('')
          }
          break

        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(newInputValue || '')

          break
        default:
          break
      }
    }
  })

  const fieldRef = useRef<HTMLDivElement>(null)

  const [width] = useElementSize(fieldRef, { box: 'border-box' })

  return (
    <div>
      <Popover
        open={isOpen && items.length > 0}
        onOpenChange={(on) => (on ? openMenu() : closeMenu())}
      >
        <PopoverAnchor asChild>
          <div
            ref={fieldRef}
            className={cn(
              styles.field,
              'flex min-h-9 gap-1 items-center flex-wrap rounded-md border bg-white p-1 shadow-sm'
            )}
          >
            {selectedItems.map(function renderSelectedItem(selectedItemForRender, index) {
              console.log(selectedItemForRender)
              return (
                <div
                  className={styles.tag}
                  key={`selected-item-${index}`}
                  {...getSelectedItemProps({
                    selectedItem: selectedItemForRender,
                    index
                  })}
                >
                  {selectedItemForRender.label}
                  <div
                    className={styles.tagRemove}
                    onClick={(e) => {
                      e.stopPropagation()
                      removeSelectedItem(selectedItemForRender)
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                    </svg>
                  </div>
                </div>
              )
            })}
            <div className="flex grow">
              <input
                placeholder={placeholder}
                className={styles.input}
                {...getInputProps(getDropdownProps())}
              />
            </div>
          </div>
        </PopoverAnchor>
        <PopoverContent
          className="p-1"
          style={{ width }}
          onOpenAutoFocus={(e) => {
            e.preventDefault()
          }}
          onCloseAutoFocus={(e) => {
            e.preventDefault()
          }}
        >
          <ul {...getMenuProps({}, { suppressRefError: true })}>
            {items.map((item, index) => (
              <li
                className={cn(
                  highlightedIndex === index && 'bg-accent text-accent-foreground',
                  'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none'
                )}
                key={`${item.value}${index}`}
                {...getItemProps({ item, index })}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  )
}

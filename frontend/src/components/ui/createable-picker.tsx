import { cn } from '@/lib/utils'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useCombobox, useMultipleSelection } from 'downshift'
import { matchSorter } from 'match-sorter'
import { useMemo, useState } from 'react'
import styles from './createable-picker.module.scss'

interface Item {
  value: string
  label: string
}

export interface CreateablePickerProps {
  options: Item[]
  value: Item[]
  onChange: (value: Item[]) => void
  placeholder?: string
}

function filterItems(availableItems: Item[], selectedItems: Item[], inputValue: string) {
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

  return (
    <div>
        <div className={cn(styles.field, "flex min-h-9 gap-1 items-center flex-wrap rounded-md border bg-white p-1 shadow-sm")}>
          {selectedItems.map(function renderSelectedItem(selectedItemForRender, index) {
            return (
              <span
                className={styles.tag}
                key={`selected-item-${index}`}
                {...getSelectedItemProps({
                  selectedItem: selectedItemForRender,
                  index
                })}
              >
                {selectedItemForRender.label}
                <span
                  className={styles.tagRemove}
                  onClick={(e) => {
                    e.stopPropagation()
                    removeSelectedItem(selectedItemForRender)
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                  </svg>
                </span>
              </span>
            )
          })}
          <div className="flex grow">
            <input
              placeholder={placeholder}
              className={styles.input}
              // className={cn(styles.input, "px-2 text-sm h-8 -mt-1 -mb-1 min-w-0 w-12 grow")}
              {...getInputProps(
                getDropdownProps({
                  // preventKeyAction: isOpen
                })
              )}
            />
            {/* <button
              aria-label="toggle menu"
              className="px-2"
              type="button"
              {...getToggleButtonProps()}
            >
              &#8595;
            </button> */}
          </div>
        </div>
      <ul
        className={`absolute w-inherit bg-white mt-1 shadow-md max-h-80 overflow-scroll p-0 z-10 ${
          !(isOpen && items.length) && 'hidden'
        }`}
        {...getMenuProps()}
      >
        {isOpen &&
          items.map((item, index) => (
            <li
              className={cn(
                highlightedIndex === index && 'bg-blue-300',
                selectedItem === item && 'font-bold',
                'py-2 px-3 shadow-sm flex flex-col'
              )}
              key={`${item.value}${index}`}
              {...getItemProps({ item, index })}
            >
              <span>{item.label}</span>
            </li>
          ))}
      </ul>
    </div>
  )
}

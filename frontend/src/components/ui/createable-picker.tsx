import { cn } from '@/lib/utils'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import {
  UseMultipleSelectionSelectedItemsChange,
  useCombobox,
  useMultipleSelection
} from 'downshift'
import { matchSorter } from 'match-sorter'
import React, { useEffect } from 'react'
import Highlighter from 'react-highlight-words'
import { usePopper } from 'react-popper'
import { useDeepCompareEffect } from 'react-use'

function defaultOptionFilterFunc(items: Item[], inputValue: string) {
  return matchSorter(items, inputValue, { keys: ['value', 'label'] })
}

function defaultItemRenderer(selected: Item) {
  return selected.label
}

interface Item {
  value: string
  label: string
}

export interface CreateablePickerProps {
  items: Item[]
  optionFilterFunc?: (items: Item[], inputValue: string) => Item[]
  itemRenderer?: (selected: Item) => string
  placeholder?: string
  onCreateItem?: (value: Item) => void
  selectedItems?: Item[]
  onSelectedItemsChange?:
    | ((changes: UseMultipleSelectionSelectedItemsChange<Item>) => void)
    | undefined
}

export function CreateablePicker(props: CreateablePickerProps) {
  const {
    items,
    optionFilterFunc = defaultOptionFilterFunc,
    itemRenderer = defaultItemRenderer,
    placeholder,
    onCreateItem,
    selectedItems = [],
    ...downshiftProps
  } = props

  const [isCreating, setIsCreating] = React.useState(false)
  const [inputItems, setInputItems] = React.useState(items)
  // const disclosureRef = React.useRef(null)
  // const popoverRef = React.useRef(null)
  // const { styles, attributes, forceUpdate } = usePopper(disclosureRef.current, popoverRef.current, {
  //   placement: 'bottom-start',
  //   modifiers: [
  //     {
  //       name: 'offset',
  //       options: {
  //         offset: [0, 8]
  //       }
  //     }
  //   ]
  // })

  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    activeIndex
  } = useMultipleSelection({
    ...downshiftProps,
    selectedItems,
    stateReducer: (_, actionAndChanges) => {
      const { type, changes } = actionAndChanges
      switch (type) {
        case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
          console.log(type, changes)
          return {
            ...changes,
            activeIndex: undefined
          }
        default:
          return changes
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
    openMenu,
    selectItem,
    setHighlightedIndex,
    inputValue
  } = useCombobox({
    selectedItem: null,
    items: inputItems,
    onInputValueChange: ({ inputValue }) => {
      const filteredItems = optionFilterFunc(items, inputValue || '')

      if (isCreating && filteredItems.length > 0) {
        setIsCreating(false)
      }

      setInputItems(filteredItems)
    },
    stateReducer: (state, actionAndChanges) => {
      const { changes, type } = actionAndChanges
      switch (type) {
        case useCombobox.stateChangeTypes.InputBlur:
          return {
            ...changes,
            highlightedIndex: state.highlightedIndex,
            inputValue: ''
          }
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            highlightedIndex: state.highlightedIndex,
            isOpen: true,
            inputValue: ''
          }
        default:
          return changes
      }
    },
    onStateChange: ({ type, selectedItem }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          if (selectedItem) {
            if (selectedItemValues.includes(selectedItem.value)) {
              setTimeout(() => {
                console.log('remove')
                removeSelectedItem(selectedItem)
              }, 1000)
            } else {
              if (onCreateItem && isCreating) {
                onCreateItem(selectedItem)
                setIsCreating(false)
                setInputItems(items)
              } else {
                addSelectedItem(selectedItem)
              }
            }

            selectItem(null)
          }
          break
        default:
          break
      }
    }
  })

  useEffect(() => {
    if (inputItems.length === 0 && activeIndex === -1 && inputValue.length > 0) {
      setIsCreating(true)
      setInputItems([{ label: `${inputValue}`, value: inputValue }])
      setHighlightedIndex(0)
    }
  }, [inputItems, setIsCreating, setHighlightedIndex, inputValue, activeIndex])

  useDeepCompareEffect(() => {
    setInputItems(items)
  }, [items])

  // useEffect(() => {
  //   if (selectedItems && forceUpdate) {
  //     forceUpdate()
  //   }
  // }, [selectedItems, forceUpdate])

  const selectedItemValues = selectedItems.map((item) => item.value)

  return (
    <div className="relative w-full">
      <div>
        <div className="my-2">
          {selectedItems.map((selectedItem, index) => (
            <span
              key={`selected-item-${index}`}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium leading-4 bg-indigo-100 text-indigo-800 focus:outline-none focus:shadow-outline mr-2"
              {...getSelectedItemProps({ selectedItem, index })}
            >
              {selectedItem.label}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeSelectedItem(selectedItem)
                }}
                type="button"
                className="flex-shrink-0 ml-1 inline-flex text-indigo-500 focus:outline-none focus:text-indigo-700"
                aria-label="Remove small badge"
              >
                &#10005;
              </button>
            </span>
          ))}
        </div>
        <div className="relative">
          <input
            {...getInputProps(
              getDropdownProps({
                className:
                  'w-full p-2 text-sm focus:outline-none focus:shadow-outline rounded border border-gray-400',
                placeholder
                // onClick: isOpen ? () => {} : openMenu,
                // onFocus: isOpen ? () => {} : openMenu,
                // ref: disclosureRef
              })
            )}
          />
          <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center">
            <button
              className="text-gray-600 px-3 h-full focus:outline-none focus:shadow-outline"
              {...getToggleButtonProps()}
              aria-label={'toggle menu'}
            >
              <ChevronDownIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div
          // style={styles.popper}
          // {...attributes.popper}
          // {...getMenuProps({ ref: popoverRef, className: ' w-full' })}
          {...getMenuProps({ className: ' w-full' })}
        >
          <ul className="bg-white shadow-md">
            {isOpen &&
              inputItems.map((item, index) => (
                <li
                  className={cn({
                    'p-2 text-sm bg-white border-b': true,
                    'bg-gray-100': highlightedIndex === index
                  })}
                  key={`${item.value}${index}`}
                  {...getItemProps({ item, index })}
                >
                  {isCreating ? (
                    <p>
                      <span>Create</span>{' '}
                      <span className="font-medium bg-yellow-300 text-yellow-900">
                        {item.label}
                      </span>
                    </p>
                  ) : (
                    <div className="flex items-center space-x-2">
                      {selectedItemValues.includes(item.value) && (
                        <span role="img" aria-label="Selected">
                          ✅
                        </span>
                      )}
                      <Highlighter
                        autoEscape
                        searchWords={[inputValue || '']}
                        textToHighlight={itemRenderer(item)}
                        highlightClassName="bg-yellow-300"
                      />
                    </div>
                  )}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

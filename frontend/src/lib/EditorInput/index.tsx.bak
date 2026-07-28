'use client'

import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react'
import type { EditorConfig } from 'ckeditor5'
import { getCookie } from 'cookies-next'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getApiUrl } from '../utils'
import styles from './styles.module.css'

export interface EditorInputProps {
  placeholder?: string
  value?: string
  onChange?: (value?: string) => void
}

export function EditorInput({ placeholder, value, onChange }: EditorInputProps) {
  const editorContainerRef = useRef(null)
  const editorRef = useRef(null)
  const [isLayoutReady, setIsLayoutReady] = useState(false)
  const cloud = useCKEditorCloud({ version: '47.0.0', translations: ['ru'] })

  useEffect(() => {
    setIsLayoutReady(true)

    return () => setIsLayoutReady(false)
  }, [])

  const { ClassicEditor, editorConfig } = useMemo(() => {
    if (cloud.status !== 'success' || !isLayoutReady) {
      return {}
    }

    const authToken = getCookie(String(process.env.NEXT_PUBLIC_JWT_TOKEN_NAME))

    const {
      ClassicEditor,
      AutoImage,
      Autosave,
      BlockQuote,
      Bold,
      CloudServices,
      Code,
      Essentials,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      FullPage,
      GeneralHtmlSupport,
      Heading,
      Highlight,
      HtmlComment,
      HtmlEmbed,
      ImageBlock,
      ImageCaption,
      ImageInline,
      ImageInsert,
      ImageInsertViaUrl,
      ImageResize,
      ImageStyle,
      ImageTextAlternative,
      ImageToolbar,
      ImageUpload,
      Indent,
      IndentBlock,
      Italic,
      Link,
      LinkImage,
      List,
      ListProperties,
      MediaEmbed,
      PageBreak,
      Paragraph,
      PasteFromOffice,
      RemoveFormat,
      ShowBlocks,
      SimpleUploadAdapter,
      SourceEditing,
      SpecialCharacters,
      Strikethrough,
      Subscript,
      Superscript,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      Underline
    } = cloud.CKEditor

    const editorConfig: EditorConfig = {
      toolbar: {
        items: [
          'sourceEditing',
          'showBlocks',
          '|',
          'heading',
          '|',
          'fontSize',
          'fontFamily',
          'fontColor',
          'fontBackgroundColor',
          '|',
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'subscript',
          'superscript',
          'code',
          'removeFormat',
          '|',
          'specialCharacters',
          'pageBreak',
          'link',
          'insertImage',
          'mediaEmbed',
          'insertTable',
          'highlight',
          'blockQuote',
          'htmlEmbed',
          '|',
          'bulletedList',
          'numberedList',
          'outdent',
          'indent'
        ],
        shouldNotGroupWhenFull: true
      },
      plugins: [
        AutoImage,
        Autosave,
        BlockQuote,
        Bold,
        CloudServices,
        Code,
        Essentials,
        FontBackgroundColor,
        FontColor,
        FontFamily,
        FontSize,
        FullPage,
        GeneralHtmlSupport,
        Heading,
        Highlight,
        HtmlComment,
        HtmlEmbed,
        ImageBlock,
        ImageCaption,
        ImageInline,
        ImageInsert,
        ImageInsertViaUrl,
        ImageResize,
        ImageStyle,
        ImageTextAlternative,
        ImageToolbar,
        ImageUpload,
        Indent,
        IndentBlock,
        Italic,
        Link,
        LinkImage,
        List,
        ListProperties,
        MediaEmbed,
        PageBreak,
        Paragraph,
        PasteFromOffice,
        RemoveFormat,
        ShowBlocks,
        SimpleUploadAdapter,
        SourceEditing,
        SpecialCharacters,
        Strikethrough,
        Subscript,
        Superscript,
        Table,
        TableCaption,
        TableCellProperties,
        TableColumnResize,
        TableProperties,
        TableToolbar,
        Underline
      ],
      fontFamily: {
        supportAllValues: true
      },
      fontSize: {
        options: [10, 12, 14, 'default', 18, 20, 22],
        supportAllValues: true
      },
      indentBlock: {
        classes: ['indent-a', 'indent-b', 'indent-c']
      },
      heading: {
        options: [
          {
            model: 'paragraph',
            title: 'Paragraph',
            class: 'ck-heading_paragraph'
          },
          {
            model: 'heading1',
            view: 'h1',
            title: 'Heading 1',
            class: 'ck-heading_heading1'
          },
          {
            model: 'heading2',
            view: 'h2',
            title: 'Heading 2',
            class: 'ck-heading_heading2'
          },
          {
            model: 'heading3',
            view: 'h3',
            title: 'Heading 3',
            class: 'ck-heading_heading3'
          },
          {
            model: 'heading4',
            view: 'h4',
            title: 'Heading 4',
            class: 'ck-heading_heading4'
          },
          {
            model: 'heading5',
            view: 'h5',
            title: 'Heading 5',
            class: 'ck-heading_heading5'
          },
          {
            model: 'heading6',
            view: 'h6',
            title: 'Heading 6',
            class: 'ck-heading_heading6'
          }
        ]
      },
      simpleUpload: {
        uploadUrl: `${getApiUrl()}storage/upload`,
        withCredentials: false,
        headers: {
          Authorization: 'Bearer ' + authToken
        }
      },
      // htmlSupport: {
      //   allow: [
      //     {
      //       name: /^.*$/,
      //       styles: true,
      //       attributes: true,
      //       classes: true
      //     }
      //   ]
      // },
      image: {
        toolbar: [
          'toggleImageCaption',
          'imageTextAlternative',
          '|',
          'imageStyle:inline',
          'imageStyle:wrapText',
          'imageStyle:breakText',
          '|',
          'resizeImage'
        ]
      },
      initialData: value,
      placeholder,
      language: 'ru',
      licenseKey: String(process.env.NEXT_PUBLIC_CKEDITOR_LICENSE_KEY),
      link: {
        addTargetToExternalLinks: true,
        defaultProtocol: 'https://',
        decorators: {
          toggleDownloadable: {
            mode: 'manual',
            label: 'Downloadable',
            attributes: {
              download: 'file'
            }
          }
        }
      },
      list: {
        properties: {
          styles: true,
          startIndex: true,
          reversed: true
        }
      },
      table: {
        contentToolbar: [
          'tableColumn',
          'tableRow',
          'mergeTableCells',
          'tableProperties',
          'tableCellProperties'
        ]
      }
    }

    return {
      ClassicEditor,
      editorConfig
    }
  }, [cloud, isLayoutReady])

  return (
    <div className={styles.wrapper} ref={editorContainerRef}>
      <div ref={editorRef}>
        {ClassicEditor && editorConfig && (
          <CKEditor
            editor={ClassicEditor}
            config={editorConfig}
            onChange={(_, editor) => {
              onChange?.(editor.getData())
            }}
          />
        )}
      </div>
    </div>
  )
}

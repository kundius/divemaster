'use client'

export interface EditorInputProps {
  placeholder?: string
  value?: string
  onChange?: (value?: string) => void
}

import { uploadFile } from '@/lib/utils'
import { Editor } from '@tinymce/tinymce-react'
import { useRef } from 'react'

interface BlobInfo {
  id(): string
  name(): string
  filename(): string
  blob(): Blob
  base64(): string
  blobUri(): string
  uri(): string | undefined
}

export function EditorInput({
  placeholder = 'Введите текст...',
  value,
  onChange
}: EditorInputProps) {
  const editorRef = useRef<Editor>(null)
  const images_upload_handler = async (blobInfo: BlobInfo) => {
    try {
      const blob = blobInfo.blob()
      const file = new File([blob], blobInfo.filename(), { type: blob.type })
      const response = await uploadFile(file)
      return response.url
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки изображения'
      return Promise.reject(errorMessage)
    }
  }
  return (
    <Editor
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      licenseKey="gpl"
      value={value}
      onEditorChange={(content) => onChange?.(content)}
      onInit={(_evt, editor) => {
        editorRef.current = editor as unknown as Editor
        editor.ui.registry.addButton('pagebreak', {
          icon: 'page-break',
          onAction: () => {
            editor.execCommand(
              'mceInsertContent',
              false,
              `
                <div class="page-break" data-mce-contenteditable="false" style="
                  display: block;
                  clear: both;
                  page-break-before: always;
                "></div>
              `
            )
          }
        })
      }}
      init={{
        images_upload_handler,

        paste_preprocess: (plugin, args) => {
          args.content = args.content
            .replace(/<br\s*\/?>/gi, ' ') // Заменяем <br> на пробел
            .replace(/<\/p><p>/g, ' ') // Заменяем разрыв между параграфами на пробел
            .replace(/<\/?p>/g, '') // Удаляем все теги <p>
            .replace(/\n/g, ' ') // Удаляем символы новой строки
            .replace(/\s+/g, ' ') // Заменяем множественные пробелы на один
            .trim() // Удаляем пробелы по краям
        },

        placeholder,
        height: 500,
        menubar: true,
        plugins: [
          'advlist',
          'autolink',
          'lists',
          'link',
          'image',
          'charmap',
          'anchor',
          'searchreplace',
          'visualblocks',
          'code',
          'fullscreen',
          'insertdatetime',
          'media',
          'table',
          'preview',
          'help',
          'wordcount'
        ],
        formats: {
          paragraphIndentA: [{ selector: 'p,h1,h2,h3,h4,h5,h6', classes: 'indent-a' }],
          paragraphIndentB: [{ selector: 'p,h1,h2,h3,h4,h5,h6', classes: 'indent-b' }],
          paragraphIndentC: [{ selector: 'p,h1,h2,h3,h4,h5,h6', classes: 'indent-c' }]
        },
        style_formats: [
          {
            title: 'Красная строка',
            items: [
              { title: 'Маленький отступ', format: 'paragraphIndentA' },
              { title: 'Средний отступ', format: 'paragraphIndentB' },
              { title: 'Большой отступ', format: 'paragraphIndentC' }
            ]
          }
        ],
        toolbar: [
          'styles blocks | alignleft aligncenter alignright alignjustify | bold italic pagebreak bullist numlist | removeformat'
        ],
        content_style: `
body {
  font-size: 16px;
  line-height: 20px;
  font-family: 'Times New Roman', Times, serif;
}

h1 {
  font-weight: bold;
  font-size: 20px;
  line-height: 28px;
}

* + h1 {
  margin-top: 32px;
}

h2 {
  font-weight: bold;
  font-size: 18px;
  line-height: 24px;
}

* + h2 {
  margin-top: 16px;
}

p {
}

* + p {
  margin-top: 16px;
}

ol {
  margin: 0;
  padding: 0 0 0 24px;
}

* + ol {
  margin-top: 16px;
}

ul {
  margin: 0;
  padding: 0 0 0 24px;
}

* + ul {
  margin-top: 16px;
}

.image {
  margin: 0 auto;
}

.image {
  margin-top: 16px;
}

.indent-a {
  text-indent: 24px;
}

.indent-b {
  text-indent: 48px;
}

.indent-c {
  text-indent: 62px;
}

.page-break {
  display: block !important;
  clear: both !important;
  page-break-before: always !important;
  height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  border: 0 !important;
}

@media screen {
  .page-break {
    height: 20px !important;
    margin: 30px 0 !important;
    border-top: 2px dashed #2196F3 !important;
    position: relative;
  }
  
  .page-break::after {
    content: "РАЗРЫВ СТРАНИЦЫ";
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    padding: 0 10px;
    color: #2196F3;
    font-size: 12px;
    font-weight: bold;
  }
}
        `
      }}
    />
  )
}

import { Product } from '@/products/entities/product.entity'
import { content as mailLayout } from '../layout'

interface SignUpParams {
  name?: string
  phone: string
  product: Product
}

export const content = (params: SignUpParams): string => {
  return mailLayout({
    greetingName: params.name,
    showHeader: false,
    showSubscribe: false,
    withAccept: true,
    content: `
    ${params.phone}<br />
    ${params.product.title}
    `,
    supportContent: `
    По всем интересующим вопросам просьба обращаться по адресу
    `
  })
}

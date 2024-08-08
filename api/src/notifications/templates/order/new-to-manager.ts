import { content as mailLayout } from '../layout'

interface SignUpParams {
  fullName?: string
}

export const content = (params: SignUpParams): string => {
  return mailLayout({
    greetingName: params.fullName,
    showHeader: false,
    showSubscribe: false,
    withAccept: true,
    content: `
    Список товаров
    `,
    supportContent: `
    По всем интересующим вопросам просьба обращаться по адресу
    `
  })
}

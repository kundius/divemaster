import { CheckCircledIcon, CircleBackslashIcon, CircleIcon } from '@radix-ui/react-icons'

import { BlogPostStatusEnum } from '@/types'

export const BlogPostStatusLabels: Record<BlogPostStatusEnum, string> = {
  [BlogPostStatusEnum.Archived]: 'В архиве',
  [BlogPostStatusEnum.Draft]: 'Черновик',
  [BlogPostStatusEnum.Published]: 'Опубликован'
}

export const BlogPostStatusIcons: Record<BlogPostStatusEnum, typeof CircleBackslashIcon> = {
  [BlogPostStatusEnum.Archived]: CircleBackslashIcon,
  [BlogPostStatusEnum.Draft]: CircleIcon,
  [BlogPostStatusEnum.Published]: CheckCircledIcon
}

export const BlogPostStatusColors: Record<BlogPostStatusEnum, string> = {
  [BlogPostStatusEnum.Archived]: 'text-neutral-300',
  [BlogPostStatusEnum.Draft]: 'text-amber-400',
  [BlogPostStatusEnum.Published]: 'text-green-500'
}

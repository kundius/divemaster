'use client'

import { OKShareButton, TelegramShareButton, VKShareButton } from 'react-share'

import { SpriteIcon } from '@/components/SpriteIcon'
import { cn } from '@/lib/utils'

import css from './index.module.css'

export interface ShareProps {
  url: string
}

export function Share({ url }: ShareProps) {
  return (
    <div className={css.share}>
      <OKShareButton
        resetButtonStyle={false}
        url={url}
        className={cn(css.button, 'bg-neutral-400 hover:bg-[#ff7700]')}
      >
        <SpriteIcon name="social-ok" size={24} />
      </OKShareButton>
      <TelegramShareButton
        resetButtonStyle={false}
        url={url}
        className={cn(css.button, 'bg-neutral-400 hover:bg-[#26a2e2]')}
      >
        <SpriteIcon name="social-telegram" size={24} />
      </TelegramShareButton>
      <VKShareButton
        resetButtonStyle={false}
        url={url}
        className={cn(css.button, 'bg-neutral-400 hover:bg-[#0077ff]')}
      >
        <SpriteIcon name="social-vk" size={24} />
      </VKShareButton>
    </div>
  )
}

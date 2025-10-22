import * as React from 'react'
import CoreLightbox, { SlideImage, SlideVideo } from 'yet-another-react-lightbox'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Video from 'yet-another-react-lightbox/plugins/video'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

export interface LightboxProps {
  index?: number
  isOpened: boolean
  close: () => void
  slides?: (SlideImage | SlideVideo)[]
}

export default function Lightbox({ index, isOpened, close, slides }: LightboxProps) {
  return (
    <CoreLightbox
      plugins={[Thumbnails, Video]}
      index={index}
      open={isOpened}
      close={close}
      slides={slides}
    />
  )
}

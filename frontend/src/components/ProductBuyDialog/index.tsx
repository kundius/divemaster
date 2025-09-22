import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { apiPost } from '@/lib/api'
import { cn, getFileUrl } from '@/lib/utils'
import { useProductStore } from '@/providers/product-store-provider'
import { useToggle } from '@reactuses/core'
import Image from 'next/image'
import Link from 'next/link'
import { PropsWithChildren, useMemo, useTransition } from 'react'
import { toast } from 'sonner'
import { LabeledInput } from '../LabeledInput'
import { PrimaryButton, PrimaryButtonArrow, PrimaryButtonSpinner } from '../PrimaryButton'
import assetsDive from './assets/dive.png'
import assetsMaster from './assets/master.png'
import assetsRing from './assets/ring.png'
import assetsS from './assets/s.png'
import css from './index.module.css'

export function ProductBuyDialog({ children, title }: PropsWithChildren<{ title: string }>) {
  const productStore = useProductStore((state) => state)
  const [show, _toggleShow] = useToggle(false)
  const [success, _toggleSuccess] = useToggle(false)
  const [pending, startTransition] = useTransition()

  const toggleShow = (val: boolean) => {
    _toggleShow(val)
  }

  const toggleSuccess = (val: boolean) => {
    _toggleSuccess(val)
  }

  const thumbnail = useMemo(() => {
    const image = productStore.product.images?.[0]

    if (!image) {
      return '/noimage.png'
    }

    return getFileUrl(image.fileId)
  }, [productStore.product])

  const submitHandler = (formData: FormData) => {
    startTransition(async () => {
      try {
        await apiPost(`products/${productStore.product.id}/order-by-click`, {
          name: formData.get('name'),
          phone: formData.get('phone'),
          approve: formData.get('approve'),
          subject: title
        })
        toggleSuccess(true)
        toggleShow(false)
      } catch (e: any) {
        toast.error(e.message || 'Не удалось отправить сообщение')
      }
    })
  }

  const endHandler = () => {
    toggleSuccess(false)
    toggleShow(false)
  }

  const price = productStore.displayPrice(productStore.offer)

  return (
    <>
      <Dialog open={success} onOpenChange={toggleSuccess}>
        <DialogContent className={css.success}>
          <DialogTitle className={css.successTitle}>Спасибо!</DialogTitle>
          <div className={css.successBody}>
            <div className={css.successDesc}>
              <strong>Ваша заявка успешно отправлена.</strong>
              <br />
              <br />В ближайшее время с Вами свяжется менеджер и&nbsp;уточнит все детали
            </div>
          </div>
          <div className={css.successAlt}>
            Ещё больше товаров смотрите
            <br /> в нашем каталоге
          </div>
          <div className={css.successSubmit}>
            <PrimaryButton variant="outline" onClick={endHandler}>
              В каталог
              <PrimaryButtonArrow />
            </PrimaryButton>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={show} onOpenChange={toggleShow}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className={css.content}>
          <div className={css.layout}>
            <div className={css.layoutTitle}>
              <DialogTitle className={css.title}>{title}</DialogTitle>
            </div>
            <div className={css.layoutProduct}>
              <div className={css.product}>
                <div className={css.productImage}>
                  <Image
                    src={thumbnail}
                    alt={productStore.product.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className={css.productTitle}>{productStore.product.title}</div>
                <div className={css.productPrice}>
                  <div className={css.productPriceLabel}>Цена:</div>
                  <div className={css.productPriceValue}>{price}</div>
                  <div className={css.productPriceDesc}>(без учёта доставки)</div>
                </div>
              </div>
            </div>
            <div className={css.layoutForm}>
              <div className={css.desc}>
                Отправьте заявку, и наши менеджеры свяжутся с Вами в ближайшее время.
              </div>
              <form className={css.rows} action={submitHandler}>
                <div className={css.rowInput}>
                  <LabeledInput type="text" name="name" label="Имя" />
                </div>
                <div className={css.rowInput}>
                  <LabeledInput type="tel" name="phone" label="Телефон" required />
                </div>
                <div className={css.rowRules}>
                  <label className={css.rules}>
                    <input
                      type="checkbox"
                      name="approve"
                      value="1"
                      className={css.rulesControl}
                      defaultChecked
                      required
                    />
                    Соглашаюсь с{' '}
                    <Link href="/info/privacy-policy" target="_blank">
                      Политикой обработки персональных данных
                    </Link>
                  </label>
                </div>
                <div className={css.rowSubmit}>
                  <PrimaryButton disabled={pending}>
                    {pending && <PrimaryButtonSpinner />}
                    Отправить
                    {!pending && <PrimaryButtonArrow />}
                  </PrimaryButton>
                </div>
              </form>
            </div>
            <Image src={assetsS} alt="" className={cn(css.assetsS, 'max-md:hidden')} />
            <Image src={assetsDive} alt="" className={cn(css.assetsDive, 'max-md:hidden')} />
            <Image src={assetsMaster} alt="" className={cn(css.assetsMaster, 'max-md:hidden')} />
            <Image src={assetsRing} alt="" className={cn(css.assetsRing, 'max-md:hidden')} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

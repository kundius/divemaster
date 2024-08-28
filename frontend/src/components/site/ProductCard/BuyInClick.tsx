import { useToggle } from '@reactuses/core'
import Image from 'next/image'
import { useMemo, useTransition } from 'react'
import { toast } from 'sonner'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { apiPost } from '@/lib/api'
import { getFileUrl } from '@/lib/utils'
import { useProductStore } from '@/providers/product-store-provider'

import { PrimaryButton, PrimaryButtonArrow, PrimaryButtonSpinner } from '../PrimaryButton'
import css from './BuyInClick.module.scss'
import assetsDive from './assets/dive.png'
import assetsMaster from './assets/master.png'
import assetsRing from './assets/ring.png'
import assetsS from './assets/s.png'

export function BuyInClick() {
  const product = useProductStore((state) => state.product)
  const defaultPrice = useProductStore((state) => state.defaultPrice)
  const [show, toggleShow] = useToggle(false)
  const [success, toggleSuccess] = useToggle(false)
  const [pending, startTransition] = useTransition()

  const thumbnail = useMemo(() => {
    const image = product.images?.[0]

    if (!image) {
      return '/noimage.png'
    }

    return getFileUrl(image.file)
  }, [product])

  const submitHandler = (formData: FormData) => {
    startTransition(async () => {
      try {
        await apiPost(`products/${product.id}/order-by-click`, {
          name: formData.get('name'),
          phone: formData.get('phone'),
          approve: formData.get('approve')
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

  return (
    <>
      <Dialog open={success} onOpenChange={toggleSuccess}>
        <DialogContent className={css.success}>
          <div className={css.successTitle}>Спасибо!</div>
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
        <DialogTrigger className={css['action']}>
          <span className={css['inner']}>
            Купить <span className="text-nowrap">в 1 клик</span>
          </span>
        </DialogTrigger>
        <DialogContent className={css.content}>
          <div className={css.layout}>
            <div className={css.layoutProduct}>
              <div className={css.product}>
                <div className={css.productImage}>
                  <Image src={thumbnail} alt={product.title} fill className="object-contain" />
                </div>
                <div className={css.productTitle}>{product.title}</div>
                <div className={css.productPrice}>
                  <div className={css.productPriceLabel}>Цена:</div>
                  <div className={css.productPriceValue}>{defaultPrice}</div>
                  <div className={css.productPriceDesc}>(без учёта доставки)</div>
                </div>
              </div>
            </div>
            <div className={css.layoutForm}>
              <div className={css.title}>Заказать в 1 клик</div>
              <div className={css.desc}>
                Отправьте заявку, и наши менеджеры свяжутся с Вами в ближайшее время.
              </div>
              <form className={css.rows} action={submitHandler}>
                <div className={css.rowInput}>
                  <label className={css.input}>
                    <input type="text" name="name" placeholder=" " className={css.inputControl} />
                    <span className={css.inputLabel}>Имя</span>
                  </label>
                </div>
                <div className={css.rowInput}>
                  <label className={css.input}>
                    <input
                      type="tel"
                      name="phone"
                      placeholder=" "
                      className={css.inputControl}
                      required
                    />
                    <span className={css.inputLabel}>Телефон</span>
                  </label>
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
                    <a href="/info/privacy-policy" target="_blank">
                      Политикой обработки персональных данных
                    </a>
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
            <Image src={assetsS} alt="" className={css.assetsS} />
            <Image src={assetsDive} alt="" className={css.assetsDive} />
            <Image src={assetsMaster} alt="" className={css.assetsMaster} />
            <Image src={assetsRing} alt="" className={css.assetsRing} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

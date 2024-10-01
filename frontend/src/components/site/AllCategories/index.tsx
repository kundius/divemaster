import { cn, formatPrice } from '@/lib/utils'
import styles from './index.module.scss'
import Image from 'next/image'
import Link from 'next/link'

export interface AllCategoriesProps {}

// TODO: картинки не адаптированы на телефоне
export function AllCategories(props: AllCategoriesProps) {
  return (
    <div className={cn(styles.root, 'gap-8 columns-3')}>
      <div className={cn(styles.group, styles.groupWeapon)}>
        <span className={styles.title}>Оружие</span>
        <ul className={styles.list}>
          <li>
            <span>Пневмат подводные ружья</span>
          </li>
          <li>
            <span>Ремонт ружей пневматы</span>
          </li>
          <li>
            <span>Аксессуары для ружей пневматы</span>
          </li>
          <li>
            <span>Ножи</span>
          </li>
          <li>
            <span>Гарпуны</span>
          </li>
          <li>
            <span>Арбалеты</span>
          </li>
          <li>
            <span>Ремонт арбалета</span>
          </li>
          <li>
            <span>Тяги для арбалета</span>
          </li>
          <li>
            <span>Акссесуары для арбалета</span>
          </li>
          <li>
            <span>Слинги</span>
          </li>
          <li>
            <span>Наконечники</span>
          </li>
          <li>
            <span>Катушки</span>
          </li>
          <li>
            <span>Лини</span>
          </li>
          <li>
            <Link href="/category/vsyo-dlya-podvodnoj-ohoty-aksessuary-dlya-podvodnoj-ohoty">
              Аксессуары для подводной охоты
            </Link>
          </li>
        </ul>
        <div className={styles.imageWrap}>
          <Image
            className={styles.image}
            src="/catalog/weapon.png"
            width={357}
            height={620}
            alt="Оружие"
          />
        </div>
      </div>
      <div className={cn(styles.group, styles.groupMailingPlants)}>
        <span className={styles.title}>Гидрокостюмы</span>
        <ul className={styles.list}>
          <li>
            <Link href="/category/vsyo-dlya-podvodnoj-ohoty-gidrokostyumy-dlya-podvodnoj-ohoty">
              Для подводной охоты
            </Link>
          </li>
          <li>
            <Link href="/category/vsyo-dlya-dajvinga-gidrokostyumy-dlya-dajvinga-i-syorfinga">
              Для дайвинга
            </Link>
          </li>
          <li>
            <span>AQUADISCOVERY</span>
          </li>
          <li>
            <span>AQUATEAM</span>
          </li>
          <li>
            <span>BEUCHAT</span>
          </li>
          <li>
            <span>CRESSI</span>
          </li>
          <li>
            <span>JAKBOENO</span>
          </li>
          <li>
            <span>MARLIN</span>
          </li>
          <li>
            <span>OMER</span>
          </li>
        </ul>
        <div className={styles.imageWrap}>
          <Image
            className={styles.image}
            src="/catalog/mailing-plants.png"
            width={208}
            height={628}
            alt="Гидрокостюмы"
          />
        </div>
      </div>
      <div className={cn(styles.group, styles.groupTubes)}>
        <span className={styles.title}>Трубки</span>
        <div className={styles.imageWrap}>
          <Image
            className={styles.image}
            src="/catalog/tubes.png"
            width={362}
            height={176}
            alt="Трубки"
          />
        </div>
      </div>
      <div className={cn(styles.group, styles.groupMasks)}>
        <span className={styles.title}>Маски</span>
        <div className={styles.imageWrap}>
          <Image
            className={styles.image}
            src="/catalog/masks.png"
            width={232}
            height={163}
            alt="Маски"
          />
        </div>
      </div>
      <div className={cn(styles.group, styles.groupFlippers)}>
        <span className={styles.title}>Ласты</span>
        <ul className={styles.list}>
          <li>
            <Link href="/category/vsyo-dlya-podvodnoj-ohoty-lasty-dlya-podvodnoj-ohoty">
              Ласты для подводной охоты
            </Link>
          </li>
          <li>
            <span>Запчасти для ласт</span>
          </li>
          <li>
            <Link href="/category/vsyo-dlya-dajvinga-lasty-dlya-dajvinga">Ласты для дайвинга</Link>
          </li>
          <li>
            <Link href="/category/vsyo-dlya-dajvinga-aksessuary-dlya-last">
              Аксессуары для ласт для дайвинга
            </Link>
          </li>
        </ul>
        <div className={styles.imageWrap}>
          <Image
            className={styles.image}
            src="/catalog/flippers.png"
            width={240}
            height={233}
            alt="Ласты"
          />
        </div>
      </div>
      <div className={cn(styles.group, styles.groupGloves)}>
        <span className={styles.title}>Перчатки</span>
        <div className={styles.imageWrap}>
          <Image
            className={styles.image}
            src="/catalog/gloves.png"
            width={144}
            height={134}
            alt="Перчатки"
          />
        </div>
      </div>
      <div className={cn(styles.group, styles.groupSocks)}>
        <span className={styles.title}>Носки</span>
        <div className={styles.imageWrap}>
          <Image
            className={styles.image}
            src="/catalog/socks.png"
            width={201}
            height={138}
            alt="Носки"
          />
        </div>
      </div>
      <div className={cn(styles.group, styles.groupCylins)}>
        <span className={styles.title}>Баллоны</span>
        <ul className={styles.list}>
          <li>
            <span>Для дайвинга</span>
          </li>
          <li>
            <span>Для подводной охоты</span>
          </li>
        </ul>
        <div className={styles.imageWrap}>
          <Image
            className={styles.image}
            src="/catalog/cylins.png"
            width={191}
            height={230}
            alt="Баллоны"
          />
        </div>
      </div>
      <div className={cn(styles.group, styles.groupNeopreneAccessories)}>
        <span className={styles.title}>Неопреновые аксессуары</span>
        <div className={styles.imageWrap}>
          <Image
            className={styles.image}
            src="/catalog/neoprene-accessories.png"
            width={137}
            height={144}
            alt="Неопреновые аксессуары"
          />
        </div>
      </div>
      <div className={cn(styles.group, styles.groupLights)}>
        <span className={styles.title}>Фонари</span>
        <ul className={styles.list}>
          <li>
            <span>Фонари</span>
          </li>
          <li>
            <span>Акссесуары для фонарей</span>
          </li>
        </ul>
        <div className={styles.imageWrap}>
          <Image
            className={styles.image}
            src="/catalog/lights.png"
            width={168}
            height={116}
            alt="Фонари"
          />
        </div>
      </div>
      <div className={cn(styles.group, styles.groupUnloadingVests)}>
        <span className={styles.title}>Разгрузочные жилеты</span>
        <div className={styles.imageWrap}>
          <Image
            className={styles.image}
            src="/catalog/unloading-vests.png"
            width={187}
            height={180}
            alt="Разгрузочные жилеты"
          />
        </div>
      </div>
      <div className={cn(styles.group, styles.groupBots)}>
        <span className={styles.title}>Боты</span>
        <div className={styles.imageWrap}>
          <Image
            className={styles.image}
            src="/catalog/bots.png"
            width={145}
            height={110}
            alt="Боты"
          />
        </div>
      </div>
      <div className={cn(styles.group, styles.groupCargoAndCargoSystems)}>
        <span className={styles.title}>Груза и грузовые системы</span>
        <div className={styles.imageWrap}>
          <Image
            className={styles.image}
            src="/catalog/cargo-and-cargo-systems.png"
            width={135}
            height={79}
            alt="Груза и грузовые системы"
          />
        </div>
      </div>
      <div className={cn(styles.group, styles.groupRegulatorsAndOctopuses)}>
        <span className={styles.title}>
          Регуляторы
          <br />и октопусы
        </span>
        <div className={styles.imageWrap}>
          <Image
            className={styles.image}
            src="/catalog/regulators-and-octopuses.png"
            width={183}
            height={153}
            alt="Регуляторы и октопусы"
          />
        </div>
      </div>
      <div className={cn(styles.group, styles.groupBagsCoversBoxes)}>
        <span className={styles.title}>Сумки, чехлы, боксы</span>
        <div className={styles.imageWrap}>
          <Image
            className={styles.image}
            src="/catalog/bags-covers-boxes.png"
            width={251}
            height={99}
            alt="Сумки, чехлы, боксы "
          />
        </div>
      </div>
      <div className={cn(styles.group, styles.groupCompensators)}>
        <span className={styles.title}>Компенсаторы</span>
        <div className={styles.imageWrap}>
          <Image
            className={styles.image}
            src="/catalog/compensators.png"
            width={238}
            height={294}
            alt="Компенсаторы"
          />
        </div>
      </div>
      <div className={cn(styles.group, styles.groupBeltsAndBuckles)}>
        <span className={styles.title}>Пояса и пряжки</span>
        <div className={styles.imageWrap}>
          <Image
            className={styles.image}
            src="/catalog/belts-and-buckles.png"
            width={178}
            height={89}
            alt="Пояса и пряжки"
          />
        </div>
      </div>
      <div className={cn(styles.group, styles.groupDevicesAndComputers)}>
        <span className={styles.title}>Приборы и компьютеры</span>
        <ul className={styles.list}>
          <li>
            <Link href="/category/vsyo-dlya-podvodnoj-ohoty-kompyutery-dlya-podvodnoj-ohoty">
              Для подводной охоты
            </Link>
          </li>
          <li>
            <Link href="/category/vsyo-dlya-dajvinga-pribory-i-kompyutery">Для дайвинга</Link>
          </li>
        </ul>
        <div className={styles.imageWrap}>
          <Image
            className={styles.image}
            src="/catalog/devices-and-computers.png"
            width={96}
            height={120}
            alt="Приборы и компьютеры"
          />
        </div>
      </div>
      <div className={cn(styles.group, styles.groupPhotoAndVideo)}>
        <span className={styles.title}>
          Фото-
          <br />и видеосъёмка
        </span>
        <div className={styles.imageWrap}>
          <Image
            className={styles.image}
            src="/catalog/photo-and-video.png"
            width={152}
            height={78}
            alt="Фото-и видеосъёмка"
          />
        </div>
      </div>
      <div className={cn(styles.group, styles.groupBuoysTugboatsRafts)}>
        <span className={styles.title}>
          Буи, буксировщики,
          <br />
          плоты
        </span>
        <div className={styles.imageWrap}>
          <Image
            className={styles.image}
            src="/catalog/buoys-tugboats-rafts.png"
            width={119}
            height={102}
            alt="Буи, буксировщики, плоты"
          />
        </div>
      </div>
      <div className={cn(styles.group, styles.groupChemistry)}>
        <span className={styles.title}>Химия</span>
        <div className={styles.imageWrap}>
          <Image
            className={styles.image}
            src="/catalog/chemistry.png"
            width={219}
            height={113}
            alt="Химия"
          />
        </div>
      </div>
    </div>
  )
}

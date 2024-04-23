import { cn, displayPrice } from '@/lib/utils'
import styles from './index.module.scss'
import Image from 'next/image'

export interface AllCategoriesProps {}

export function AllCategories(props: AllCategoriesProps) {
  return (
    <div className={cn(styles.root, 'gap-8 columns-3')}>
      <div className={cn(styles.group, styles.groupWeapon)}>
        <a href="#" className={styles.title}>
          Оружие
        </a>
        <ul className={styles.list}>
          <li>
            <a href="#">Пневмат подводные ружья</a>
          </li>
          <li>
            <a href="#">Ремонт ружей пневматы</a>
          </li>
          <li>
            <a href="#">Аксессуары для ружей пневматы</a>
          </li>
          <li>
            <a href="#">Ножи</a>
          </li>
          <li>
            <a href="#">Гарпуны</a>
          </li>
          <li>
            <a href="#">Арбалеты</a>
          </li>
          <li>
            <a href="#">Ремонт арбалета</a>
          </li>
          <li>
            <a href="#">Тяги для арбалета</a>
          </li>
          <li>
            <a href="#">Акссесуары для арбалета</a>
          </li>
          <li>
            <a href="#">Слинги</a>
          </li>
          <li>
            <a href="#">Наконечники</a>
          </li>
          <li>
            <a href="#">Катушки</a>
          </li>
          <li>
            <a href="#">Лини</a>
          </li>
          <li>
            <a href="#">Аксессуары для подводной охоты</a>
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
        <a href="#" className={styles.title}>
          Гидрокостюмы
        </a>
        <ul className={styles.list}>
          <li>
            <a href="#">Для подводной охоты</a>
          </li>
          <li>
            <a href="#">Для дайвинга</a>
          </li>
          <li>
            <a href="#">AQUADISCOVERY</a>
          </li>
          <li>
            <a href="#">AQUATEAM</a>
          </li>
          <li>
            <a href="#">BEUCHAT</a>
          </li>
          <li>
            <a href="#">CRESSI</a>
          </li>
          <li>
            <a href="#">JAKBOENO</a>
          </li>
          <li>
            <a href="#">MARLIN</a>
          </li>
          <li>
            <a href="#">OMER</a>
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
        <a href="#" className={styles.title}>
          Трубки
        </a>
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
        <a href="#" className={styles.title}>
          Маски
        </a>
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
        <a href="#" className={styles.title}>
          Ласты
        </a>
        <ul className={styles.list}>
          <li>
            <a href="#">Ласты для подводной охоты</a>
          </li>
          <li>
            <a href="#">Запчасти для ласт</a>
          </li>
          <li>
            <a href="#">Ласты для дайвинга</a>
          </li>
          <li>
            <a href="#">Аксессуары для ласт для дайвинга</a>
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
        <a href="#" className={styles.title}>
          Перчатки
        </a>
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
        <a href="#" className={styles.title}>
          Носки
        </a>
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
        <a href="#" className={styles.title}>
          Баллоны
        </a>
        <ul className={styles.list}>
          <li>
            <a href="#">Для дайвинга</a>
          </li>
          <li>
            <a href="#">Для подводной охоты</a>
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
        <a href="#" className={styles.title}>
          Неопреновые аксессуары
        </a>
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
        <a href="#" className={styles.title}>
          Фонари
        </a>
        <ul className={styles.list}>
          <li>
            <a href="#">Фонари</a>
          </li>
          <li>
            <a href="#">Акссесуары для фонарей</a>
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
        <a href="#" className={styles.title}>
          Разгрузочные жилеты
        </a>
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
        <a href="#" className={styles.title}>
          Боты
        </a>
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
        <a href="#" className={styles.title}>
          Груза и грузовые системы
        </a>
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
        <a href="#" className={styles.title}>
          Регуляторы и октопусы
        </a>
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
        <a href="#" className={styles.title}>
          Сумки, чехлы, боксы
        </a>
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
        <a href="#" className={styles.title}>
          Компенсаторы
        </a>
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
        <a href="#" className={styles.title}>
          Пояса и пряжки
        </a>
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
        <a href="#" className={styles.title}>
          Приборы и компьютеры
        </a>
        <ul className={styles.list}>
          <li>
            <a href="#">Для подводной охоты</a>
          </li>
          <li>
            <a href="#">Для дайвинга</a>
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
        <a href="#" className={styles.title}>
          Фото-и видеосъёмка
        </a>
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
        <a href="#" className={styles.title}>
          Буи, буксировщики, плоты
        </a>
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
        <a href="#" className={styles.title}>
          Химия
        </a>
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

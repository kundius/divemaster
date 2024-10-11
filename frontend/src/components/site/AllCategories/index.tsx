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
            <Link href="/category/vsyo-dlya-podvodnoj-ohoty-ruzhya-pnevmaty">
              Пневмат подводные ружья
            </Link>
          </li>
          <li>
            <Link href="/category/vsyo-dlya-podvodnoj-ohoty-remont-ruzhej-pnevmaty">
              Ремонт ружей пневматы
            </Link>
          </li>
          <li>
            <Link href="/category/vsyo-dlya-podvodnoj-ohoty-aksessuary-dlya-ruzhej-pnevmaty">
              Аксессуары для ружей пневматы
            </Link>
          </li>
          <li>
            <Link href="/category/vsyo-dlya-podvodnoj-ohoty-nozhi">Ножи</Link>
          </li>
          <li>
            <Link href="/category/vsyo-dlya-podvodnoj-ohoty-garpuny">Гарпуны</Link>
          </li>
          <li>
            <Link href="/category/vsyo-dlya-podvodnoj-ohoty-arbalety">Арбалеты</Link>
          </li>
          <li>
            <Link href="/category/vsyo-dlya-podvodnoj-ohoty-remont-arbaleta">Ремонт арбалета</Link>
          </li>
          <li>
            <Link href="/category/vsyo-dlya-podvodnoj-ohoty-tyagi-dlya-arbaleta">
              Тяги для арбалета
            </Link>
          </li>
          <li>
            <Link href="/category/vsyo-dlya-podvodnoj-ohoty-akssesuary-dlya-arbaleta">
              Акссесуары для арбалета
            </Link>
          </li>
          <li>
            <Link href="/category/vsyo-dlya-podvodnoj-ohoty-slingi">Слинги</Link>
          </li>
          <li>
            <Link href="/category/vsyo-dlya-podvodnoj-ohoty-nakonechniki">Наконечники</Link>
          </li>
          <li>
            <Link href="/category/vsyo-dlya-podvodnoj-ohoty-katushki">Катушки</Link>
          </li>
          <li>
            <Link href="/category/vsyo-dlya-podvodnoj-ohoty-lin">Лини</Link>
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
          {/* <li>
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
          </li> */}
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
        <Link href="/category/vsyo-dlya-podvodnoj-ohoty-trubki" className={styles.title}>
          Трубки
        </Link>
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
        <Link href="/category/vsyo-dlya-podvodnoj-ohoty-maski" className={styles.title}>
          Маски
        </Link>
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
            <Link href="/category/vsyo-dlya-podvodnoj-ohoty-zapchasti-dlya-last">
              Запчасти для ласт
            </Link>
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
        <Link href="/category/vsyo-dlya-podvodnoj-ohoty-perchatki" className={styles.title}>
          Перчатки
        </Link>
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
        <Link href="/category/vsyo-dlya-podvodnoj-ohoty-noski" className={styles.title}>
          Носки
        </Link>
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
        <Link href="/category/vsyo-dlya-dajvinga-ballony-dlya-dajvinga" className={styles.title}>
          Баллоны
        </Link>
        {/* <ul className={styles.list}>
          <li>
            <span>Для дайвинга</span>
          </li>
          <li>
            <span>Для подводной охоты</span>
          </li>
        </ul> */}
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
        <Link
          href="/category/vsyo-dlya-podvodnoj-ohoty-neoprenovye-aksessuary"
          className={styles.title}
        >
          Неопреновые аксессуары
        </Link>
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
            <Link href="/category/vsyo-dlya-podvodnoj-ohoty-fonari">Фонари</Link>
          </li>
          <li>
            <Link href="/category/vsyo-dlya-podvodnoj-ohoty-akssesuary-dlya-fonarej">
              Акссесуары для фонарей
            </Link>
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
        <Link
          href="/category/vsyo-dlya-podvodnoj-ohoty-razgruzochnye-zhilety"
          className={styles.title}
        >
          Разгрузочные жилеты
        </Link>
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
        <Link href="/category/vsyo-dlya-dajvinga-boty" className={styles.title}>
          Боты
        </Link>
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
        <Link
          href="/category/vsyo-dlya-podvodnoj-ohoty-gruza-i-gruzovye-sistemy"
          className={styles.title}
        >
          Груза и грузовые системы
        </Link>
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
        <Link href="/category/vsyo-dlya-dajvinga-regulyatory-i-oktopusy" className={styles.title}>
          Регуляторы
          <br />и октопусы
        </Link>
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
        <Link
          href="/category/vsyo-dlya-podvodnoj-ohoty-sumki-chehly-boksy"
          className={styles.title}
        >
          Сумки, чехлы, боксы
        </Link>
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
        <Link href="/category/vsyo-dlya-dajvinga-kompensatory" className={styles.title}>
          Компенсаторы
        </Link>
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
        <Link href="/category/vsyo-dlya-podvodnoj-ohoty-poyasa-i-pryazhki" className={styles.title}>
          Пояса и пряжки
        </Link>
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
        <Link
          href="/category/vsyo-dlya-dajvinga-aksessuary-dlya-foto-i-videosuyomki"
          className={styles.title}
        >
          Фото-
          <br />и видеосъёмка
        </Link>
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
        <Link
          href="/category/vsyo-dlya-podvodnoj-ohoty-bui-buksirovshiki-ploty"
          className={styles.title}
        >
          Буи, буксировщики,
          <br />
          плоты
        </Link>
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
        <Link href="/category/vsyo-dlya-podvodnoj-ohoty-himiya" className={styles.title}>
          Химия
        </Link>
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

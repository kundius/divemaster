import Image from 'next/image'
import Link from 'next/link'
import { CatalogButton } from './CatalogButton'
import { CatalogMenu } from './CatalogMenu'
import { DesktopContacts } from './DesktopContacts'
import { MenuButton } from './MenuButton'
import { Search } from './Search'
import { Sticky } from './Sticky'
import { Toolbar } from './Toolbar'
import styles from './index.module.css'
import { SecondaryContainer } from './SecondaryContainer'
import { Container } from '@/components/Container'
// import { Garland } from './Garland'

export function Header() {
  return (
    <Sticky>
      {/* <Garland /> */}
      <Container>
        <div className={styles['primary-container']} data-header-primary="">
          <div className={styles.logo}>
            <Link href="/">
              <Image src="/logo.png" width={148} height={71} alt="" className="max-md:hidden" />
              <Image src="/small-logo.png" width={43} height={48} alt="" className="md:hidden" />
            </Link>
          </div>

          <div className={styles['catalog-button']}>
            <CatalogButton />
          </div>

          <div className={styles.search}>
            <Search />
          </div>

          <div className={styles.toolbar} data-header-toolbar="">
            <Toolbar />
          </div>

          <div className={styles['menu-button']}>
            <MenuButton />
          </div>
        </div>

        <SecondaryContainer>
          <div className={styles['catalog-menu']}>
            <CatalogMenu />
          </div>

          <div className={styles['desktop-contacts']}>
            <DesktopContacts />
          </div>
        </SecondaryContainer>
      </Container>
    </Sticky>
  )
}

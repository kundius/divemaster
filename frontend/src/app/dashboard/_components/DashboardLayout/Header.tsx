'use client'

import React from 'react'
import { User } from './User'

import styles from './Header.module.scss'
import { NavDrawer } from './_Header/NavDrawer'
import Link from 'next/link'
import Image from 'next/image'

export function Header() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.drawer}>
        <NavDrawer />
      </div>
      <div className={styles.logo}>
        <Link href="/dashboard">
          <Image src="/logo.png" alt="Divemaster Logo" width={128} height={61} priority />
        </Link>
      </div>
      <div className={styles.user}>
        <User />
      </div>
    </div>
  )
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from 'antd';
import Sidebar from '../sidebar/Sidebar';
import styles from './header.module.css';
import { NoAuthUser } from '../UI';

export default function Header() {
  const [open, setOpen] = useState(false);
  const toggleSidebar = () => setOpen(!open);
  const closeSidebar = () => setOpen(false);

  return (
    <>
      <Sidebar open={open} onClose={closeSidebar} />
      <header className={styles.siteHeader}>
        <div className={styles.left}>
          <Button type="link" onClick={toggleSidebar} className={styles.sidebarToggle}>
            ☰
          </Button>
          <Link href="/" className="logo">
            <img src="/logo.svg" alt="logo" />
          </Link>
        </div>

        <div className={styles.center}>
          <input type="text" placeholder="Filter" />
        </div>

        <div className={styles.right}>
          <NoAuthUser />
        </div>
      </header>
    </>
  );
}

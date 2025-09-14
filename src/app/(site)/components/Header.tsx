'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Drawer } from 'antd';
import styles from './header.module.css';

export default function Header() {
  const [open, setOpen] = useState(false);
  const toggleSidebar = () => setOpen(!open);

  return (
    <>
      <Drawer
        placement="left"
        width={280}
        open={open}
        onClose={toggleSidebar}
        className={styles.sidebarDrawer}
      >
        <nav className={styles.sidebar}>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/places">Places</Link>
            </li>
          </ul>
        </nav>
      </Drawer>
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
          <Link href="/login">Login</Link>
        </div>
      </header>
    </>
  );
}


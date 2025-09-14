'use client';

import Link from 'next/link';
import styles from './sidebar.module.css';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
        <nav>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/places">Places</Link>
            </li>
          </ul>
        </nav>
      </aside>
      {open && <div className={styles.overlay} onClick={onClose} />}
    </>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Avatar, Button, Dropdown, type MenuProps } from 'antd';
import { DownOutlined, LoginOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons';
import Sidebar from '../sidebar/Sidebar';
import styles from './header.module.css';

export default function Header() {
  const [open, setOpen] = useState(false);
  const toggleSidebar = () => setOpen(!open);
  const closeSidebar = () => setOpen(false);

  const menuItems: MenuProps['items'] = [
    {
      key: 'signup',
      label: <Link href="/signup">Sign Up</Link>,
      icon: <UserAddOutlined />,
    },
    {
      key: 'signin',
      label: <Link href="/signin">Sign In</Link>,
      icon: <LoginOutlined />,
    },
  ];

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
          <Dropdown menu={{ items: menuItems }} placement="bottomRight">
            <div className={styles.userMenu}>
              <Avatar size="small" icon={<UserOutlined />} />
              <DownOutlined />
            </div>
          </Dropdown>
        </div>
      </header>
    </>
  );
}


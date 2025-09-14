'use client';

import { Avatar, Popover, Space } from 'antd';
import { UserOutlined, DownOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons';
import Link from 'next/link';
import React from 'react';
import styles from './NoAuthUser.module.css';

const NoAuthUser: React.FC = () => {
  const t = (k: string) => ({ 'auth.signUp': 'Sign Up', 'auth.signIn': 'Sign In' }[k] || k);

  const menu = (
    <nav className={styles['user-menu__panel']} aria-label="User menu">
      <ul className={styles['user-menu__list']}>
        <li className={`${styles['user-menu__item']} ${styles['user-menu__item--signup']}`}>
          <Link href="/auth/register" className={styles['user-menu__link']}>
            <UserAddOutlined className={styles['user-menu__icon']} />
            <span className={styles['user-menu__text']}>{t('auth.signUp')}</span>
          </Link>
        </li>
        <li className={`${styles['user-menu__item']} ${styles['user-menu__item--signin']}`}>
          <Link href="/auth" className={styles['user-menu__link']}>
            <LoginOutlined className={styles['user-menu__icon']} />
            <span className={styles['user-menu__text']}>{t('auth.signIn')}</span>
          </Link>
        </li>
      </ul>
    </nav>
  );

  return (
    <Popover
      placement="bottomRight"
      trigger="click"
      content={menu}
      overlayClassName="user-menu-dropdown"  // глобальный класс только для контейнера/arrow
      arrow
    >
      <button
        type="button"
        className={styles['user-menu__trigger']}
        aria-haspopup="menu"
        aria-label="Open user menu"
      >
        <Space size={8} wrap>
          <Avatar size="small" icon={<UserOutlined />} />
          <DownOutlined className={styles['user-menu__chevron']} />
        </Space>
      </button>
    </Popover>
  );
};

export default NoAuthUser;

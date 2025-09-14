import Link from 'next/link';
import styles from './footer.module.css';

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.footerLeft}>
        <div className={styles.footerMiddle}>
          <div className={styles.footerMiddleApple}>
            <a href="https://apps.apple.com/us/app/pllace/id6746166742">
              <img src="/apple-store.svg" alt="Download on the App Store" />
            </a>
          </div>
          <div className={styles.footerMiddleGoogle}>
            <a href="https://play.google.com/store/apps/details?id=com.kapernikrs.expopllace">
              <img src="/google-play.svg" alt="Get it on Google Play" />
            </a>
          </div>
        </div>
        <div className={styles.footerCopyright}>
          <span>© 2025</span>
          <Link className={styles.footerCopyrightLink} href="https://t.me/pllacesupport">
            Support
          </Link>
        </div>
      </div>
      <div className={styles.footerRight}>
        <div className={styles.footerMenu}>
          <ul>
            <li>
              <a href="#">v1.1.3</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}


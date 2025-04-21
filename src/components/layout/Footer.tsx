import React from 'react';
import styles from './Footer.module.css';

interface FooterProps {
  onShowPrivacyModal: () => void;
}

const Footer: React.FC<FooterProps> = ({ onShowPrivacyModal }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.copyright}>
          &copy; {currentYear} Weather App. All rights reserved.
        </div>

        <div className={styles.links}>
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Powered by Open-Meteo
          </a>
          <span className={styles.divider}>•</span>
          <button onClick={onShowPrivacyModal} className={styles.link}>
            Privacy Policy
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

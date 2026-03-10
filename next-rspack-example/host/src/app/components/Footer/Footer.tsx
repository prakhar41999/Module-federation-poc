import React from 'react';
import DeloitteOlympicsWhiteLogo from '../../../../src/public/svgs/DeloitteOlympicsWhiteLogo.svg';
import Image from 'next/image';
import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <div className={styles.footerContainer} data-testid="footer-container">
      <div className={styles.footerLinks}></div>
      <div className={styles.footerLogo}>
        <Image src={DeloitteOlympicsWhiteLogo} alt="DeloitteOlympicsWhiteLogo" height={20} width={174} priority={false} />
      </div>
    </div>
  );
};

export default Footer;

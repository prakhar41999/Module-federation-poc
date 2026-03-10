import React from 'react';
import Image from 'next/image';
import styles from './Footer.module.scss';

// Use an absolute URL so the image resolves correctly when this component
// is rendered inside a remote app via Module Federation.
const LOGO_SRC = `${process.env.NEXT_PUBLIC_HOST_APP_URL || ''}/svgs/DeloitteOlympicsWhiteLogo.svg`;

const Footer = () => {
  return (
    <div className={styles.footerContainer} data-testid="footer-container">
      <div className={styles.footerLinks}></div>
      <div className={styles.footerLogo}>
        <Image src={LOGO_SRC} alt="DeloitteOlympicsWhiteLogo" height={20} width={174} unoptimized />
      </div>
    </div>
  );
};

export default Footer;

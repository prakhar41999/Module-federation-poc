import React, { useEffect, useRef, useState } from 'react';
import styles from './Header.module.scss';
import { getSession } from 'next-auth/react';
import { AccountDropdown } from '@dgplatform/ioc-components';
//import Bell from '@/public/assets/svgs/Bell.svg'
//import Image from 'next/image'
import { utilLabels } from '@/constants/label.const';
import { handleUserLogout } from '@/utils/commonUtils';
import { Session } from 'next-auth';

const Header = () => {
  const sessionFetched = useRef(false);
  const [userSession, setUserSession] = useState<Session | null>(null);
  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      setUserSession(sessionData);
    };
    if (!sessionFetched.current && !userSession?.user?.name) {
      fetchSession();
      sessionFetched.current = true;
    }
  }, [userSession?.user?.name]);

  const handleSignOut = async () => {
    handleUserLogout();
  };

  const handleListOptionClicked = (option: string) => {
    if (option === utilLabels.LOGOUT) {
      handleSignOut();
    }
  };


  return (
    <div className={styles.headerWrapper}>
      <div className={styles.gamesEditionWrapper}></div>
      <div className={styles.profileWrapper}>
        <div className={styles.profileIconWrapper}>
          <AccountDropdown
            avatarText={userSession?.user?.image || ''}
            avatarType="initials"
            email={userSession?.user?.email || ''}
            isIconOnly
            isLeadingIconForListOptions
            name={userSession?.user?.name || ''}
            onListOptionClick={handleListOptionClicked}
            options={[
              {
                value: utilLabels.LOGOUT,
              },
            ]}
            size="md"
            additionalClassesForDropdown={styles.dropdownMenu}
            isTrailingIconForListOptions={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;

import { useEffect } from "react";
import Footer from "../Footer/Footer"
import Header from "../Header/Header";
import styles from './PageLayout.module.scss';
import { signIn, useSession } from 'next-auth/react';
import { utilLabels } from "@/constants/label.const";
import SessionProvider from "../SessionProvider/SessionProvider";
import { RegularButton } from "@dgplatform/ioc-components";


const PageLayout = ({ children }: { children: React.ReactNode }) => {
    const session = useSession();
    const handleSignIn = () => {
        signIn(utilLabels.AZURE_PROVIDER, { callbackUrl: 'http://localhost:3001' });
    }

    return (
        <SessionProvider>
            <div className={styles.pageRoot}>
                <div className={styles.pageContent}>
                    <div className={styles.mainContent}>
                        <Header />
                        <div className={styles.flexContainer}>
                            <RegularButton
                                label="Sign In"
                                size="md"
                                onClick={handleSignIn}
                                regularButtonType="primary"
                                type="button"
                                id="sign-in-button"
                                isDefault={true}
                                isHovered={false}
                                isPressed={false}
                            />
                            {children}
                        </div>
                        <Footer />
                    </div>
                </div>
            </div>
        </SessionProvider>
    )
}

export default PageLayout;
import { useEffect } from "react";
import Footer from "../Footer/Footer"
import Header from "../Header/Header";
import styles from './PageLayout.module.scss';
import { signIn, useSession } from 'next-auth/react';
import { utilLabels } from "@/constants/label.const";


const PageLayout = ({ children }: { children: React.ReactNode }) => {
    const session = useSession();

    useEffect(() => {
        if (session.status === 'unauthenticated') {
            signIn(utilLabels.AZURE_PROVIDER);
        }
    }, [session]);
    return (
        <div className={styles.pageRoot}>
            <div className={styles.pageContent}>
                <div className={styles.mainContent}>
                    <Header />
                    <div className={styles.flexContainer}>
                        {children}
                    </div>
                    <Footer />
                </div>
            </div>
        </div>
    )
}

export default PageLayout;
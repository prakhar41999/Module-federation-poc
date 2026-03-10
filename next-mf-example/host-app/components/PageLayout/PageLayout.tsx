'use client';

import { useEffect } from "react";
import Footer from "../Footer/Footer"
import Header from "../Header/Header";
import styles from './PageLayout.module.scss';
import { signIn, useSession } from 'next-auth/react';
import { utilLabels } from "@/constants/label.const";


const PageLayout = ({ children }: { children: React.ReactNode }) => {
    const session = useSession();

    const handleSignIn = () => {
        console.log(session, "session");
    }

    return (
        <div className={styles.pageRoot}>
            <div className={styles.pageContent}>
                <div className={styles.mainContent}>
                    <Header />
                    <div className={styles.flexContainer}>
                        <button onClick={handleSignIn}>
                            Sign In Button
                        </button>
                        {children}
                    </div>
                    <Footer />
                </div>
            </div>
        </div>
    )
}

export default PageLayout;
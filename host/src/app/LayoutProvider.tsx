'use client';
import '@/styles/globals.scss';

import { ErrorBoundary } from "./components/ErrorBoundary";
import SessionProvider from "./components/SessionProvider/SessionProvider";
import PageLayout from "./components/PageLayout/PageLayout";


export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ErrorBoundary>
            <SessionProvider>
                <PageLayout>
                    {children}
                </PageLayout>
            </SessionProvider>
        </ErrorBoundary>
    );
};
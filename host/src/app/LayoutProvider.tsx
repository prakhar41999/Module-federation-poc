'use client';
import '@/styles/globals.scss';

import { ErrorBoundary } from "./components/ErrorBoundary";
import SessionProvider from "./components/SessionProvider/SessionProvider";


export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ErrorBoundary>
            <SessionProvider>
                {children}
            </SessionProvider>
        </ErrorBoundary>
    );
};
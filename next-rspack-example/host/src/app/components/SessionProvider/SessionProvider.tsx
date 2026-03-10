'use client';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';



export default function SessionProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextAuthSessionProvider basePath='/omb/dispatcher/ui/api/auth'>
            {children}
        </NextAuthSessionProvider>
    );
}
'use client';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';



export default function SessionProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextAuthSessionProvider basePath='http://localhost:3000/api/auth'>
            {children}
        </NextAuthSessionProvider>
    );
}
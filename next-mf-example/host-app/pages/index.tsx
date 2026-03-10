import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Head from "next/head";
import LayoutProvider from "./LayoutProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;400;700&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width" />
      </Head>
      <body
        style={{
          margin: 0,
          fontFamily: 'Inter, sans-serif',
          overflowY: 'hidden',
          position: 'fixed',
          top: 0,
          height: '100%',
          width: '100%',
        }}
      >
        <LayoutProvider>{children}</LayoutProvider>
      </body>
    </html>
  );
}

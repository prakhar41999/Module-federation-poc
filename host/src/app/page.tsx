'use client';
import { Suspense } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

export default function Home() {
  return (
    <div className="">
      <Suspense fallback={<div>Loading OMB Admin...</div>}>
        <Header />
        <Footer />
      </Suspense>
    </div>
  );
}

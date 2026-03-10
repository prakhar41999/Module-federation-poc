'use client';
/// <reference types="dtec_app1/app" />
import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import { RegularButton } from '@dgplatform/ioc-components';

const App1 = dynamic(() => import('dtec_app1/app'), { ssr: false });

export default function Home() {
  const [showApp1, setShowApp1] = useState(false);
  return (
    <div className="">
      Host App
      <RegularButton
        label="Load DTEC App 1"
        size="md"
        regularButtonType="primary"
        onClick={() => {
          setShowApp1(true);
        }}
      />
      <Suspense fallback={<div>Loading DTEC App 1...</div>}>
        {
          showApp1 && <App1 />
        }
      </Suspense>
    </div>
  );
}

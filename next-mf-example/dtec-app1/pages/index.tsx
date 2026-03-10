import { Suspense } from "react";
import dynamic from "next/dynamic";

const LayoutProvider = dynamic(() => import("host_app/LayoutProvider"), { ssr: false });


export default function Page() {
    return (
        <Suspense fallback={<div>Loading LayoutProvider...</div>}>
            <LayoutProvider>
                <h1>DTEC App 1</h1>
            </LayoutProvider>
        </Suspense>
    )
}


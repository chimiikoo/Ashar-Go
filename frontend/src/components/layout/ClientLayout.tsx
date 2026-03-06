'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { LocaleProvider } from '@/lib/locale-context';
import { AuthProvider } from '@/lib/auth-context';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const NO_FOOTER_PATHS = ['/create', '/auth'];

export default function ClientLayout({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <LocaleProvider>
                <LayoutInner>{children}</LayoutInner>
            </LocaleProvider>
        </AuthProvider>
    );
}

function LayoutInner({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const showFooter = !NO_FOOTER_PATHS.some(p => pathname.startsWith(p));

    return (
        <>
            <Header />
            <main style={{ minHeight: '100vh', paddingTop: '66px' }}>
                {children}
            </main>
            {showFooter && <Footer />}
        </>
    );
}

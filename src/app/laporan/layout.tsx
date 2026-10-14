import React from 'react';
import HeaderOne from '@/components/header/header-one';
import FooterOne from '@/components/footer/footer-one';
import BackToTop from '@/components/back-to-top';
import MainProvider from '@/components/provider/main-provider';

export default function LaporanLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainProvider>
      <HeaderOne transparent={false} />
      <main>{children}</main>
      <FooterOne />
      <BackToTop />
    </MainProvider>
  );
}

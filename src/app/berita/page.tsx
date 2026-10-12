import React, { Suspense } from 'react';
import { Metadata } from 'next';
import HeaderOne from '@/components/header/header-one';
import FooterOne from '@/components/footer/footer-one';
import BackToTop from '@/components/back-to-top';
import MainProvider from '@/components/provider/main-provider';
import BeritaClient from '@/components/berita/berita-client';

export const metadata: Metadata = {
  title: 'Berita & Publikasi — Tracer Study Kalimantan Timur',
  description:
    'Arsip resmi berita, pengumuman survei tracer study, dan wawasan karier vokasi Dinas Pendidikan dan Kebudayaan Provinsi Kalimantan Timur.',
};

export default function BeritaPage() {
  return (
    <MainProvider>
      <HeaderOne transparent={false} />
      <main>
        <Suspense
          fallback={
            <div className="container pt-180 pb-120 text-center">
              <div
                className="spinner-border text-danger"
                style={{ color: 'var(--tp-theme-primary)' }}
                role="status"
              >
                <span className="visually-hidden">Memuat arsip...</span>
              </div>
              <p className="mt-3 text-muted">Memuat arsip berita &amp; publikasi...</p>
            </div>
          }
        >
          <BeritaClient />
        </Suspense>
      </main>
      <FooterOne />
      <BackToTop />
    </MainProvider>
  );
}

import React, { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { HomeSvg } from '@/components/svg';
import TracerFormWizard from '@/components/tracer/TracerFormWizard';

export const metadata: Metadata = {
  title: 'Formulir Kuesioner Tracer Study — Kalimantan Timur',
  description: 'Isi instrumen kuesioner resmi Tracer Study SMA & SMK Kalimantan Timur untuk pemetaan mutu dan keterserapan tamatan.',
};

export default function TracerPage() {
  return (
    <main>
      <section
        className="tp-breadcrumb__area pt-60 pb-20 p-relative z-index-1 fix"
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #F6F4EE 100%)',
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-sm-12 text-center">
              <div className="tp-breadcrumb__content">
                <div className="tp-breadcrumb__list justify-content-center mb-10">
                  <span>
                    <Link href="/" aria-label="Beranda">
                      <HomeSvg />
                    </Link>
                  </span>
                  <span className="color">Formulir Kuesioner</span>
                  <span style={{ color: 'var(--tp-theme-primary)', fontWeight: 600 }}>Tahun Ajaran 2024 / 2025</span>
                </div>
                <h1 className="tp-breadcrumb__title" style={{ fontSize: '38px', fontWeight: 700, color: '#031F42' }}>
                  Instrumen Kuesioner Tracer Study
                </h1>
                <p className="mt-2 text-muted mb-0" style={{ fontSize: '15px' }}>
                  Pemerintah Provinsi Kalimantan Timur &bull; Dinas Pendidikan dan Kebudayaan
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Suspense
        fallback={
          <div className="text-center py-5">
            <div
              className="spinner-border"
              style={{ color: 'var(--tp-theme-primary)' }}
              role="status"
            >
              <span className="visually-hidden">Memuat formulir…</span>
            </div>
          </div>
        }
      >
        <TracerFormWizard />
      </Suspense>
    </main>
  );
}

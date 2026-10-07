import React, { Suspense } from 'react';
import { Metadata } from 'next';
import TracerFormWizard from '@/components/tracer/TracerFormWizard';

export const metadata: Metadata = {
  title: 'Formulir Kuesioner Tracer Study — Kalimantan Timur',
  description: 'Isi instrumen kuesioner resmi Tracer Study SMA & SMK Kalimantan Timur untuk pemetaan mutu dan keterserapan tamatan.',
};

export default function TracerPage() {
  return (
    <main>
      <section className="breadcrumb__area include-bg pt-150 pb-50" style={{ background: '#0d1b2a' }}>
        <div className="container">
          <div className="row">
            <div className="col-xxl-12">
              <div className="breadcrumb__content p-relative z-index-1 text-center">
                <span className="badge bg-success rounded-pill px-3 py-2 mb-2 text-white fw-semibold">
                  TAHUN AJARAN 2024 / 2025
                </span>
                <h3 className="breadcrumb__title text-white">Instrumen Kuesioner Tracer Study</h3>
                <p className="text-white-50 mb-0" style={{ fontSize: '15px' }}>
                  Pemerintah Provinsi Kalimantan Timur &bull; Dinas Pendidikan dan Kebudayaan
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Memuat formulir…</span>
          </div>
        </div>
      }>
        <TracerFormWizard />
      </Suspense>
    </main>
  );
}

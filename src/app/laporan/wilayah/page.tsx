import React, { Suspense } from 'react';
import { Metadata } from 'next';
import LaporanTabsHeader from '@/components/laporan/LaporanTabsHeader';
import LaporanWilayahView from '@/components/laporan/LaporanWilayahView';

export const metadata: Metadata = {
  title: 'Laporan per Wilayah — Tracer Study Kalimantan Timur',
  description:
    'Portal agregat data statistik sebaran 10 Kabupaten/Kota Kalimantan Timur untuk penelusuran lulusan SMA dan SMK.',
};

export default function LaporanWilayahPage() {
  return (
    <>
      <LaporanTabsHeader
        activeTab="wilayah"
        title="Laporan Statistik per Wilayah"
        subtitle="Sebaran capaian keterserapan alumni di 10 Kabupaten/Kota se-Kalimantan Timur"
      />
      <Suspense
        fallback={
          <div className="container py-5 text-center">
            <div className="spinner-border" style={{ color: '#AB0C2F' }} role="status">
              <span className="visually-hidden">Memuat data wilayah...</span>
            </div>
            <p className="mt-2 text-muted">Memuat data wilayah...</p>
          </div>
        }
      >
        <LaporanWilayahView />
      </Suspense>
    </>
  );
}

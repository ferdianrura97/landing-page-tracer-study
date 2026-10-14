import React, { Suspense } from 'react';
import { Metadata } from 'next';
import LaporanTabsHeader from '@/components/laporan/LaporanTabsHeader';
import LaporanSekolahView from '@/components/laporan/LaporanSekolahView';

export const metadata: Metadata = {
  title: 'Laporan per Sekolah — Tracer Study Kalimantan Timur',
  description:
    'Direktori capaian survei penelusuran tamatan jenjang SMA dan SMK se-Kalimantan Timur untuk pemetaan relevansi dunia kerja dan pendidikan.',
};

export default function LaporanSekolahPage() {
  return (
    <>
      <LaporanTabsHeader
        activeTab="sekolah"
        title="Laporan Statistik per Sekolah"
        subtitle="Direktori capaian survei alumni pada 216 satuan pendidikan SMA & SMK se-Kalimantan Timur"
      />
      <Suspense
        fallback={
          <div className="container py-5 text-center">
            <div className="spinner-border" style={{ color: '#AB0C2F' }} role="status">
              <span className="visually-hidden">Memuat data sekolah...</span>
            </div>
            <p className="mt-2 text-muted">Memuat data sekolah...</p>
          </div>
        }
      >
        <LaporanSekolahView />
      </Suspense>
    </>
  );
}

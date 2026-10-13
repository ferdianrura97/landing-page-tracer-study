'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { fetchApi } from '@/lib/api';
import type { ApexOptions } from 'apexcharts';

// Dynamic import for ReactApexChart to prevent SSR hydration mismatch
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface RingkasanStatistik {
  total_alumni: number;
  total_responden: number;
  persentase_partisipasi: number;
  status_distribusi: {
    bekerja: number;
    kuliah: number;
    wirausaha: number;
    bekerja_kuliah_wirausaha: number;
    belum_bekerja: number;
  };
}

interface KotaStatistik {
  id: number;
  kode: string;
  nama_kota: string;
  total_sekolah: number;
  total_responden: number;
}

export default function TracerPublicCharts() {
  const [stats, setStats] = useState<RingkasanStatistik | null>(null);
  const [kotaList, setKotaList] = useState<KotaStatistik[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [resStats, resKota] = await Promise.all([
          fetchApi<{ sukses: boolean; data: RingkasanStatistik }>('/publik/statistik'),
          fetchApi<{ sukses: boolean; data: KotaStatistik[] }>('/publik/sebaran-kota'),
        ]);

        if (resStats.sukses) setStats(resStats.data);
        if (resKota.sukses) setKotaList(resKota.data);
      } catch (err) {
        console.error('Gagal memuat data grafik publik:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // 1. Donut Chart Options
  const donutSeries = stats ? [
    stats.status_distribusi.bekerja,
    stats.status_distribusi.kuliah,
    stats.status_distribusi.wirausaha,
    stats.status_distribusi.bekerja_kuliah_wirausaha,
    stats.status_distribusi.belum_bekerja,
  ] : [7, 7, 2, 2, 2];

  const donutOptions: ApexOptions = {
    chart: { type: 'donut', toolbar: { show: false } },
    labels: ['Bekerja', 'Kuliah', 'Wirausaha', 'Kerja + Kuliah/Usaha', 'Mencari Kerja'],
    colors: ['#10b981', '#38bdf8', '#f59e0b', '#8b5cf6', '#ec4899'],
    legend: { position: 'bottom', fontSize: '13px' },
    dataLabels: { enabled: true },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Responden',
              formatter: () => `${stats?.total_responden || 20}`,
            },
          },
        },
      },
    },
  };

  // 2. Bar Chart Options
  const barCategories = kotaList.map((k) => k.nama_kota.replace(/^(KOTA|KABUPATEN)\s+/i, ''));
  const barDataResponden = kotaList.map((k) => k.total_responden);
  const barDataSekolah = kotaList.map((k) => k.total_sekolah);

  const barSeries = [
    { name: 'Responden Mengisi', data: barDataResponden },
    { name: 'Total Sekolah', data: barDataSekolah },
  ];

  const barOptions: ApexOptions = {
    chart: { type: 'bar', toolbar: { show: false } },
    plotOptions: {
      bar: { horizontal: false, columnWidth: '55%', borderRadius: 4 },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: {
      categories: barCategories.length ? barCategories : ['Samarinda', 'Balikpapan', 'Kukar', 'Bontang', 'Paser', 'Berau', 'Kubar', 'Kutim', 'PPU', 'Mahulu'],
      labels: { style: { fontSize: '11px' } },
    },
    colors: ['#AB0C2F', '#0284c7'],
    legend: { position: 'top', fontSize: '13px' },
  };

  return (
    <section id="statistik" className="py-100" style={{ background: '#f8fafc' }}>
      <div className="container">
        <div className="text-center mb-50">
          <span className="badge text-danger px-3 py-2 rounded-pill fw-bold mb-2">
            TRANSPARANSI DATA
          </span>
          <h2 className="fw-bold text-dark mb-2" style={{ fontSize: '32px' }}>
            Statistik Agregat Tracer Study Kaltim
          </h2>
          <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Gambaran sebaran karier lulusan SMA &amp; SMK serta tingkat partisipasi di 10 Kabupaten/Kota se-Kalimantan Timur secara transparan.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Memuat visualisasi statistik publik…</p>
          </div>
        ) : (
          <div className="row g-4">
            {/* Chart 1: Donut Karir */}
            <div className="col-lg-5">
              <div className="bg-white p-4 rounded-4 shadow-sm h-100 border">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <h5 className="fw-bold mb-1 text-dark">Distribusi Karir Lulusan</h5>
                    <small className="text-muted">Persentase pilihan utama alumni</small>
                  </div>
                  <span className="badge bg-success text-white">Live Data</span>
                </div>
                <div style={{ minHeight: '340px' }}>
                  <Chart options={donutOptions} series={donutSeries} type="donut" height={340} />
                </div>
              </div>
            </div>

            {/* Chart 2: Bar Sebaran Wilayah */}
            <div className="col-lg-7">
              <div className="bg-white p-4 rounded-4 shadow-sm h-100 border">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <h5 className="fw-bold mb-1 text-dark">Sebaran per Kabupaten / Kota</h5>
                    <small className="text-muted">Partisipasi responden dan jumlah sekolah</small>
                  </div>
                  <span className="badge bg-primary text-white">10 Daerah</span>
                </div>
                <div style={{ minHeight: '340px' }}>
                  <Chart options={barOptions} series={barSeries} type="bar" height={340} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

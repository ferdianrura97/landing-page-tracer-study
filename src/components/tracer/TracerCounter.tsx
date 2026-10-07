'use client';

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';

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
  sebaran_jenjang: Array<{ jenjang: string; _count: { jenjang: number } }>;
}

export default function TracerCounter() {
  const [stats, setStats] = useState<RingkasanStatistik | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetchApi<{ sukses: boolean; data: RingkasanStatistik }>('/publik/statistik');
        if (res.sukses) setStats(res.data);
      } catch (e) {
        console.error('Gagal memuat statistik publik:', e);
      }
    }
    loadStats();
  }, []);

  const totalSekolah = stats?.sebaran_jenjang.reduce((acc, curr) => acc + curr._count.jenjang, 0) || 216;

  const counterItems = [
    {
      id: 1,
      icon: 'fa-solid fa-users',
      count: stats?.total_alumni.toLocaleString('id-ID') || '20',
      title: 'Total Alumni Terdaftar',
      subtitle: 'Pangkalan data sekolah Kaltim',
      badgeColor: '#e0f2fe',
      textColor: '#0284c7',
    },
    {
      id: 2,
      icon: 'fa-solid fa-clipboard-check',
      count: stats?.total_responden.toLocaleString('id-ID') || '20',
      title: 'Responden Mengisi',
      subtitle: `${stats?.persentase_partisipasi || 100}% partisipasi aktif`,
      badgeColor: '#dcfce7',
      textColor: '#16a34a',
    },
    {
      id: 3,
      icon: 'fa-solid fa-school',
      count: totalSekolah.toLocaleString('id-ID'),
      title: 'Satuan Pendidikan',
      subtitle: 'SMA & SMK se-Kaltim',
      badgeColor: '#f3e8ff',
      textColor: '#9333ea',
    },
    {
      id: 4,
      icon: 'fa-solid fa-map-location-dot',
      count: '10',
      title: 'Kabupaten & Kota',
      subtitle: 'Cakupan wilayah Kalimantan Timur',
      badgeColor: '#fef3c7',
      textColor: '#d97706',
    },
  ];

  return (
    <section className="counter-area py-5" style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container">
        <div className="row g-4">
          {counterItems.map((item) => (
            <div key={item.id} className="col-lg-3 col-sm-6">
              <div 
                className="p-4 rounded-4 text-center h-100"
                style={{ 
                  background: '#f8fafc', 
                  border: '1px solid #e2e8f0',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                <div 
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                  style={{ width: '56px', height: '56px', background: item.badgeColor, color: item.textColor }}
                >
                  <i className={`${item.icon} fa-xl`}></i>
                </div>
                <h3 className="fw-bold mb-1 text-dark" style={{ fontSize: '28px' }}>
                  {item.count}
                </h3>
                <h6 className="fw-semibold text-secondary mb-1" style={{ fontSize: '15px' }}>
                  {item.title}
                </h6>
                <p className="text-muted mb-0" style={{ fontSize: '12px' }}>
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

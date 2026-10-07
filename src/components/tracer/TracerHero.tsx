'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TracerHero() {
  const router = useRouter();
  const [quickNisn, setQuickNisn] = useState('');

  const handleQuickCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickNisn.trim()) {
      router.push(`/tracer?nisn=${quickNisn.trim()}`);
    } else {
      router.push('/tracer');
    }
  };

  return (
    <section className="tp-hero-area p-relative pt-180 pb-120" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #e6f4f1 100%)' }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-7 col-lg-7">
            <div className="tp-hero-content">
              <div className="d-inline-flex align-items-center mb-20 px-3 py-1 bg-white rounded-pill shadow-sm">
                <span className="badge bg-success rounded-pill me-2" style={{ padding: '6px 12px', fontSize: '11px' }}>RESMI</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E856C' }}>
                  Dinas Pendidikan &amp; Kebudayaan Provinsi Kalimantan Timur
                </span>
              </div>
              <h1 className="tp-hero-title mb-20" style={{ fontSize: '42px', lineHeight: 1.25, color: '#0d1b2a', fontWeight: 700 }}>
                Langkah Nyata Memetakan Jejak Karier Alumni SMA &amp; SMK Se-Kaltim
              </h1>
              <p className="mb-35" style={{ fontSize: '17px', color: '#4a5568', lineHeight: 1.6, maxWidth: '580px' }}>
                Bantu almamater dan Pemprov Kaltim meningkatkan relevansi kurikulum, memperluas kemitraan dunia industri, dan membuka peluang karier bagi adik-adik kelasmu.
              </p>

              {/* Quick Check Form Box */}
              <div className="bg-white p-4 rounded-4 shadow-sm mb-30" style={{ maxWidth: '540px', border: '1px solid #d1fae5' }}>
                <p className="mb-2 fw-semibold text-dark" style={{ fontSize: '14px' }}>
                  <i className="fa-solid fa-id-card me-2 text-success"></i>
                  Cek Data Alumni &amp; Mulai Kuesioner:
                </p>
                <form onSubmit={handleQuickCheck} className="d-flex flex-column flex-sm-row gap-2">
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="Masukkan 10 digit NISN…"
                    value={quickNisn}
                    onChange={(e) => setQuickNisn(e.target.value.replace(/\D/g, ''))}
                    className="form-control px-3 py-2 rounded-3"
                    style={{ border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                  <button
                    type="submit"
                    className="tp-btn text-white rounded-3 px-4 py-2 text-nowrap"
                    style={{ background: '#1E856C', border: 'none', fontWeight: 600 }}
                  >
                    Mulai Isi <i className="fa-solid fa-arrow-right ms-1"></i>
                  </button>
                </form>
                <small className="text-muted d-block mt-2" style={{ fontSize: '12px' }}>
                  *Wajib 10 digit NISN terdaftar di pangkalan data sekolah se-Kalimantan Timur.
                </small>
              </div>

              <div className="d-flex align-items-center gap-3">
                <Link href="#alur" className="text-decoration-none fw-semibold text-secondary" style={{ fontSize: '14px' }}>
                  <i className="fa-solid fa-circle-info me-1 text-success"></i> Pelajari Alur Pengisian
                </Link>
                <span className="text-muted">&bull;</span>
                <Link href="#statistik" className="text-decoration-none fw-semibold text-secondary" style={{ fontSize: '14px' }}>
                  <i className="fa-solid fa-chart-pie me-1 text-primary"></i> Statistik Publik
                </Link>
              </div>
            </div>
          </div>

          <div className="col-xl-5 col-lg-5 d-none d-lg-block">
            <div className="tp-hero-thumb p-relative text-center">
              <div 
                className="p-5 rounded-4 bg-white shadow"
                style={{ 
                  border: '2px solid rgba(30, 133, 108, 0.15)',
                  background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)'
                }}
              >
                <div className="mb-4">
                  <div 
                    className="d-inline-flex align-items-center justify-content-center rounded-circle"
                    style={{ width: '80px', height: '80px', background: 'rgba(30, 133, 108, 0.1)', color: '#1E856C' }}
                  >
                    <i className="fa-solid fa-chart-line fa-2xl"></i>
                  </div>
                </div>
                <h4 className="fw-bold mb-2 text-dark">Data Nyata, Masa Depan Cerah</h4>
                <p className="text-muted mb-4" style={{ fontSize: '14px' }}>
                  Survei dirancang ringkas (3-5 menit) dengan percabangan cerdas: hanya mengisi pertanyaan yang relevan dengan kondisimu saat ini.
                </p>
                <div className="row g-2 text-start">
                  <div className="col-6">
                    <div className="p-3 rounded-3 bg-light border">
                      <div className="fw-bold text-success mb-1" style={{ fontSize: '20px' }}>SMA</div>
                      <small className="text-muted">Kesiapan Lanjut Studi &amp; Jalur Mandiri</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 rounded-3 bg-light border">
                      <div className="fw-bold text-primary mb-1" style={{ fontSize: '20px' }}>SMK</div>
                      <small className="text-muted">Kesesuaian Kejuruan &amp; Serapan Kerja BKK</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

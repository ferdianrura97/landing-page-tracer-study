'use client';

import React from 'react';
import Link from 'next/link';
import { HomeSvg } from '@/components/svg';

export default function LaporanTabsHeader({
  activeTab,
  title,
  subtitle,
}: {
  activeTab: 'wilayah' | 'sekolah';
  title: string;
  subtitle: string;
}) {
  return (
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
              {/* Breadcrumb path */}
              <div className="tp-breadcrumb__list justify-content-center mb-10">
                <span>
                  <Link href="/" aria-label="Beranda">
                    <HomeSvg />
                  </Link>
                </span>
                <span className="color">Portal Publik</span>
                <span style={{ color: 'var(--tp-theme-primary)', fontWeight: 600 }}>
                  Statistik &amp; Pelaporan
                </span>
              </div>

              {/* Title & Subtitle */}
              <h1
                className="tp-breadcrumb__title"
                style={{ fontSize: '38px', fontWeight: 700, color: '#031F42' }}
              >
                {title}
              </h1>
              <p className="mt-2 text-muted mb-4" style={{ fontSize: '15px' }}>
                {subtitle}
              </p>

              {/* Tab Switcher: Per Wilayah <-> Per Sekolah */}
              <div className="d-inline-flex align-items-center p-1 rounded-pill bg-white border shadow-sm mb-2">
                <Link
                  href="/laporan/wilayah"
                  className={`btn rounded-pill px-4 py-2 text-decoration-none fw-semibold ${
                    activeTab === 'wilayah' ? 'text-white shadow-sm' : 'text-muted'
                  }`}
                  style={{
                    background: activeTab === 'wilayah' ? '#AB0C2F' : 'transparent',
                    fontSize: '13.5px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <i className="fa-solid fa-map-location-dot me-2"></i>
                  Laporan per Wilayah (10 Daerah)
                </Link>

                <Link
                  href="/laporan/sekolah"
                  className={`btn rounded-pill px-4 py-2 text-decoration-none fw-semibold ${
                    activeTab === 'sekolah' ? 'text-white shadow-sm' : 'text-muted'
                  }`}
                  style={{
                    background: activeTab === 'sekolah' ? '#AB0C2F' : 'transparent',
                    fontSize: '13.5px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <i className="fa-solid fa-school me-2"></i>
                  Laporan per Sekolah (216 Satuan)
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

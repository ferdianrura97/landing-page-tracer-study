'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { RightArrow } from "../svg";
import { fetchApi } from "@/lib/api";

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

export default function HeroAreaOne() {
  const [stats, setStats] = useState<RingkasanStatistik | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetchApi<{ sukses: boolean; data: RingkasanStatistik }>('/publik/statistik');
        if (res.sukses && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error("Gagal memuat statistik live hero:", err);
      }
    }
    loadStats();
  }, []);

  // Metrik dinamis dari API /publik/statistik dengan fallback data riil awal
  const totalSekolah = stats?.sebaran_jenjang.reduce((acc, curr) => acc + curr._count.jenjang, 0) || 216;
  const totalResponden = stats?.total_responden || 21;
  const countBekerja = (stats?.status_distribusi.bekerja ?? 7) + (stats?.status_distribusi.bekerja_kuliah_wirausaha ?? 2);
  const countKuliah = stats?.status_distribusi.kuliah ?? 7;
  const countWirausaha = stats?.status_distribusi.wirausaha ?? 3;

  const countTerserap = countBekerja + countKuliah + countWirausaha;
  const pctTerserap = totalResponden > 0 ? ((countTerserap / totalResponden) * 100).toFixed(1) : "90.5";

  // Perhitungan tinggi bar dinamis (skala maks 70px)
  const barHeightBekerja = Math.min(75, Math.max(20, Math.round((countBekerja / totalResponden) * 120)));
  const barHeightKuliah = Math.min(70, Math.max(18, Math.round((countKuliah / totalResponden) * 120)));
  const barHeightWirausaha = Math.min(60, Math.max(16, Math.round((countWirausaha / totalResponden) * 120)));
  const progressWidth = Math.min(95, Math.max(10, Math.round((Number(pctTerserap) / 100) * 95)));

  return (
    <section className="tp-hero-area tp-hero-area-kaltim-light">
      <div className="tp-hero-item">
        <div className="container">
          <div className="row align-items-center">
            {/* SISI KIRI: HEADLINE & CTA */}
            <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12">
              <div className="tp-hero-wrapper wow fadeInUp" data-wow-delay=".2s">
                {/* Eyebrow Badge */}
                <div className="d-inline-flex align-items-center mb-20 px-3 py-1 rounded-pill hero-eyebrow-badge">
                  <span className="hero-eyebrow-text">
                    PEMERINTAH PROVINSI KALIMANTAN TIMUR &bull; DISDIKBUD
                  </span>
                </div>

                {/* Main Title */}
                <h1 className="tp-hero-title mb-20">
                  <span style={{ color: "var(--tp-theme-primary)" }}>Satu Data</span> Rekam Jejak Tamatan SMA &amp; SMK se-Kalimantan Timur
                </h1>

                {/* Description */}
                <p className="tp-hero-desc mb-35">
                  Penjaminan mutu pendidikan vokasi, pemetaan keterserapan kerja, dan jembatan karier generasi muda menyongsong Ibu Kota Nusantara.
                </p>

                {/* CTA Buttons */}
                <div className="d-flex flex-wrap align-items-center gap-3">
                  <Link className="tp-btn hero-btn-primary" href="/tracer">
                    Mulai Isi Kuesioner
                    <span className="ms-2">
                      <RightArrow clr="#ffffff" />
                    </span>
                  </Link>
                  <Link className="hero-btn-secondary-light" href="/laporan/wilayah">
                    <i className="fa-solid fa-chart-simple me-2"></i>
                    Lihat Rekapitulasi Survey
                  </Link>
                </div>
              </div>
            </div>

            {/* SISI KANAN: VEKTOR ILUSTRASI DENGAN DATA DINAMIS */}
            <div className="col-xxl-6 col-xl-6 col-lg-6 d-none d-lg-block">
              <div className="hero-vector-wrapper position-relative text-center wow fadeInRight" data-wow-delay=".3s">
                {/* FLOATING CARD 1: TOP LEFT (ALUMNI TERDATA DINAMIS) */}
                <div className="hero-floating-card hero-float-1 position-absolute d-flex align-items-center gap-2 bg-white rounded-3 shadow-sm px-3 py-2 border">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                    style={{ width: "38px", height: "38px", background: "rgba(171, 12, 47, 0.1)", color: "#AB0C2F" }}
                  >
                    <i className="fa-solid fa-graduation-cap fa-lg"></i>
                  </div>
                  <div className="text-start">
                    <span className="text-muted d-block" style={{ fontSize: "10.5px", fontWeight: 600 }}>Alumni Terdata</span>
                    <strong className="text-dark" style={{ fontSize: "12.5px" }}>{totalResponden} Responden</strong>
                  </div>
                </div>

                {/* FLOATING CARD 2: BOTTOM RIGHT (TINGKAT KETERSERAPAN DINAMIS) */}
                <div className="hero-floating-card hero-float-2 position-absolute d-flex align-items-center gap-2 bg-white rounded-3 shadow-sm px-3 py-2 border">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                    style={{ width: "38px", height: "38px", background: "rgba(16, 185, 129, 0.12)", color: "#10b981" }}
                  >
                    <i className="fa-solid fa-chart-line fa-lg"></i>
                  </div>
                  <div className="text-start">
                    <span className="text-muted d-block" style={{ fontSize: "10.5px", fontWeight: 600 }}>Tingkat Keterserapan</span>
                    <strong style={{ fontSize: "13px", color: "var(--tp-theme-primary)" }}>{pctTerserap}% Sukses</strong>
                  </div>
                </div>

                {/* FLOATING CARD 3: BOTTOM LEFT (CAKUPAN SEKOLAH & DAERAH DINAMIS) */}
                <div className="hero-floating-card hero-float-3 position-absolute d-flex align-items-center gap-2 bg-white rounded-3 shadow-sm px-3 py-2 border">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                    style={{ width: "36px", height: "36px", background: "rgba(2, 132, 199, 0.12)", color: "#0284c7" }}
                  >
                    <i className="fa-solid fa-school fa-sm"></i>
                  </div>
                  <div className="text-start">
                    <span className="text-muted d-block" style={{ fontSize: "10px", fontWeight: 600 }}>Cakupan Sekolah</span>
                    <strong className="text-dark" style={{ fontSize: "12px" }}>{totalSekolah} Satuan &amp; IKN</strong>
                  </div>
                </div>

                {/* MAIN VECTOR SVG CANVAS DENGAN DATA DINAMIS */}
                <div className="hero-svg-canvas position-relative">
                  <svg
                    viewBox="0 0 520 440"
                    className="w-100 h-auto"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ maxHeight: "430px" }}
                  >
                    <defs>
                      <linearGradient id="heroScreenGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#f8fafc" />
                      </linearGradient>

                      <linearGradient id="heroChartFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#AB0C2F" stopOpacity="0.32" />
                        <stop offset="100%" stopColor="#AB0C2F" stopOpacity="0.02" />
                      </linearGradient>

                      <linearGradient id="heroBar1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#AB0C2F" />
                        <stop offset="100%" stopColor="#880824" />
                      </linearGradient>

                      <linearGradient id="heroBar2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0284c7" />
                        <stop offset="100%" stopColor="#0369a1" />
                      </linearGradient>

                      <linearGradient id="heroBar3" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>

                      <linearGradient id="heroArrowGrad" x1="0" y1="1" x2="1" y2="0">
                        <stop offset="0%" stopColor="#031F42" />
                        <stop offset="100%" stopColor="#AB0C2F" />
                      </linearGradient>

                      <filter id="heroShadow" x="-10%" y="-10%" width="130%" height="130%">
                        <feDropShadow dx="0" dy="16" stdDeviation="20" floodColor="#031f42" floodOpacity="0.1" />
                      </filter>
                    </defs>

                    {/* Ambient Background Aura Rings */}
                    <circle cx="270" cy="220" r="170" fill="none" stroke="rgba(171, 12, 47, 0.08)" strokeWidth="1.5" strokeDasharray="6 6" />
                    <circle cx="270" cy="220" r="130" fill="none" stroke="rgba(3, 31, 66, 0.06)" strokeWidth="1.5" />

                    {/* Desk Platform Base */}
                    <ellipse cx="265" cy="395" rx="200" ry="24" fill="#e2e8f0" opacity="0.65" />
                    <ellipse cx="265" cy="390" rx="170" ry="16" fill="#cbd5e1" opacity="0.4" />

                    {/* MAIN ANALYTICS MONITOR / DASHBOARD SCREEN */}
                    <g filter="url(#heroShadow)">
                      {/* Stand Base */}
                      <rect x="235" y="340" width="60" height="45" rx="6" fill="#94a3b8" />
                      <ellipse cx="265" cy="385" rx="55" ry="9" fill="#64748b" />

                      {/* Monitor Outer Frame */}
                      <rect x="75" y="90" width="375" height="255" rx="18" fill="#031F42" />

                      {/* Screen Glass Bezel */}
                      <rect x="85" y="100" width="355" height="235" rx="12" fill="url(#heroScreenGrad)" />

                      {/* Top Window Bar */}
                      <rect x="85" y="100" width="355" height="34" rx="12" fill="#f1f5f9" />
                      <circle cx="106" cy="117" r="4.5" fill="#ef4444" />
                      <circle cx="120" cy="117" r="4.5" fill="#f59e0b" />
                      <circle cx="134" cy="117" r="4.5" fill="#10b981" />
                      <rect x="156" y="110" width="160" height="14" rx="7" fill="#e2e8f0" />
                      <text x="236" y="121" fill="#64748b" fontSize="8" fontWeight="600" textAnchor="middle">
                        tracer-study.kaltimprov.go.id
                      </text>

                      {/* Inside Dashboard Content */}
                      {/* Chart Grid Lines */}
                      <g opacity="0.4">
                        <line x1="105" y1="165" x2="420" y2="165" stroke="#e2e8f0" strokeDasharray="3 3" />
                        <line x1="105" y1="205" x2="420" y2="205" stroke="#e2e8f0" strokeDasharray="3 3" />
                        <line x1="105" y1="245" x2="420" y2="245" stroke="#e2e8f0" strokeDasharray="3 3" />
                        <line x1="105" y1="285" x2="420" y2="285" stroke="#cbd5e1" strokeWidth="1.5" />
                      </g>

                      {/* Shaded Area Graph */}
                      <path
                        d="M 115 285 L 115 240 Q 160 250 200 200 T 290 170 T 360 145 T 415 130 L 415 285 Z"
                        fill="url(#heroChartFill)"
                      />

                      {/* Trend Line Curve */}
                      <path
                        d="M 115 240 Q 160 250 200 200 T 290 170 T 360 145 T 415 130"
                        stroke="#AB0C2F"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        fill="none"
                      />

                      {/* Data Point Glowing Dots */}
                      <circle cx="115" cy="240" r="4.5" fill="#AB0C2F" stroke="#ffffff" strokeWidth="1.5" />
                      <circle cx="200" cy="200" r="4.5" fill="#AB0C2F" stroke="#ffffff" strokeWidth="1.5" />
                      <circle cx="290" cy="170" r="4.5" fill="#AB0C2F" stroke="#ffffff" strokeWidth="1.5" />
                      <circle cx="360" cy="145" r="5" fill="#AB0C2F" stroke="#ffffff" strokeWidth="2" />
                      <circle cx="415" cy="130" r="6" fill="#AB0C2F" stroke="#ffffff" strokeWidth="2.5" />

                      {/* Metric Comparison Mini Bars (Dinamis Berdasarkan Data Riil) */}
                      <g>
                        {/* Bar 1 - Bekerja */}
                        <rect x="135" y={285 - barHeightBekerja} width="22" height={barHeightBekerja} rx="5" fill="url(#heroBar1)" />
                        <text x="146" y={279 - barHeightBekerja} fill="#AB0C2F" fontSize="8" fontWeight="700" textAnchor="middle">
                          Kerja {countBekerja}
                        </text>

                        {/* Bar 2 - Kuliah */}
                        <rect x="180" y={285 - barHeightKuliah} width="22" height={barHeightKuliah} rx="5" fill="url(#heroBar2)" />
                        <text x="191" y={279 - barHeightKuliah} fill="#0284c7" fontSize="8" fontWeight="700" textAnchor="middle">
                          Kuliah {countKuliah}
                        </text>

                        {/* Bar 3 - Wirausaha */}
                        <rect x="225" y={285 - barHeightWirausaha} width="22" height={barHeightWirausaha} rx="5" fill="url(#heroBar3)" />
                        <text x="236" y={279 - barHeightWirausaha} fill="#d97706" fontSize="8" fontWeight="700" textAnchor="middle">
                          Usaha {countWirausaha}
                        </text>
                      </g>

                      {/* TARGET INDICATOR CARD INSIDE SCREEN (DINAMIS SESUAI DATA) */}
                      <rect x="295" y="195" width="124" height="75" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                      <circle cx="315" cy="216" r="10" fill="rgba(171, 12, 47, 0.1)" />
                      <path d="M 311 216 L 314 219 L 320 213" stroke="#AB0C2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <text x="332" y="214" fill="#031F42" fontSize="9" fontWeight="700">Terserap Terdata</text>
                      <text x="332" y="226" fill="#64748b" fontSize="7.8" fontWeight="500">
                        {countTerserap} dari {totalResponden} Alumni
                      </text>
                      <rect x="306" y="236" width="102" height="6" rx="3" fill="#f1f5f9" />
                      <rect x="306" y="236" width={progressWidth} height="6" rx="3" fill="#AB0C2F" />
                      <text x="306" y="255" fill="#10b981" fontSize="8" fontWeight="700">
                        ▲ {pctTerserap}% Keterserapan
                      </text>
                    </g>

                    {/* 3D FLOATING GRADUATION CAP (TOGA) */}
                    <g className="hero-floating-toga" filter="url(#heroShadow)">
                      <path
                        d="M 68 85 L 68 110 C 68 126, 138 126, 138 110 L 138 85 Z"
                        fill="#0b172a"
                      />
                      <polygon
                        points="103,45 168,68 103,91 38,68"
                        fill="#031F42"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      <circle cx="103" cy="68" r="4" fill="#f59e0b" />
                      <path
                        d="M 103 68 Q 138 72 148 98"
                        stroke="#f59e0b"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <polygon points="144,98 152,98 150,114 146,114" fill="#f59e0b" />
                    </g>

                    {/* DIPLOMA CERTIFICATE SCROLL WITH MAROON RIBBON */}
                    <g className="hero-floating-scroll" filter="url(#heroShadow)">
                      <rect x="25" y="270" width="70" height="28" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.2" transform="rotate(-15, 60, 284)" />
                      <rect x="52" y="260" width="14" height="34" rx="2" fill="#AB0C2F" transform="rotate(-15, 60, 284)" />
                      <circle cx="65" cy="275" r="4.5" fill="#880824" />
                    </g>

                    {/* SOARING UPWARD CAREER TRAJECTORY ARROW */}
                    <g className="hero-floating-arrow">
                      <path
                        d="M 110 320 Q 230 310 360 170"
                        stroke="url(#heroArrowGrad)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="6 6"
                        fill="none"
                        opacity="0.8"
                      />
                      <polygon points="364,166 374,180 356,176" fill="#AB0C2F" />
                    </g>

                    {/* DECORATIVE SPARKLE STARS */}
                    <g className="hero-star-sparkle-1" transform="translate(450, 60)">
                      <path d="M 10 0 L 13 7 L 20 10 L 13 13 L 10 20 L 7 13 L 0 10 L 7 7 Z" fill="#f59e0b" />
                    </g>
                    <g className="hero-star-sparkle-2" transform="translate(30, 160)">
                      <path d="M 8 0 L 10 6 L 16 8 L 10 10 L 8 16 L 6 10 L 0 8 L 6 6 Z" fill="#AB0C2F" opacity="0.85" />
                    </g>
                    <g className="hero-star-sparkle-3" transform="translate(440, 290)">
                      <path d="M 6 0 L 8 4 L 12 6 L 8 8 L 6 12 L 4 8 L 0 6 L 4 4 Z" fill="#0284c7" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

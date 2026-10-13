'use client';

import React, { useState } from "react";
import Link from "next/link";
import { RightArrow } from "../svg";

interface RegionItem {
  id: string;
  name: string;
  type: 'Kota' | 'Kabupaten';
  role: string;
  x: number;
  y: number;
  labelX: number;
  labelY: number;
  isCapital?: boolean;
}

const REGIONS: RegionItem[] = [
  { id: "samarinda", name: "Kota Samarinda", type: "Kota", role: "Ibu Kota Provinsi Kaltim", x: 295, y: 205, labelX: 308, labelY: 209, isCapital: true },
  { id: "balikpapan", name: "Kota Balikpapan", type: "Kota", role: "Gerbang Industri & Logistik", x: 245, y: 275, labelX: 258, labelY: 279 },
  { id: "bontang", name: "Kota Bontang", type: "Kota", role: "Sentra Industri & Maritim", x: 330, y: 170, labelX: 342, labelY: 174 },
  { id: "kukar", name: "Kutai Kartanegara", type: "Kabupaten", role: "Sentra Budaya & Agrikultur", x: 235, y: 165, labelX: 135, labelY: 168 },
  { id: "kutim", name: "Kutai Timur", type: "Kabupaten", role: "Pertambangan & Perkebunan", x: 345, y: 125, labelX: 268, labelY: 115 },
  { id: "berau", name: "Berau", type: "Kabupaten", role: "Kawasan Pesisir & Vokasi", x: 320, y: 55, labelX: 332, labelY: 59 },
  { id: "ppu", name: "Penajam Paser Utara", type: "Kabupaten", role: "Serambi Ibu Kota Nusantara", x: 190, y: 270, labelX: 65, labelY: 268 },
  { id: "paser", name: "Paser", type: "Kabupaten", role: "Kawasan Kaltim Selatan", x: 165, y: 325, labelX: 176, labelY: 329 },
  { id: "kubar", name: "Kutai Barat", type: "Kabupaten", role: "Pedalaman & Sumber Daya Alam", x: 135, y: 205, labelX: 60, labelY: 208 },
  { id: "mahulu", name: "Mahakam Ulu", type: "Kabupaten", role: "Wilayah Perbatasan Hulu", x: 90, y: 130, labelX: 28, labelY: 120 },
];

export default function HeroAreaOne() {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  const selectedRegion = REGIONS.find((r) => r.id === activeRegion);

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
                  <span className="badge rounded-pill me-2 hero-eyebrow-tag">RESMI</span>
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
                  <Link className="hero-btn-secondary-light" href="/#tentang">
                    Pelajari Alur &amp; Capaian
                  </Link>
                </div>
              </div>
            </div>

            {/* SISI KANAN: PETA DIGITAL RESMI 10 KABUPATEN/KOTA KALTIM & IKN */}
            <div className="col-xxl-6 col-xl-6 col-lg-6 d-none d-lg-block">
              <div className="hero-map-card bg-white rounded-4 shadow-sm p-4 border position-relative wow fadeInRight" data-wow-delay=".3s">
                {/* Card Top Info */}
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                  <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill hero-map-badge">
                    <span className="hero-pulse-dot"></span>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--tp-theme-primary)" }}>
                      10 KABUPATEN &amp; KOTA TERHUBUNG
                    </span>
                  </div>
                  <span className="text-muted font-monospace" style={{ fontSize: "11.5px", fontWeight: 600 }}>
                    Live Tracer 2024/2025
                  </span>
                </div>

                {/* Digital Network Map SVG Canvas */}
                <div className="position-relative w-100" style={{ height: "300px", overflow: "hidden" }}>
                  <svg
                    viewBox="0 0 460 360"
                    className="w-100 h-100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Background Soft Matrix Grid */}
                    <g opacity="0.45">
                      <line x1="30" y1="50" x2="430" y2="50" stroke="#cbd5e1" strokeDasharray="3 3" />
                      <line x1="30" y1="130" x2="430" y2="130" stroke="#cbd5e1" strokeDasharray="3 3" />
                      <line x1="30" y1="210" x2="430" y2="210" stroke="#cbd5e1" strokeDasharray="3 3" />
                      <line x1="30" y1="290" x2="430" y2="290" stroke="#cbd5e1" strokeDasharray="3 3" />
                      <line x1="100" y1="20" x2="100" y2="340" stroke="#cbd5e1" strokeDasharray="3 3" />
                      <line x1="230" y1="20" x2="230" y2="340" stroke="#cbd5e1" strokeDasharray="3 3" />
                      <line x1="340" y1="20" x2="340" y2="340" stroke="#cbd5e1" strokeDasharray="3 3" />
                    </g>

                    {/* Stylized Silhouette Boundary of East Kalimantan */}
                    <path
                      d="M 80 130 C 50 100, 80 50, 150 40 C 220 30, 270 15, 320 35 C 360 50, 375 90, 345 125 C 375 150, 380 175, 340 200 C 315 220, 290 230, 275 250 C 285 270, 275 300, 245 320 C 200 360, 150 355, 150 320 C 130 300, 100 270, 110 230 C 80 200, 60 160, 80 130 Z"
                      fill="rgba(171, 12, 47, 0.035)"
                      stroke="rgba(171, 12, 47, 0.28)"
                      strokeWidth="1.75"
                      strokeDasharray="4 4"
                    />

                    {/* Regional Network Connection Lines */}
                    <path
                      d="M 320 55 L 345 125 L 330 170 L 295 205 L 235 240 L 245 275 L 190 270 L 165 325"
                      stroke="rgba(171, 12, 47, 0.35)"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M 90 130 L 135 205 L 235 165 L 295 205 L 330 170"
                      stroke="rgba(3, 31, 66, 0.28)"
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                    />
                    <path
                      d="M 235 165 L 235 240 L 190 270"
                      stroke="rgba(171, 12, 47, 0.3)"
                      strokeWidth="1.5"
                    />

                    {/* ALL 10 REGIONAL NODES */}
                    {REGIONS.map((region) => {
                      const isActive = activeRegion === region.id;
                      return (
                        <g
                          key={region.id}
                          style={{ cursor: "pointer" }}
                          onMouseEnter={() => setActiveRegion(region.id)}
                          onMouseLeave={() => setActiveRegion(null)}
                        >
                          {/* Outer Glow Ring on Hover */}
                          {isActive && (
                            <circle
                              cx={region.x}
                              cy={region.y}
                              r="13"
                              fill="rgba(171, 12, 47, 0.15)"
                              stroke="#AB0C2F"
                              strokeWidth="1.5"
                            />
                          )}
                          <circle
                            cx={region.x}
                            cy={region.y}
                            r={isActive ? "6.5" : region.isCapital ? "5.5" : "4.5"}
                            fill={isActive || region.isCapital ? "var(--tp-theme-primary)" : "#031F42"}
                            stroke="#ffffff"
                            strokeWidth={isActive ? "2" : "1.2"}
                          />
                          <text
                            x={region.labelX}
                            y={region.labelY}
                            fill={isActive ? "#AB0C2F" : region.isCapital ? "#031F42" : "#475569"}
                            fontSize={isActive ? "11.5" : region.isCapital ? "11" : "10"}
                            fontWeight={isActive || region.isCapital ? "700" : "600"}
                          >
                            {region.name}
                          </text>
                        </g>
                      );
                    })}

                    {/* IKN NUSANTARA FOCAL PULSE NODE */}
                    <circle cx="235" cy="240" r="20" fill="rgba(171, 12, 47, 0.15)">
                      <animate attributeName="r" values="12;26;12" dur="2.4s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0;0.8" dur="2.4s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="235" cy="240" r="7" fill="#AB0C2F" stroke="#ffffff" strokeWidth="2" />

                    {/* IKN Badge Label */}
                    <g transform="translate(180, 218)">
                      <rect width="110" height="22" rx="11" fill="#AB0C2F" />
                      <text x="55" y="15" fill="#ffffff" fontSize="9.5" fontWeight="700" textAnchor="middle" letterSpacing="0.04em">
                        ★ IKN NUSANTARA
                      </text>
                    </g>
                  </svg>
                </div>

                {/* 10 KAB/KOTA INTERACTIVE BADGES (RESPONSIVE CHIPS) */}
                <div className="mt-2 pt-2 border-top">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-muted" style={{ fontSize: "11px", fontWeight: 600 }}>
                      Daftar 10 Wilayah Kaltim:
                    </span>
                    <span className="text-muted font-monospace" style={{ fontSize: "10.5px" }}>
                      {selectedRegion ? `Pilihan: ${selectedRegion.name}` : "Sorot nama untuk melihat lokasi"}
                    </span>
                  </div>

                  <div className="d-flex flex-wrap gap-1" style={{ maxHeight: "110px", overflowY: "auto" }}>
                    {REGIONS.map((r) => {
                      const isHovered = activeRegion === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onMouseEnter={() => setActiveRegion(r.id)}
                          onMouseLeave={() => setActiveRegion(null)}
                          onClick={() => setActiveRegion(activeRegion === r.id ? null : r.id)}
                          className="btn btn-sm px-2 py-1 border rounded-pill d-inline-flex align-items-center gap-1 text-nowrap"
                          style={{
                            fontSize: "11px",
                            fontWeight: isHovered ? 700 : 500,
                            background: isHovered ? "rgba(171, 12, 47, 0.08)" : "#f8fafc",
                            borderColor: isHovered ? "#AB0C2F" : "#e2e8f0",
                            color: isHovered ? "#AB0C2F" : "#1e293b",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <span
                            style={{
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              backgroundColor: isHovered ? "#AB0C2F" : r.type === "Kota" ? "#0284c7" : "#64748b",
                            }}
                          />
                          {r.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Detail Box Saat Wilayah Disorot */}
                <div className="mt-2 p-2 rounded-2 border d-flex align-items-center justify-content-between" style={{ background: "#f8fafc", fontSize: "11.5px" }}>
                  <div>
                    <span className="text-muted me-1">Fokus Daerah:</span>
                    <strong style={{ color: selectedRegion ? "var(--tp-theme-primary)" : "#031F42" }}>
                      {selectedRegion ? `${selectedRegion.name} (${selectedRegion.role})` : "Semua Wilayah Terdata & Terintegrasi Dapodik"}
                    </strong>
                  </div>
                  <span className="badge rounded-pill" style={{ background: "rgba(171, 12, 47, 0.08)", color: "#AB0C2F", fontSize: "10.5px" }}>
                    {selectedRegion ? selectedRegion.type : "10 Daerah"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

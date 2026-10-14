"use client";

import React, { useEffect, useState, useMemo } from "react";
import { fetchApi } from "@/lib/api";

interface GaleriItem {
  id: number;
  judul: string;
  gambar: string;
  urutan?: number;
}

const defaultGaleri: GaleriItem[] = [
  { id: 1, judul: "Aktivitas Belajar Alumni", gambar: "/assets/img/instagram/instagram-thumb-1.jpg" },
  { id: 2, judul: "Gedung Satuan Pendidikan", gambar: "/assets/img/instagram/instagram-thumb-2.jpg" },
  { id: 3, judul: "Literasi & Studi Mandiri", gambar: "/assets/img/instagram/instagram-thumb-3.jpg" },
  { id: 4, judul: "Kolaborasi Riset Siswa", gambar: "/assets/img/instagram/instagram-thumb-4.jpg" },
  { id: 5, judul: "Pemanfaatan Teknologi Digital", gambar: "/assets/img/instagram/instagram-thumb-5.jpg" },
  { id: 6, judul: "Kampus & Fasilitas Sekolah", gambar: "/assets/img/instagram/instagram-thumb-2.jpg" },
];

export default function InstagramArea() {
  const [items, setItems] = useState<GaleriItem[]>(defaultGaleri);
  const [activeImage, setActiveImage] = useState<GaleriItem | null>(null);

  useEffect(() => {
    async function loadGaleri() {
      try {
        const res = await fetchApi<{ sukses: boolean; data: GaleriItem[] }>("/publik/galeri");
        if (res.sukses && Array.isArray(res.data) && res.data.length > 0) {
          setItems(res.data);
        }
      } catch {
        // Fallback defaultGaleri
      }
    }
    loadGaleri();
  }, []);

  // Lock body scroll saat lightbox zoom terbuka
  useEffect(() => {
    if (activeImage) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setActiveImage(null);
      };
      window.addEventListener("keydown", onKeyDown);
      return () => {
        document.body.style.overflow = prev;
        window.removeEventListener("keydown", onKeyDown);
      };
    }
  }, [activeImage]);

  // Duplikasi item agar infinite loop CSS marquee (-50%) mengalir mulus tanpa patah
  // ponytail: CSS marquee native 2x repeat, upgrade path: virtualized scroll jika foto > 100
  const displayItems = useMemo(() => {
    if (items.length === 0) return [];
    let base = [...items];
    while (base.length < 8) {
      base = [...base, ...items];
    }
    return [...base, ...base];
  }, [items]);

  return (
    <>
      <div className="instagram-area tp-instagram-wrapper grey-bg pb-20 position-relative">
        <style jsx>{`
          .tp-gallery-wrapper {
            overflow: hidden;
            width: 100%;
            position: relative;
            padding: 4px 0;
          }
          .tp-gallery-track {
            display: flex;
            gap: 14px;
            width: max-content;
            will-change: transform;
            animation: tpGalleryGlide 40s linear infinite;
          }
          /* Hover pause instan pada track maupun wrapper */
          .tp-gallery-wrapper:hover .tp-gallery-track,
          .tp-gallery-wrapper:focus-within .tp-gallery-track {
            animation-play-state: paused !important;
          }
          .tp-gallery-card {
            flex: 0 0 280px;
            width: 280px;
            height: 260px;
            position: relative;
          }
          .tp-gallery-img-wrap {
            width: 100%;
            height: 100%;
            overflow: hidden;
            border-radius: 10px;
          }
          .tp-gallery-img-wrap img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 10px;
            display: block;
          }
          @keyframes tpGalleryGlide {
            0% {
              transform: translate3d(0, 0, 0);
            }
            100% {
              transform: translate3d(-50%, 0, 0);
            }
          }
          @media (max-width: 991px) {
            .tp-gallery-card {
              flex: 0 0 230px;
              width: 230px;
              height: 215px;
            }
          }
          @media (max-width: 575px) {
            .tp-gallery-card {
              flex: 0 0 170px;
              width: 170px;
              height: 160px;
            }
            .tp-gallery-track {
              gap: 10px;
              animation-duration: 30s;
            }
          }
        `}</style>

        <div className="tp-gallery-wrapper wow fadeInUp" data-wow-delay=".2s">
          <div className="tp-gallery-track">
            {displayItems.map((data, idx) => (
              <div
                key={`${data.id}-${idx}`}
                className="tp-instagram-item tp-gallery-card"
                onClick={() => setActiveImage(data)}
                style={{ cursor: "pointer" }}
              >
                <div className="tp-gallery-img-wrap img-blur-frame" style={{ width: "100%", height: "100%", position: "relative" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.gambar}
                    alt=""
                    aria-hidden="true"
                    className="img-blur-bg"
                    onError={(e) => {
                      const el = e.currentTarget;
                      el.onerror = null;
                      el.src = "/assets/img/instagram/instagram-thumb-1.jpg";
                    }}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.gambar}
                    alt={data.judul || "Dokumentasi Kegiatan"}
                    className="img-blur-main"
                    onError={(e) => {
                      const el = e.currentTarget;
                      el.onerror = null;
                      el.src = "/assets/img/instagram/instagram-thumb-1.jpg";
                    }}
                  />
                </div>

                {/* Ikon Zoom Pengganti Logo Instagram */}
                <div className="tp-instagram-shape" title="Perbesar Foto">
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      backgroundColor: "#ffffff",
                      color: "#AB0C2F",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.28)",
                      cursor: "pointer",
                      transition: "transform 0.2s ease",
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width={22}
                      height={22}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      <line x1="11" y1="8" x2="11" y2="14" />
                      <line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LIGHTBOX MODAL PERSIS BERITA/DETAIL */}
      {activeImage && (
        <div
          className="banner-lightbox-backdrop"
          onClick={() => setActiveImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Tampilan Penuh Foto Galeri"
        >
          {/* Tombol Tutup (X) dengan animasi rotate(90deg) & background maroon pada hover */}
          <button
            type="button"
            className="banner-lightbox-close"
            onClick={(e) => {
              e.stopPropagation();
              setActiveImage(null);
            }}
            aria-label="Tutup tampilan penuh"
          >
            <svg
              viewBox="0 0 24 24"
              width={22}
              height={22}
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Kontainer Gambar Penuh & Keterangan */}
          <div
            className="banner-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage.gambar}
              alt={activeImage.judul}
              className="banner-lightbox-img"
            />
            {activeImage.judul && (
              <div className="banner-lightbox-caption">
                <p className="caption-title">{activeImage.judul}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

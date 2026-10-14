'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { SwiperOptions } from "swiper/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { university_classic_program_data } from "@/data/program-data";
import tag_svg from '@/assets/img/icon/program-tag-1.svg';
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { IProgramDT } from "@/types/program-d-t";

const slider_options: SwiperOptions = {
  slidesPerView: 3,
  spaceBetween: 30,
  loop: true,
  speed: 800,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  pagination: {
    el: ".tp-program-dot",
    clickable: true,
  },
  navigation: {
    prevEl: ".tp-program-prev",
    nextEl: ".tp-program-next",
  },
  breakpoints: {
    "1200": { slidesPerView: 3 },
    "992": { slidesPerView: 3 },
    "768": { slidesPerView: 2 },
    "576": { slidesPerView: 1 },
    "0": { slidesPerView: 1 },
  },
};

export default function ProgramSlider() {
  const [programs, setPrograms] = useState<IProgramDT[]>(university_classic_program_data);

  useEffect(() => {
    async function loadPrograms() {
      try {
        const res = await fetchApi<{ sukses: boolean; data: any[] }>('/publik/program-prioritas');
        if (res.sukses && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: IProgramDT[] = res.data.map((p) => ({
            id: p.id,
            img: p.gambar || "/assets/img/program/program-thumb-1.jpg",
            title: p.judul,
            description: p.deskripsi,
            category: p.kategori,
            link: p.link_tautan || "https://kaltimprov.go.id/program-prioritas",
          }));
          setPrograms(mapped);
        }
      } catch (err) {
        console.error("Gagal memuat program prioritas publik:", err);
      }
    }
    loadPrograms();
  }, []);

  return (
    <div className="tp-program-slider-wrapper position-relative">
      <Swiper
        {...slider_options}
        modules={[Pagination, Autoplay, Navigation]}
        className="swiper tp-program-active wow fadeInUp"
        data-wow-delay=".6s"
      >
        {programs.map((item) => {
          const targetUrl = item.link || "https://kaltimprov.go.id/program-prioritas";
          const isExternal = targetUrl.startsWith("http");

          return (
            <SwiperSlide
              key={item.id}
              className="tp-program-item grey-bg mb-50"
            >
              <div
                className="tp-program-thumb fix img-blur-frame"
                style={{
                  height: "200px",
                  width: "100%",
                  borderRadius: "10px",
                  position: "relative",
                }}
              >
                {isExternal ? (
                  <a href={targetUrl} target="_blank" rel="noopener noreferrer" style={{ display: "block", width: "100%", height: "100%", position: "relative" }}>
                    <Image
                      src={item.img}
                      alt=""
                      aria-hidden="true"
                      fill
                      sizes="350px"
                      className="img-blur-bg"
                      unoptimized={typeof item.img === "string" && item.img.startsWith("http")}
                    />
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      sizes="350px"
                      className="img-blur-main"
                      unoptimized={typeof item.img === "string" && item.img.startsWith("http")}
                    />
                  </a>
                ) : (
                  <Link href={targetUrl} style={{ display: "block", width: "100%", height: "100%", position: "relative" }}>
                    <Image
                      src={item.img}
                      alt=""
                      aria-hidden="true"
                      fill
                      sizes="350px"
                      className="img-blur-bg"
                      unoptimized={typeof item.img === "string" && item.img.startsWith("http")}
                    />
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      sizes="350px"
                      className="img-blur-main"
                      unoptimized={typeof item.img === "string" && item.img.startsWith("http")}
                    />
                  </Link>
                )}
              </div>
              <div className="tp-program-content">
                <h3 className="tp-program-title" style={{ fontSize: '18px', minHeight: '48px' }}>
                  {isExternal ? (
                    <a href={targetUrl} target="_blank" rel="noopener noreferrer">
                      {item.title}
                    </a>
                  ) : (
                    <Link href={targetUrl}>{item.title}</Link>
                  )}
                </h3>
                <p
                  style={{ fontSize: '14px', lineHeight: 1.6, minHeight: '68px' }}
                  dangerouslySetInnerHTML={{ __html: item.description }}
                ></p>
                <div className="tp-program-tag">
                  <p>
                    <span>
                      <Image
                        src={tag_svg}
                        alt="program-icon"
                      />
                    </span>
                    {item.category}
                  </p>
                </div>
              </div>
              <div className="tp-program-btn">
                {isExternal ? (
                  <a href={targetUrl} target="_blank" rel="noopener noreferrer">
                    Pelajari Program
                  </a>
                ) : (
                  <Link href={targetUrl}>Pelajari Program</Link>
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Prev / Next Round Buttons */}
      <button
        type="button"
        className="tp-program-nav-btn tp-program-prev pointer"
        aria-label="Program Sebelumnya"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        type="button"
        className="tp-program-nav-btn tp-program-next pointer"
        aria-label="Program Berikutnya"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}

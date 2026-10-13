'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { RightArrow, RightArrowThree } from "../svg";
import shape_line from "@/assets/img/unlerline/event-1-svg-1.svg";
import { university_classic_event_data } from "@/data/event-data";
import HoverImgItem from "./hover-img-item";
import { fetchApi } from "@/lib/api";

interface EventItemUI {
  id: number;
  date: { day: string | number; month: string; year: string | number };
  title: string;
  time: string;
  location: string;
  image: string;
  link?: string;
}

export default function EventArea() {
  const [events, setEvents] = useState<EventItemUI[]>(university_classic_event_data);

  useEffect(() => {
    async function loadAgenda() {
      try {
        const res = await fetchApi<{ sukses: boolean; data: any[] }>('/publik/agenda-karir');
        if (res.sukses && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: EventItemUI[] = res.data.map((item, idx) => {
            const d = new Date(item.tanggal);
            const day = String(d.getDate()).padStart(2, '0');
            const month = d.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase();
            const year = d.getFullYear();

            return {
              id: item.id,
              date: { day, month, year },
              title: item.judul,
              time: item.waktu || '08:30 - 16:00 WITA',
              location: item.lokasi || 'Kaltim',
              image: item.gambar || `/assets/img/event/event-thumb-${(idx % 4) + 1}.jpg`,
              link: item.link_tautan || '/tracer',
            };
          });
          setEvents(mapped);
        }
      } catch (err) {
        console.error("Gagal memuat agenda karir publik:", err);
      }
    }
    loadAgenda();
  }, []);

  return (
    <section id="agenda" className="event-area grey-bg pt-85 pb-110">
      <div className="container">
        <div className="row align-items-end">
          <div className="col-xl-6 col-md-8">
            <div
              className="tp-event-section mb-60 wow fadeInUp"
              data-wow-delay=".2s"
            >
              <div className="tp-section">
                <h5 className="tp-section-subtitle mb-15" style={{ color: "var(--tp-theme-primary)", fontWeight: 600 }}>
                  AGENDA &amp; BURSA KERJA
                </h5>
                <h3 className="tp-section-2-title">
                  Jadwal &amp; Agenda Karir{" "}
                  <span>
                    Kaltim{" "}
                    <Image
                      className="tp-underline-shape-3 wow bounceIn"
                      data-wow-duration="1.5s"
                      data-wow-delay=".4s"
                      src={shape_line}
                      alt="shape-line"
                    />
                  </span>
                </h3>
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-md-4">
            <div className="tp-event-btn text-md-end mb-70">
              <a
                className="tp-btn"
                href="https://etamkerja.kaltimprov.go.id/depan/bkk"
                target="_blank"
                rel="noopener noreferrer"
              >
                Informasi Resmi BKK
                <span>
                  <RightArrow />
                </span>
              </a>
            </div>
          </div>
        </div>
        <div className="tp-event-wrap wow fadeInUp" data-wow-delay=".3s">
          {events.map((item) => {
            const itemLink = item.link || "/tracer";
            const isExternal = itemLink.startsWith("http");

            return (
              <div key={item.id} className="tp-event-item">
                <div className="row align-items-center">
                  <div className="col-md-2">
                    <div className="tp-event-list">
                      <h4 className="tp-event-list-count">{item.date.day}</h4>
                      <span>
                        {item.date.month}, {item.date.year}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-9">
                    <div className="tp-event-content">
                      <h3 className="tp-event-title">
                        <HoverImgItem img={item.image} title={item.title} link={itemLink} />
                      </h3>
                      <div className="tp-event-info">
                        <span>
                          <i className="fa-sharp fa-light fa-clock"></i>
                          {item.time}
                        </span>
                        <span>
                          <i className="fa-sharp fa-light fa-location-dot"></i>
                          {item.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-1">
                    <div className="tp-event-arrow text-lg-end">
                      {isExternal ? (
                        <a href={itemLink} target="_blank" rel="noopener noreferrer" aria-label="Lihat agenda">
                          <span>
                            <RightArrowThree />
                          </span>
                        </a>
                      ) : (
                        <Link href={itemLink} aria-label="Lihat agenda">
                          <span>
                            <RightArrowThree />
                          </span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

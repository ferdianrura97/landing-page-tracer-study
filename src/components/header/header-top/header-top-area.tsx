'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import calling from "@/assets/img/icon/calling.svg";
// import HeaderLanguage from "./header-language";
import { fetchApi } from "@/lib/api";

export interface QuickLinkItem {
  label: string;
  url: string;
  target_blank: boolean;
}

interface SiteSettings {
  header_instagram_url: string;
  header_instagram_label: string;
  header_telepon: string;
  quick_links?: QuickLinkItem[];
}

export default function HeaderTopArea() {
  const [settings, setSettings] = useState<SiteSettings>({
    header_instagram_url: "https://www.instagram.com/disdikbudkaltim/",
    header_instagram_label: "37K+ Followers",
    header_telepon: "+62 852-4735-0467",
    quick_links: [
      { label: "SCHOOL", url: "#", target_blank: false },
      { label: "DISDIK KALTIM", url: "https://web.disdikbud.kaltimprov.go.id/", target_blank: true },
      { label: "KUESIONER", url: "/tracer", target_blank: false },
      { label: "LAPOR", url: "https://www.lapor.go.id/", target_blank: true },
      { label: "SOSMED", url: "https://www.instagram.com/disdikbudkaltim/", target_blank: true },
    ],
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetchApi<{ sukses: boolean; data: SiteSettings }>('/publik/pengaturan');
        if (res.sukses && res.data) {
          setSettings((prev) => ({
            ...prev,
            ...res.data,
            quick_links: Array.isArray(res.data.quick_links) && res.data.quick_links.length > 0
              ? res.data.quick_links
              : prev.quick_links,
          }));
        }
      } catch {
        // Fallback default
      }
    }
    loadSettings();
  }, []);

  return (
    <div className="tp-header-top theme-bg">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="tp-heder-info d-flex justify-content-center justify-content-lg-start align-items-center">
              <div className="tp-header-info-item d-none d-md-block">
                <span>
                  <a
                    href={settings.header_instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-brands fa-instagram"></i>
                  </a>
                  <a
                    href={settings.header_instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    {settings.header_instagram_label}
                  </a>
                </span>
              </div>
              <div className="tp-header-info-item">
                <span>
                  <a href={`tel:${settings.header_telepon.replace(/\s+/g, '')}`}>
                    <i>
                      <Image src={calling} alt="phone-img" />
                    </i>{" "}
                    {settings.header_telepon}
                  </a>
                </span>
              </div>
              {/* <div className="tp-header-info-item">
                <div className="header-bottom__lang">
                  <ul>
                    <HeaderLanguage />
                  </ul>
                </div>
              </div> */}
            </div>
          </div>
          <div className="col-lg-6 col-md-6 d-none d-lg-block">
            <div className="tp-header-right-list d-flex justify-content-md-end" style={{ flexWrap: 'wrap', gap: '8px' }}>
              {(settings.quick_links || []).map((link, idx) => {
                const isExternal = link.target_blank || link.url.startsWith('http');
                if (isExternal) {
                  return (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  );
                }
                return (
                  <Link key={idx} href={link.url}>
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

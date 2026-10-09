'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Email } from "../svg";
import FooterSocial from "./footer-social";
import logo from "@/assets/img/logo/logo-red.png";
import logo_black from "@/assets/img/logo/logo-black-2.png";
import { fetchApi } from "@/lib/api";

type IProps = {
  style_2?: boolean;
};

export interface QuickLinkItem {
  label: string;
  url: string;
  target_blank: boolean;
}

interface FooterSettings {
  footer_deskripsi: string;
  footer_telepon: string;
  footer_email: string;
  footer_alamat: string;
  footer_copyright: string;
  quick_links?: QuickLinkItem[];
}

export default function FooterOne({ style_2 = false }: IProps) {
  const [settings, setSettings] = useState<FooterSettings>({
    footer_deskripsi: "Sistem Penelusuran Tamatan Resmi jenjang SMA & SMK di bawah naungan Dinas Pendidikan dan Kebudayaan Provinsi Kalimantan Timur untuk memetakan serapan lulusan ke dunia kerja, wirausaha, dan perguruan tinggi.",
    footer_telepon: "(0541) 743580",
    footer_email: "disdikbud@kaltimprov.go.id",
    footer_alamat: "Jl. Basuki Rahmat No. 5, Pelabuhan, Kec. Samarinda Kota, Kota Samarinda, Kalimantan Timur 75112",
    footer_copyright: "© 2026 Pemerintah Provinsi Kalimantan Timur. Hak Cipta Dilindungi Undang-Undang.",
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
        const res = await fetchApi<{ sukses: boolean; data: FooterSettings }>('/publik/pengaturan');
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
    <footer>
      <div className={`tp-footer-main ${style_2 ? '' : 'grey-bg'} pt-80 pb-55`}>
        <div className="container">
          <div className="row">
            {/* Kolom 1: Profil Lembaga & Kontak (Ukuran Diperpanjang: col-xl-5 col-lg-5 col-md-6) */}
            <div className="col-xl-5 col-lg-5 col-md-6 mb-30">
              <div className={`tp-footer-widget ${style_2 ? 'tp-footer-5-col-1' : 'tp-footer-col-1'}`}>
                <div className="tp-footer-widget-logo mb-20 tp-header-logo">
                  <Link href="/">
                    <Image 
                      src={style_2 ? logo_black : logo} 
                      alt="logo" 
                      priority 
                      style={{ height: "auto" }} 
                    />
                  </Link>
                </div>
                <div className="tp-footer-widget-content mb-20">
                  <p style={{ lineHeight: 1.6, color: '#636b78', fontSize: '15px' }}>
                    {settings.footer_deskripsi}
                  </p>
                </div>
                <div className="tp-footer-contact mb-2">
                  <span>Kontak Informasi / Pertanyaan:</span>
                  <a href={`tel:${settings.footer_telepon.replace(/\s+/g, '')}`}>
                    {settings.footer_telepon}
                  </a>
                </div>
                <div className="tp-footer-contact-mail">
                  <a href={`mailto:${settings.footer_email}`}>
                    <span>
                      <Email />
                    </span>
                    {settings.footer_email}
                  </a>
                </div>
              </div>
            </div>

            {/* Kolom 2: Quick Links Dinamis (Membaca Array quick_links dari Database: col-xl-3 col-lg-3 col-md-6) */}
            <div className="col-xl-3 col-lg-3 col-md-6 mb-30">
              <div className={`tp-footer-widget ${style_2 ? 'tp-footer-5-col-2' : 'tp-footer-col-2'}`}>
                <h4 className="tp-footer-widget-title mb-20">Quick links</h4>
                <div className="tp-footer-widget-link">
                  <ul>
                    {(settings.quick_links || []).map((link, idx) => {
                      const isExternal = link.target_blank || link.url.startsWith('http');
                      return (
                        <li key={idx}>
                          {isExternal ? (
                            <a href={link.url} target="_blank" rel="noopener noreferrer">
                              {link.label}
                            </a>
                          ) : (
                            <Link href={link.url}>{link.label}</Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>

            {/* Kolom 3: Newsletter & Media Sosial (col-xl-4 col-lg-4 col-md-12) */}
            <div className="col-xl-4 col-lg-4 col-md-12 mb-30">
              <div className={`p-footer-widget ${style_2 ? 'tp-footer-5-col-4' : 'tp-footer-col-4'}`}>
                <h4 className="tp-footer-widget-title mb-20">Our Newsletter</h4>
                <div className="tp-footer-newsletter-wrap">
                  <p>
                    Dapatkan pembaruan rilis data tracer study dan info lowongan kerja Disdikbud Kaltim.
                  </p>
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="tp-footer-newsletter-wrapper mb-30">
                      <div className={`tp-footer-newsletter-input ${style_2 ? 'tp-footer-5-newsletter-input' : ''}`}>
                        <input type="email" placeholder="Masukkan email Anda…" />
                      </div>
                      <div className={`${style_2 ? 'tp-footer-5-newsletter-submit' : 'tp-footer-newsletter-submit'}`}>
                        <button type="submit" className={`${style_2 ? 'tp-btn-4' : 'tp-btn'}`}>Subscribe</button>
                      </div>
                    </div>
                  </form>
                  {/* Footer Social Icons */}
                  <div className="tp-footer-newsletter-social">
                    <FooterSocial />
                  </div>
                </div>
              </div>
            </div> 
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className={`${style_2 ? 'tp-footer-5-bottom' : 'tp-footer-bottom'}`}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="tp-footer-copyright text-center">
                <span>
                  {settings.footer_copyright}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

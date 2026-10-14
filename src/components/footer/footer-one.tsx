'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Email, LocationFive } from "../svg";
import FooterSocial from "./footer-social";
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
      { label: "Kuesioner Tracer Study", url: "/tracer", target_blank: false },
      { label: "Laporan per Wilayah", url: "/laporan/wilayah", target_blank: false },
      { label: "Laporan per Sekolah", url: "/laporan/sekolah", target_blank: false },
      { label: "Disdikbud Kaltim", url: "https://web.disdikbud.kaltimprov.go.id/", target_blank: true },
      { label: "Lapor! SP4N", url: "https://www.lapor.go.id/", target_blank: true },
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
            {/* Kolom 1: Profil Lembaga & Kontak (col-xl-5 col-lg-5 col-md-6) */}
            <div className="col-xl-5 col-lg-5 col-md-6 mb-30">
              <div className={`tp-footer-widget ${style_2 ? 'tp-footer-5-col-1' : 'tp-footer-col-1'}`}>
                {/* Logo Resmi Tracer Study Disdikbud Kaltim */}
                <div className="tp-footer-widget-logo mb-25">
                  <Link href="/" className="d-flex align-items-center gap-3 text-decoration-none" style={{ whiteSpace: 'nowrap' }}>
                    <Image 
                      src="/assets/img/logo/logo_kaltim.png"
                      alt="Logo Pemprov Kaltim" 
                      width={48}
                      height={48}
                      style={{ objectFit: 'contain' }}
                      priority
                    />
                    <div className="d-flex flex-column text-start">
                      <span style={{
                        fontFamily: 'var(--tp-ff-heading)',
                        fontSize: '18px',
                        fontWeight: 800,
                        letterSpacing: '0.02em',
                        color: style_2 ? '#ffffff' : '#031F42',
                        lineHeight: 1.15
                      }}>
                        TRACER STUDY
                      </span>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: style_2 ? 'rgba(255, 255, 255, 0.85)' : 'var(--tp-theme-primary)',
                        letterSpacing: '0.04em',
                        lineHeight: 1.15
                      }}>
                        Disdikbud Kaltim
                      </span>
                    </div>
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

            {/* Kolom 2: Quick Links (col-xl-3 col-lg-3 col-md-6) */}
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

            {/* Kolom 3: Kantor Pelayanan & Media Sosial (col-xl-4 col-lg-4 col-md-12) */}
            <div className="col-xl-4 col-lg-4 col-md-12 mb-30">
              <div className={`tp-footer-widget ${style_2 ? 'tp-footer-5-col-4' : 'tp-footer-col-4'}`}>
                <h4 className="tp-footer-widget-title mb-20">Kantor Pelayanan</h4>
                <div className="tp-footer-widget-content mb-25">
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: '#636b78', fontSize: '14px', lineHeight: 1.6 }}>
                    <span style={{ color: 'var(--tp-theme-primary)', flexShrink: 0, marginTop: '2px' }}>
                      <LocationFive />
                    </span>
                    <span>{settings.footer_alamat}</span>
                  </div>
                </div>
                <div className="tp-footer-newsletter-wrap">
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#031F42', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '12px' }}>
                    Kanal Media Sosial
                  </span>
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

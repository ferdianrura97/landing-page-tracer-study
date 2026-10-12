'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PrevArrow, HomeSvg, XSvg } from '@/components/svg';
import { IBlogDT } from '@/types/blog-d-t';
import BlogStoriesItem from '@/components/blog/single/blog-stories-item';

export interface BeritaDetailData {
  id: number;
  judul: string;
  slug?: string;
  kategori: string;
  penulis: string;
  gambar: string;
  ringkasan: string;
  konten: string;
  link_eksternal?: string | null;
  diterbitkan?: boolean;
  dibuat_pada: string;
  diperbarui_pada?: string;
}

type Props = {
  berita: BeritaDetailData;
  related: IBlogDT[];
};

export default function BeritaDetailView({ berita, related }: Props) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  // Format tanggal bahasa Indonesia
  let formattedDate = berita.dibuat_pada;
  const parsedDate = new Date(berita.dibuat_pada);
  if (!isNaN(parsedDate.getTime())) {
    formattedDate = parsedDate.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  // Format konten jika plain text tanpa tag HTML
  const isHtml = /<[a-z][\s\S]*>/i.test(berita.konten || '');
  const renderContent = isHtml
    ? berita.konten
    : (berita.konten || '')
        .split('\n\n')
        .map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br/>')}</p>`)
        .join('');

  const handleCopyLink = async () => {
    try {
      const urlToCopy = shareUrl || window.location.href;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(urlToCopy);
      } else {
        const input = document.createElement('input');
        input.value = urlToCopy;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error('Gagal menyalin tautan:', err);
    }
  };

  const currentUrl = shareUrl || '';
  const waShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${berita.judul} - ${currentUrl}`
  )}`;
  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    currentUrl
  )}`;
  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    berita.judul
  )}&url=${encodeURIComponent(currentUrl)}`;

  return (
    <>
      {/* 1. Breadcrumb & Header Section */}
      <section className="tp-blog-full-width-area tp-blog-full-width-pl fix p-relative pt-160 pb-40">
        <div
          className="tp-blog-stories-bg"
          style={{
            backgroundImage:
              'url(/assets/img/blog/blog-stories/blog-stories-bg.png)',
          }}
        />
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-12">
              <div className="tp-breadcrumb__content text-center">
                {/* Navigasi jejak breadcrumb */}
                <div
                  className="tp-breadcrumb__list mb-25 d-inline-flex align-items-center gap-2"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    padding: '6px 18px',
                    borderRadius: '30px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  <span>
                    <Link href="/" aria-label="Beranda">
                      <HomeSvg />
                    </Link>
                  </span>
                  <span>/</span>
                  <span>
                    <Link href="/berita">Berita &amp; Publikasi</Link>
                  </span>
                  <span>/</span>
                  <span className="color" style={{ color: '#AB0C2F', fontWeight: 600 }}>
                    {berita.kategori}
                  </span>
                </div>

                {/* Judul Berita Utama */}
                <h1
                  className="tp-blog-full-width-title"
                  style={{
                    fontSize: 'clamp(26px, 3.8vw, 44px)',
                    lineHeight: 1.3,
                    maxWidth: '1050px',
                    margin: '0 auto 35px',
                    wordBreak: 'break-word',
                    color: '#031F42',
                  }}
                >
                  {berita.judul}
                </h1>

                {/* Action Bar (Kembali, Penulis/Tanggal, Sosmed) */}
                <div className="tp-blog-full-width-box d-flex justify-content-between align-items-center">
                  <div className="tp-blog-full-width-back">
                    <Link href="/berita" className="d-inline-flex align-items-center">
                      <span>
                        <PrevArrow />
                      </span>
                      Kembali ke Semua Berita
                    </Link>
                  </div>

                  <div className="tp-blog-details-user order-3 order-lg-2 d-flex align-items-center gap-3">
                    <span className="d-inline-flex align-items-center">
                      <Image
                        src="/assets/img/blog/blog-stories/blog-stories-user-1.jpg"
                        alt={berita.penulis || 'Penulis'}
                        width={36}
                        height={36}
                        style={{
                          borderRadius: '50%',
                          marginRight: '8px',
                          objectFit: 'cover',
                        }}
                      />
                      {berita.penulis || 'Humas Disdikbud Kaltim'}
                    </span>
                    <span>
                      <i
                        className="fa-regular fa-calendar-check me-2"
                        style={{ color: '#AB0C2F' }}
                      />
                      {formattedDate}
                    </span>
                    <span
                      style={{
                        backgroundColor: 'rgba(171, 12, 47, 0.08)',
                        color: '#AB0C2F',
                        padding: '4px 12px',
                        borderRadius: '16px',
                        fontSize: '13px',
                        fontWeight: 600,
                      }}
                    >
                      {berita.kategori}
                    </span>
                  </div>

                  <div className="tp-blog-details-user-social order-2 order-lg-3">
                    <div className="tp-postbox-details-social text-end d-flex align-items-center justify-content-end gap-2">
                      <a
                        href={waShareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Bagikan ke WhatsApp"
                        style={{
                          backgroundColor: '#25D366',
                          color: '#ffffff',
                          border: 'none',
                        }}
                      >
                        <i className="fa-brands fa-whatsapp" />
                      </a>
                      <a
                        href={fbShareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Bagikan ke Facebook"
                      >
                        <i className="fa-brands fa-facebook-f" />
                      </a>
                      <a
                        href={xShareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Bagikan ke X / Twitter"
                      >
                        <XSvg width={13} height={13} />
                      </a>
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        title={copied ? 'Tautan Tersalin!' : 'Salin Tautan'}
                        className="btn p-0"
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          border: '1px solid rgba(3, 31, 66, 0.14)',
                          backgroundColor: copied ? '#1E856C' : '#ffffff',
                          color: copied ? '#ffffff' : '#031F42',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <i className={copied ? 'fa-solid fa-check' : 'fa-solid fa-link'} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Full Width Image Banner */}
      <div className="tp-blog-full-width-img">
        <div className="container-fluid p-0">
          <div className="row g-0">
            <div className="col-lg-12">
              <div
                className="tp-blog-full-width-thumb p-relative"
                style={{
                  backgroundColor: '#f1f3f5',
                  maxHeight: '580px',
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={berita.gambar || '/assets/img/blog/deatils/blog-full-width-bg.jpg'}
                  alt={berita.judul}
                  width={1920}
                  height={680}
                  unoptimized={
                    typeof berita.gambar === 'string' &&
                    berita.gambar.startsWith('http')
                  }
                  style={{
                    width: '100%',
                    height: '520px',
                    objectFit: 'cover',
                  }}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Article Content & Details Area */}
      <section className="tp-blog-details-p p-relative pt-70 pb-90">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="tp-postbox-wrapper">
                {/* Ringkasan Pembuka (Lead Paragraph) */}
                {berita.ringkasan && (
                  <div className="tp-postbox-details-text mb-40">
                    <p
                      className="tp-dropcap text-1"
                      style={{
                        fontSize: '19px',
                        lineHeight: 1.75,
                        color: '#1a202c',
                        fontWeight: 500,
                      }}
                    >
                      {berita.ringkasan}
                    </p>
                  </div>
                )}

                {/* Konten Utama Artikel */}
                <div
                  className="tp-postbox-details-text pb-30 article-content"
                  style={{
                    fontSize: '16.5px',
                    lineHeight: 1.85,
                    color: '#4a5568',
                  }}
                  dangerouslySetInnerHTML={{ __html: renderContent }}
                />

                {/* Tautan Eksternal / Portal Terkait jika ada */}
                {berita.link_eksternal &&
                  berita.link_eksternal !== '#' &&
                  berita.link_eksternal.trim().length > 0 && (
                    <div
                      className="mb-50 p-4 rounded-3 d-flex flex-wrap align-items-center justify-content-between gap-3"
                      style={{
                        backgroundColor: '#F7F9FC',
                        border: '1px solid #E2E8F0',
                        borderLeft: '5px solid #AB0C2F',
                      }}
                    >
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <i
                            className="fa-solid fa-circle-info"
                            style={{ color: '#AB0C2F' }}
                          />
                          <h6
                            className="mb-0"
                            style={{ color: '#031F42', fontWeight: 600 }}
                          >
                            Tautan Resmi &amp; Lampiran Terkait
                          </h6>
                        </div>
                        <p
                          className="mb-0 text-muted"
                          style={{ fontSize: '14px' }}
                        >
                          Kunjungi portal rujukan atau berkas resmi yang berkaitan dengan pengumuman ini.
                        </p>
                      </div>
                      <a
                        href={berita.link_eksternal}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tp-btn"
                        style={{
                          backgroundColor: '#AB0C2F',
                          color: '#ffffff',
                          fontSize: '14px',
                          padding: '10px 22px',
                          borderRadius: '6px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        Buka Tautan Resmi
                        <i className="fa-solid fa-arrow-up-right-from-square" />
                      </a>
                    </div>
                  )}

                {/* Tagar & Share Bawah */}
                <div className="tp-postbox-details-share mb-50">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <div className="tagcloud tp-postbox-details-tag d-flex flex-wrap align-items-center gap-2">
                        <span
                          style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#8F9195',
                            marginRight: '6px',
                          }}
                        >
                          Tagar:
                        </span>
                        <Link href={`/berita?kategori=${encodeURIComponent(berita.kategori)}`}>
                          #{berita.kategori}
                        </Link>
                        <Link href="/berita">#TracerStudyKaltim</Link>
                        <Link href="/berita">#DisdikbudKaltim</Link>
                        <Link href="/berita">#VokasiKaltim</Link>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="tp-postbox-details-social text-start text-md-end d-flex align-items-center justify-content-md-end gap-2 mt-3 mt-md-0">
                        <a
                          href={waShareUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="WhatsApp"
                          style={{
                            backgroundColor: '#25D366',
                            color: '#ffffff',
                            border: 'none',
                          }}
                        >
                          <i className="fa-brands fa-whatsapp" />
                        </a>
                        <a
                          href={fbShareUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Facebook"
                        >
                          <i className="fa-brands fa-facebook-f" />
                        </a>
                        <a
                          href={xShareUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="X / Twitter"
                        >
                          <XSvg width={13} height={13} />
                        </a>
                        <button
                          type="button"
                          onClick={handleCopyLink}
                          title={copied ? 'Tersalin!' : 'Salin Tautan'}
                          className="btn p-0"
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            border: '1px solid rgba(3, 31, 66, 0.14)',
                            backgroundColor: copied ? '#1E856C' : '#ffffff',
                            color: copied ? '#ffffff' : '#031F42',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <i className={copied ? 'fa-solid fa-check' : 'fa-solid fa-link'} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profil Penulis / Instansi */}
                <div className="tp-postbox-details-author-box mb-40 p-relative">
                  <div className="tp-postbox-details-author-wrap d-flex align-items-center">
                    <div className="tp-postbox-details-author-avata">
                      <Image
                        src="/assets/img/blog/blog-stories/blog-stories-user-1.jpg"
                        alt={berita.penulis || 'Penulis'}
                        width={75}
                        height={75}
                        style={{
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                    <div className="tp-postbox-details-author-content">
                      <h4>{berita.penulis || 'Humas Disdikbud Kaltim'}</h4>
                      <p>
                        Kanal publikasi resmi Sistem Penelusuran Tamatan SMA &amp; SMK Dinas Pendidikan dan Kebudayaan Provinsi Kalimantan Timur. Menghubungkan data kelulusan dengan perkembangan industri daerah.
                      </p>
                    </div>
                  </div>
                  <div className="tp-postbox-details-author-social">
                    <a
                      href="https://web.disdikbud.kaltimprov.go.id/"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Portal Resmi Disdikbud"
                    >
                      <i className="fa-solid fa-globe" />
                    </a>
                    <a
                      href="https://www.instagram.com/disdikbudkaltim/"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Instagram Disdikbud Kaltim"
                    >
                      <i className="fa-brands fa-instagram" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Seksi Berita Terkait */}
      {related && related.length > 0 && (
        <section
          className="tp-postbox-details-bottom p-relative pt-80 pb-60"
          style={{ backgroundColor: '#F8F9FA' }}
        >
          <div className="container">
            <div className="row align-items-end mb-40">
              <div className="col-md-8">
                <span
                  style={{
                    color: '#AB0C2F',
                    fontWeight: 600,
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    display: 'block',
                    marginBottom: '6px',
                  }}
                >
                  Rekomendasi Publikasi
                </span>
                <h3
                  className="tp-postbox-details-bottom-title mb-0"
                  style={{ fontSize: '28px', color: '#031F42' }}
                >
                  Berita &amp; Artikel Terkait
                </h3>
              </div>
              <div className="col-md-4 text-md-end mt-3 mt-md-0">
                <Link
                  href="/berita"
                  className="tp-btn-theme-pill"
                >
                  Lihat Semua Berita
                  <i className="fa-regular fa-arrow-right" />
                </Link>
              </div>
            </div>

            <div className="row">
              {related.map((item) => (
                <div key={item.id} className="col-lg-4 col-md-6">
                  <BlogStoriesItem blog={item} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

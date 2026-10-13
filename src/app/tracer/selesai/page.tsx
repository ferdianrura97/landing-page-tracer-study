'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { HomeSvg } from '@/components/svg';

interface ReceiptData {
  nama: string;
  nisn: string;
  sekolah: string;
  jenjang: string;
  tahun: number;
  status: string;
  submittedAt: string;
}

export default function TracerSelesaiPage() {
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const raw = sessionStorage.getItem('tracer_receipt');
      if (raw) {
        try {
          setReceipt(JSON.parse(raw));
        } catch {}
      }
    }
  }, []);

  // ponytail: render canvas 2x scale for receipt card image, upgrade to PDF export if printable physical stamp required
  const handleDownloadCard = () => {
    setDownloading(true);
    try {
      const scale = 2;
      const w = 840;
      const h = 1040;
      const canvas = document.createElement('canvas');
      canvas.width = w * scale;
      canvas.height = h * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.scale(scale, scale);

      const drawRoundRect = (
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number
      ) => {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
      };

      const truncateText = (text: string, maxLen: number) => {
        return text.length > maxLen ? text.substring(0, maxLen - 1) + '…' : text;
      };

      // 1. White Card Background
      drawRoundRect(10, 10, w - 20, h - 20, 24);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#e2e8f0';
      ctx.stroke();

      // 2. Decorative Top Stripe (Maroon Accent)
      ctx.save();
      drawRoundRect(10, 10, w - 20, h - 20, 24);
      ctx.clip();
      const grad = ctx.createLinearGradient(10, 10, w - 10, 10);
      grad.addColorStop(0, '#AB0C2F');
      grad.addColorStop(1, '#880824');
      ctx.fillStyle = grad;
      ctx.fillRect(10, 10, w - 20, 10);
      ctx.restore();

      // 3. Icon Circle Badge (Center)
      const centerX = w / 2;
      const centerY = 95;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 36, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(171, 12, 47, 0.08)';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(171, 12, 47, 0.22)';
      ctx.stroke();

      // Checkmark Icon
      ctx.beginPath();
      ctx.moveTo(centerX - 13, centerY);
      ctx.lineTo(centerX - 4, centerY + 10);
      ctx.lineTo(centerX + 15, centerY - 10);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#AB0C2F';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // 4. Badge "PENGISIAN BERHASIL"
      const badgeW = 160;
      const badgeH = 28;
      const badgeX = centerX - badgeW / 2;
      const badgeY = 152;
      drawRoundRect(badgeX, badgeY, badgeW, badgeH, 14);
      ctx.fillStyle = 'rgba(171, 12, 47, 0.08)';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(171, 12, 47, 0.25)';
      ctx.stroke();

      ctx.fillStyle = '#AB0C2F';
      ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PENGISIAN BERHASIL', centerX, badgeY + 18);

      // 5. Title & Subtitle
      ctx.fillStyle = '#031F42';
      ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
      ctx.fillText('Terima Kasih Atas Partisipasi Anda!', centerX, 215);

      ctx.fillStyle = '#64748b';
      ctx.font = '13px system-ui, -apple-system, sans-serif';
      ctx.fillText(
        'Jawaban kuesioner Anda telah tersimpan di pangkalan data resmi',
        centerX,
        245
      );
      ctx.fillText(
        'Dinas Pendidikan dan Kebudayaan Provinsi Kalimantan Timur.',
        centerX,
        265
      );

      // 6. Digital Receipt Box
      const boxX = 40;
      const boxY = 295;
      const boxW = w - 80;
      const boxH = 640;
      drawRoundRect(boxX, boxY, boxW, boxH, 18);
      ctx.fillStyle = '#F8FAFC';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#cbd5e1';
      ctx.stroke();

      // Box Header
      ctx.textAlign = 'left';
      ctx.fillStyle = '#AB0C2F';
      ctx.font = 'bold 17px system-ui, -apple-system, sans-serif';
      ctx.fillText('Tanda Terima Digital Tracer Study', boxX + 24, boxY + 38);

      ctx.fillStyle = '#64748b';
      ctx.font = '12px system-ui, -apple-system, sans-serif';
      ctx.fillText('Pemerintah Provinsi Kalimantan Timur', boxX + 24, boxY + 56);

      // TERVERIFIKASI badge inside box
      const tagW = 105;
      const tagH = 26;
      drawRoundRect(boxX + boxW - tagW - 24, boxY + 28, tagW, tagH, 13);
      ctx.fillStyle = '#AB0C2F';
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TERVERIFIKASI', boxX + boxW - tagW / 2 - 24, boxY + 45);

      // Divider line inside box
      ctx.beginPath();
      ctx.moveTo(boxX + 24, boxY + 76);
      ctx.lineTo(boxX + boxW - 24, boxY + 76);
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#e2e8f0';
      ctx.stroke();

      // Items Grid inside box (2 columns)
      const col1X = boxX + 24;
      const col2X = boxX + boxW / 2 + 10;
      const rowHeight = 75;
      const startY = boxY + 110;

      const items = [
        {
          label: 'Nama Alumni:',
          val: truncateText(receipt?.nama || 'Alumni Kaltim', 32),
          color: '#031F42',
          isBold: true,
        },
        {
          label: 'NISN:',
          val: receipt?.nisn || '-',
          color: '#031F42',
          isMono: true,
          isBold: true,
        },
        {
          label: 'Satuan Pendidikan:',
          val: truncateText(receipt?.sekolah || '-', 36),
          color: '#031F42',
          isBold: true,
        },
        {
          label: 'Jenjang / Tahun Lulus:',
          val: `${receipt?.jenjang || '-'} / ${receipt?.tahun || '-'}`,
          color: '#031F42',
          isBold: true,
        },
        {
          label: 'Status Tercatat:',
          val: (receipt?.status?.replace(/_/g, ' ') || 'TERISI').toUpperCase(),
          color: '#AB0C2F',
          isBold: true,
        },
        {
          label: 'Waktu Penyerahan:',
          val: receipt?.submittedAt
            ? new Date(receipt.submittedAt).toLocaleString('id-ID')
            : new Date().toLocaleString('id-ID'),
          color: '#031F42',
          isMono: true,
          isBold: true,
        },
      ];

      // Draw row pairs
      for (let i = 0; i < 3; i++) {
        const it1 = items[i * 2];
        const it2 = items[i * 2 + 1];
        const yPos = startY + i * rowHeight;

        // Col 1
        ctx.textAlign = 'left';
        ctx.fillStyle = '#64748b';
        ctx.font = '12px system-ui, -apple-system, sans-serif';
        ctx.fillText(it1.label, col1X, yPos);

        ctx.fillStyle = it1.color;
        ctx.font = `${it1.isBold ? 'bold ' : ''}14px ${it1.isMono ? 'ui-monospace, monospace' : 'system-ui, -apple-system, sans-serif'}`;
        ctx.fillText(it1.val, col1X, yPos + 22);

        // Col 2
        ctx.fillStyle = '#64748b';
        ctx.font = '12px system-ui, -apple-system, sans-serif';
        ctx.fillText(it2.label, col2X, yPos);

        ctx.fillStyle = it2.color;
        ctx.font = `${it2.isBold ? 'bold ' : ''}14px ${it2.isMono ? 'ui-monospace, monospace' : 'system-ui, -apple-system, sans-serif'}`;
        ctx.fillText(it2.val, col2X, yPos + 22);
      }

      // Security Footer Box inside receipt
      const secBoxY = boxY + boxH - 120;
      drawRoundRect(boxX + 20, secBoxY, boxW - 40, 95, 12);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#e2e8f0';
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.fillStyle = '#031F42';
      ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
      ctx.fillText('KEABSAHAN DOKUMEN DIGITAL', boxX + 36, secBoxY + 25);

      ctx.fillStyle = '#64748b';
      ctx.font = '11px system-ui, -apple-system, sans-serif';
      ctx.fillText(
        'Dokumen ini merupakan bukti sah pengisian instrumen Tracer Study SMA/SMK se-Kaltim',
        boxX + 36,
        secBoxY + 44
      );
      ctx.fillText(
        'yang telah tervalidasi dan tercatat dalam sistem basis data Disdikbud Provinsi Kaltim.',
        boxX + 36,
        secBoxY + 62
      );

      const refCode = `STATUS VERIFIKASI: TERCATAT RESMI (NISN: ${receipt?.nisn || '-'})`;
      ctx.font = 'bold 10px ui-monospace, monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(refCode, boxX + 36, secBoxY + 80);

      // 7. Footer text outside box (bottom of card)
      ctx.textAlign = 'center';
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px system-ui, -apple-system, sans-serif';
      ctx.fillText(
        'Dinas Pendidikan dan Kebudayaan Provinsi Kalimantan Timur',
        centerX,
        h - 50
      );

      // Export to PNG blob and download
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bukti-tracer-study-${receipt?.nisn || 'alumni'}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (err) {
      console.error('Gagal membuat bukti card gambar:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <main>
      {/* BREADCRUMB STANDAR ACADIA */}
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
                <div className="tp-breadcrumb__list justify-content-center mb-10">
                  <span>
                    <Link href="/" aria-label="Beranda">
                      <HomeSvg />
                    </Link>
                  </span>
                  <span>
                    <Link href="/tracer">Kuesioner Tracer</Link>
                  </span>
                  <span style={{ color: 'var(--tp-theme-primary)', fontWeight: 600 }}>Tanda Terima</span>
                </div>
                <h1 className="tp-breadcrumb__title" style={{ fontSize: '38px', fontWeight: 700, color: '#031F42' }}>
                  Bukti Pengisian Kuesioner
                </h1>
                <p className="mt-2 text-muted mb-0" style={{ fontSize: '15px' }}>
                  Pemerintah Provinsi Kalimantan Timur &bull; Dinas Pendidikan dan Kebudayaan
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CARD TANDA TERIMA */}
      <section className="pt-20 pb-100 grey-bg" style={{ minHeight: '75vh' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border text-center">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                  style={{ width: '80px', height: '80px', background: 'rgba(171, 12, 47, 0.08)', color: '#AB0C2F' }}
                >
                  <i className="fa-solid fa-circle-check fa-3x"></i>
                </div>

                <div>
                  <span
                    className="badge px-3 py-1 rounded-pill fw-bold mb-2 d-inline-block"
                    style={{
                      background: 'rgba(171, 12, 47, 0.08)',
                      color: '#AB0C2F',
                      border: '1px solid rgba(171, 12, 47, 0.22)',
                    }}
                  >
                    PENGISIAN BERHASIL
                  </span>
                </div>
                <h2 className="fw-bold text-dark mb-2">Terima Kasih Atas Partisipasi Anda!</h2>
                <p className="text-muted mb-4" style={{ maxWidth: '520px', margin: '0 auto', fontSize: '15px' }}>
                  Jawaban kuesioner Anda telah tersimpan di pangkalan data resmi Dinas Pendidikan dan Kebudayaan Provinsi Kalimantan Timur.
                </p>

                {/* DIGITAL RECEIPT CARD */}
                <div
                  className="p-4 rounded-4 text-start mb-4 border"
                  style={{ background: '#f8fafc', borderStyle: 'dashed' }}
                >
                  <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                    <div>
                      <h6 className="fw-bold mb-0" style={{ color: '#AB0C2F' }}>Tanda Terima Digital Tracer Study</h6>
                      <small className="text-muted">Pemerintah Provinsi Kalimantan Timur</small>
                    </div>
                    <span
                      className="badge px-3 py-1 rounded-pill"
                      style={{ background: '#AB0C2F', color: '#ffffff', fontSize: '11px', fontWeight: 600 }}
                    >
                      TERVERIFIKASI
                    </span>
                  </div>

                  <div className="row g-3" style={{ fontSize: '14px' }}>
                    <div className="col-sm-6">
                      <span className="text-muted">Nama Alumni:</span>
                      <div className="fw-bold text-dark">{receipt?.nama || 'Alumni Kaltim'}</div>
                    </div>
                    <div className="col-sm-6">
                      <span className="text-muted">NISN:</span>
                      <div className="fw-bold font-monospace text-dark">{receipt?.nisn || '-'}</div>
                    </div>
                    <div className="col-sm-6">
                      <span className="text-muted">Satuan Pendidikan:</span>
                      <div className="fw-bold text-dark">{receipt?.sekolah || '-'}</div>
                    </div>
                    <div className="col-sm-6">
                      <span className="text-muted">Jenjang / Tahun Lulus:</span>
                      <div className="fw-bold text-dark">{receipt?.jenjang || '-'} / {receipt?.tahun || '-'}</div>
                    </div>
                    <div className="col-sm-6">
                      <span className="text-muted">Status Tercatat:</span>
                      <div className="fw-bold" style={{ color: '#AB0C2F' }}>
                        {receipt?.status?.replace(/_/g, ' ') || 'TERISI'}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <span className="text-muted">Waktu Penyerahan:</span>
                      <div className="fw-bold font-monospace text-dark">
                        {receipt?.submittedAt ? new Date(receipt.submittedAt).toLocaleString('id-ID') : new Date().toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-3 justify-content-center mt-4">
                  <button
                    type="button"
                    onClick={handleDownloadCard}
                    disabled={downloading}
                    className="tracer-btn-next px-4 py-2"
                    style={{ fontSize: '14px', border: 'none' }}
                  >
                    <i className="fa-solid fa-download me-2"></i>{' '}
                    {downloading ? 'Menyiapkan Gambar…' : 'Unduh Bukti Pengisian (PNG)'}
                  </button>
                  <Link
                    href="/"
                    className="tracer-btn-back px-4 py-2"
                    style={{ fontSize: '14px' }}
                  >
                    <i className="fa-solid fa-house me-2"></i> Kembali ke Beranda
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

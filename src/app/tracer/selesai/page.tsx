'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

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

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <main>
      <section className="py-120 grey-bg" style={{ minHeight: '85vh' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border text-center">
                <div 
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                  style={{ width: '80px', height: '80px', background: '#dcfce7', color: '#16a34a' }}
                >
                  <i className="fa-solid fa-circle-check fa-3x"></i>
                </div>

                <span className="badge bg-success-subtle text-success px-3 py-1 rounded-pill fw-bold mb-2 d-inline-block">
                  PENGISIAN BERHASIL
                </span>
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
                      <h6 className="fw-bold mb-0 text-success">Tanda Terima Digital Tracer Study</h6>
                      <small className="text-muted">Pemerintah Provinsi Kalimantan Timur</small>
                    </div>
                    <span className="badge bg-success">TERVERIFIKASI</span>
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
                      <div className="fw-bold text-success">{receipt?.status?.replace(/_/g, ' ') || 'TERISI'}</div>
                    </div>
                    <div className="col-sm-6">
                      <span className="text-muted">Waktu Penyerahan:</span>
                      <div className="fw-bold font-monospace text-dark">
                        {receipt?.submittedAt ? new Date(receipt.submittedAt).toLocaleString('id-ID') : new Date().toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-2 justify-content-center">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="btn btn-outline-secondary px-4 py-2 rounded-pill fw-semibold"
                  >
                    <i className="fa-solid fa-print me-2"></i> Cetak / Simpan Tanda Terima
                  </button>
                  <Link
                    href="/"
                    className="tp-btn text-white px-5 py-2 rounded-pill shadow-sm"
                    style={{ background: '#1E856C', fontWeight: 600 }}
                  >
                    Kembali ke Beranda <i className="fa-solid fa-house ms-2"></i>
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

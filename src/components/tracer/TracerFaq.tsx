'use client';

import React, { useState } from 'react';

const faqs = [
  {
    id: 1,
    q: 'Siapa saja yang berhak dan wajib mengisi Tracer Study ini?',
    a: 'Seluruh lulusan/alumni SMA dan SMK negeri maupun swasta di bawah naungan Dinas Pendidikan dan Kebudayaan Provinsi Kalimantan Timur.',
  },
  {
    id: 2,
    q: 'Berapa lama waktu yang dibutuhkan untuk menyelesaikan kuesioner?',
    a: 'Rata-rata pengisian membutuhkan waktu 3 hingga 5 menit. Kuesioner dilengkapi sistem percabangan cerdas sehingga Anda hanya menjawab pertanyaan sesuai status kondisi Anda saat ini.',
  },
  {
    id: 3,
    q: 'Bagaimana jika NISN atau Tanggal Lahir saya dinyatakan tidak cocok?',
    a: 'Pastikan penulisan NISN 10 digit angka dan tanggal lahir sesuai dengan Ijazah/Dapodik saat lulus. Jika masih terkendala, hubungi operator BKK sekolah almamater Anda untuk sinkronisasi data induk.',
  },
  {
    id: 4,
    q: 'Apakah kerahasiaan data pribadi dan gaji/penghasilan saya terjamin?',
    a: 'Ya, seluruh data pribadi dan informasi sensitif dilindungi penuh. Data hanya digunakan secara agregat oleh Dinas Pendidikan Provinsi Kalimantan Timur untuk evaluasi mutu kurikulum dan tidak akan dipublikasikan ke pihak komersial.',
  },
  {
    id: 5,
    q: 'Apakah pengisian kuesioner bisa diulang atau disunting kembali?',
    a: 'Setiap alumni hanya dapat mengisi kuesioner sebanyak 1 (satu) kali demi validitas data penelitian. Setelah disubmit, Anda akan menerima nomor bukti tanda terima resmi.',
  },
];

export default function TracerFaq() {
  const [activeId, setActiveId] = useState<number | null>(1);

  return (
    <section id="faq" className="py-100" style={{ background: '#f8fafc' }}>
      <div className="container">
        <div className="text-center mb-60">
          <span className="badge text-danger px-3 py-2 rounded-pill fw-bold mb-2">
            PUSAT BANTUAN
          </span>
          <h2 className="fw-bold text-dark mb-2" style={{ fontSize: '32px' }}>
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Jawaban lengkap seputar mekanisme pengisian dan manfaat Tracer Study Kalimantan Timur.
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="d-flex flex-column gap-3">
              {faqs.map((f) => {
                const isOpen = activeId === f.id;
                return (
                  <div 
                    key={f.id}
                    className="bg-white rounded-4 border overflow-hidden shadow-sm"
                    style={{ transition: 'all 0.2s ease' }}
                  >
                    <button
                      type="button"
                      className="w-100 p-4 text-start d-flex align-items-center justify-content-between border-0 bg-white"
                      onClick={() => setActiveId(isOpen ? null : f.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <span className="fw-bold text-dark pe-3" style={{ fontSize: '16px' }}>
                        {f.q}
                      </span>
                      <i 
                        className={`fa-solid ${isOpen ? 'fa-minus text-danger' : 'fa-plus text-muted'}`}
                      ></i>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-0 text-muted" style={{ fontSize: '14px', lineHeight: 1.6 }}>
                        <hr className="mt-0 mb-3" style={{ borderColor: '#e2e8f0' }} />
                        {f.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

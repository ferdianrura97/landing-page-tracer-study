import React from 'react';
import Link from 'next/link';

const steps = [
  {
    step: '01',
    icon: 'fa-solid fa-fingerprint',
    title: 'Verifikasi Identitas',
    desc: 'Masukkan 10 digit NISN dan tanggal lahir untuk mencocokkan profil almamater di pangkalan data.',
    color: '#0284c7',
    bgColor: '#e0f2fe',
  },
  {
    step: '02',
    icon: 'fa-solid fa-address-book',
    title: 'Kontak & Domisili',
    desc: 'Lengkapi nomor WhatsApp aktif, email, serta kabupaten/kota tempat tinggal Anda saat ini.',
    color: '#16a34a',
    bgColor: '#dcfce7',
  },
  {
    step: '03',
    icon: 'fa-solid fa-briefcase',
    title: 'Status Karier Terkini',
    desc: 'Pilih kondisi Anda: Bekerja, Melanjutkan Kuliah, Berwirausaha, atau Sedang Mencari Kerja.',
    color: '#d97706',
    bgColor: '#fef3c7',
  },
  {
    step: '04',
    icon: 'fa-solid fa-award',
    title: 'Evaluasi & Tanda Bukti',
    desc: 'Beri penilaian fasilitas & kurikulum sekolah, lalu simpan nomor tanda terima partisipasi digital Anda.',
    color: '#9333ea',
    bgColor: '#f3e8ff',
  },
];

export default function TracerProcess() {
  return (
    <section id="alur" className="py-100" style={{ background: '#ffffff' }}>
      <div className="container">
        <div className="text-center mb-60">
          <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill fw-bold mb-2">
            PANDUAN ALUR
          </span>
          <h2 className="fw-bold text-dark mb-2" style={{ fontSize: '32px' }}>
            4 Langkah Mudah Pengisian Tracer Study
          </h2>
          <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Kuesioner dirancang dengan logika percabangan ringkas agar Anda hanya mengisi apa yang relevan.
          </p>
        </div>

        <div className="row g-4">
          {steps.map((s) => (
            <div key={s.step} className="col-lg-3 col-md-6">
              <div 
                className="p-4 rounded-4 h-100 position-relative border"
                style={{ background: '#f8fafc', transition: 'all 0.3s ease' }}
              >
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-3"
                    style={{ width: '50px', height: '50px', background: s.bgColor, color: s.color }}
                  >
                    <i className={`${s.icon} fa-lg`}></i>
                  </div>
                  <span className="fw-bold text-muted" style={{ fontSize: '24px', opacity: 0.4 }}>
                    {s.step}
                  </span>
                </div>
                <h5 className="fw-bold text-dark mb-2">{s.title}</h5>
                <p className="text-muted mb-0" style={{ fontSize: '13px', lineHeight: 1.6 }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-50">
          <Link 
            href="/tracer" 
            className="tp-btn text-white px-5 py-3 rounded-pill shadow-sm"
            style={{ background: '#1E856C', fontSize: '15px', fontWeight: 600 }}
          >
            Mulai Pengisian Sekarang <i className="fa-solid fa-arrow-right ms-2"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}

'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { fetchApi } from '@/lib/api';

interface LaporanWilayahItem {
  id: number;
  kode: string;
  nama: string;
  provinsi: string;
  total_sekolah: number;
  total_alumni: number;
  total_responden: number;
  persentase_partisipasi: number;
  serapan_kerja_kuliah: number;
  status_distribusi: {
    bekerja: number;
    kuliah: number;
    wirausaha: number;
    kerja_kuliah: number;
    belum_bekerja: number;
  };
}

interface DetailWilayahData {
  wilayah: {
    id: number;
    kode: string;
    nama: string;
    provinsi: string;
    total_sekolah: number;
  };
  kpi: {
    total_alumni: number;
    total_responden: number;
    persentase_partisipasi: number;
    serapan_kerja_kuliah: number;
  };
  status_distribusi: {
    bekerja: number;
    kuliah: number;
    wirausaha: number;
    kerja_kuliah: number;
    belum_bekerja: number;
  };
  jenjang_stats: Array<{ jenjang: string; _count: { id: number } }>;
  sekolah_list: Array<{
    id: number;
    npsn: string;
    nama_sekolah: string;
    jenjang: string;
    status_sekolah: string;
    total_alumni: number;
    total_responden: number;
    persentase_partisipasi: number;
    serapan_kerja_kuliah: number;
  }>;
}

export default function LaporanWilayahView() {
  const [list, setList] = useState<LaporanWilayahItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedWilayahId, setSelectedWilayahId] = useState<number | null>(null);
  const [detailData, setDetailData] = useState<DetailWilayahData | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    async function loadLaporanWilayah() {
      setLoading(true);
      try {
        const res = await fetchApi<{ sukses: boolean; data: LaporanWilayahItem[] }>(
          '/publik/laporan/wilayah?limit=50'
        );
        if (res.sukses && Array.isArray(res.data)) {
          setList(res.data);
        }
      } catch (err) {
        console.error('Gagal memuat laporan wilayah publik:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLaporanWilayah();
  }, []);

  // Buka detail analitik saat wilayah diklik
  const handleOpenDetail = async (id: number) => {
    setSelectedWilayahId(id);
    setLoadingDetail(true);
    setDetailData(null);
    try {
      const res = await fetchApi<{ sukses: boolean; data: DetailWilayahData }>(
        `/publik/laporan/wilayah/${id}/analitik`
      );
      if (res.sukses && res.data) {
        setDetailData(res.data);
      }
    } catch (err) {
      console.error('Gagal memuat detail analitik wilayah:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Lock body scroll saat modal aktif agar background tidak ikut scroll
  useEffect(() => {
    if (selectedWilayahId) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [selectedWilayahId]);

  // Ringkasan KPI agregat se-Kaltim
  const kpiStats = useMemo(() => {
    const totalWilayah = list.length;
    const totalSekolah = list.reduce((acc, curr) => acc + (curr.total_sekolah || 0), 0);
    const totalAlumni = list.reduce((acc, curr) => acc + (curr.total_alumni || 0), 0);
    const totalResponden = list.reduce((acc, curr) => acc + (curr.total_responden || 0), 0);
    const avgPartisipasi =
      totalAlumni > 0 ? ((totalResponden / totalAlumni) * 100).toFixed(1) : '100.0';

    const sumKerja = list.reduce(
      (acc, curr) =>
        acc + (curr.status_distribusi.bekerja + curr.status_distribusi.kerja_kuliah),
      0
    );
    const sumKuliah = list.reduce((acc, curr) => acc + curr.status_distribusi.kuliah, 0);
    const sumWirausaha = list.reduce(
      (acc, curr) => acc + curr.status_distribusi.wirausaha,
      0
    );
    const sumTerserap = sumKerja + sumKuliah + sumWirausaha;
    const pctSerapan =
      totalResponden > 0 ? ((sumTerserap / totalResponden) * 100).toFixed(1) : '90.5';

    return {
      totalWilayah,
      totalSekolah,
      totalResponden,
      avgPartisipasi,
      pctSerapan,
    };
  }, [list]);

  // Filter list wilayah real-time
  const filteredList = useMemo(() => {
    if (!search.trim()) return list;
    const q = search.toLowerCase().trim();
    return list.filter(
      (item) =>
        item.nama.toLowerCase().includes(q) ||
        item.kode.toLowerCase().includes(q) ||
        item.provinsi.toLowerCase().includes(q)
    );
  }, [list, search]);

  return (
    <section className="pt-20 pb-100 grey-bg" style={{ minHeight: '80vh' }}>
      <div className="container">
        {/* 1. BAR RINGKASAN CAPAIAN (KPI CARDS) */}
        <div className="row g-3 mb-40">
          <div className="col-xl-3 col-lg-6 col-md-6">
            <div className="bg-white p-4 rounded-4 shadow-sm border h-100 d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                style={{ width: '52px', height: '52px', background: 'rgba(171, 12, 47, 0.08)', color: '#AB0C2F' }}
              >
                <i className="fa-solid fa-map-location-dot fa-xl"></i>
              </div>
              <div>
                <span className="text-muted d-block" style={{ fontSize: '12px', fontWeight: 600 }}>Wilayah Daerah</span>
                <h3 className="fw-bold mb-0 text-dark" style={{ fontSize: '26px' }}>{kpiStats.totalWilayah} Kab/Kota</h3>
                <small className="text-muted" style={{ fontSize: '11px' }}>3 Kota &bull; 7 Kabupaten Kaltim</small>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-lg-6 col-md-6">
            <div className="bg-white p-4 rounded-4 shadow-sm border h-100 d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                style={{ width: '52px', height: '52px', background: 'rgba(2, 132, 199, 0.08)', color: '#0284c7' }}
              >
                <i className="fa-solid fa-school fa-xl"></i>
              </div>
              <div>
                <span className="text-muted d-block" style={{ fontSize: '12px', fontWeight: 600 }}>Satuan Pendidikan</span>
                <h3 className="fw-bold mb-0 text-dark" style={{ fontSize: '26px' }}>{kpiStats.totalSekolah} Sekolah</h3>
                <small className="text-muted" style={{ fontSize: '11px' }}>Jenjang SMA &amp; SMK se-Kaltim</small>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-lg-6 col-md-6">
            <div className="bg-white p-4 rounded-4 shadow-sm border h-100 d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                style={{ width: '52px', height: '52px', background: 'rgba(16, 185, 129, 0.08)', color: '#10b981' }}
              >
                <i className="fa-solid fa-users fa-xl"></i>
              </div>
              <div>
                <span className="text-muted d-block" style={{ fontSize: '12px', fontWeight: 600 }}>Responden Terdata</span>
                <h3 className="fw-bold mb-0 text-dark" style={{ fontSize: '26px' }}>{kpiStats.totalResponden} Alumni</h3>
                <small className="text-success fw-semibold" style={{ fontSize: '11px' }}>Tervalidasi Buku Induk</small>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-lg-6 col-md-6">
            <div className="bg-white p-4 rounded-4 shadow-sm border h-100 d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                style={{ width: '52px', height: '52px', background: 'rgba(245, 158, 11, 0.08)', color: '#d97706' }}
              >
                <i className="fa-solid fa-chart-pie fa-xl"></i>
              </div>
              <div>
                <span className="text-muted d-block" style={{ fontSize: '12px', fontWeight: 600 }}>Rasio Keterserapan</span>
                <h3 className="fw-bold mb-0" style={{ fontSize: '26px', color: 'var(--tp-theme-primary)' }}>{kpiStats.pctSerapan}%</h3>
                <small className="text-muted" style={{ fontSize: '11px' }}>Kerja, Kuliah &amp; Usaha</small>
              </div>
            </div>
          </div>
        </div>

        {/* 2. PENCARIAN & FILTER WILAYAH */}
        <div className="bg-white p-3 p-md-4 rounded-4 shadow-sm border mb-30 d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="position-relative" style={{ maxWidth: '420px', width: '100%' }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Cari nama kabupaten atau kota di Kaltim…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control rounded-pill ps-5 py-2 fs-6"
              style={{ borderColor: '#cbd5e1' }}
            />
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="badge rounded-pill px-3 py-2" style={{ background: 'rgba(171, 12, 47, 0.08)', color: '#AB0C2F', fontSize: '12px', fontWeight: 600 }}>
              {filteredList.length} dari 10 Wilayah
            </span>
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="btn btn-sm btn-link text-decoration-none text-muted"
                style={{ fontSize: '13px' }}
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* 3. GRID KARTU ANALITIK PER WILAYAH */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: 'var(--tp-theme-primary)' }} role="status">
              <span className="visually-hidden">Memuat data wilayah…</span>
            </div>
            <p className="mt-2 text-muted" style={{ fontSize: '14px' }}>Memuat data pelaporan wilayah Kaltim…</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="bg-white p-5 rounded-4 border text-center my-4">
            <i className="fa-solid fa-map-location-dot fa-3x text-muted mb-3 opacity-50"></i>
            <h5 className="fw-bold text-dark">Wilayah Tidak Ditemukan</h5>
            <p className="text-muted" style={{ fontSize: '14px' }}>Tidak ada kabupaten/kota yang sesuai dengan kata kunci &ldquo;{search}&rdquo;.</p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredList.map((item) => {
              const isKota = item.nama.toUpperCase().startsWith('KOTA');
              const displayName = item.nama.replace(/^KOTA\s+/i, '');
              const bekerjaCount = (item.status_distribusi.bekerja || 0) + (item.status_distribusi.kerja_kuliah || 0);
              const kuliahCount = item.status_distribusi.kuliah || 0;
              const wirausahaCount = item.status_distribusi.wirausaha || 0;
              const belumKerjaCount = item.status_distribusi.belum_bekerja || 0;

              const totalTraced = item.total_responden || 0;
              const pctBekerja = totalTraced > 0 ? Math.round((bekerjaCount / totalTraced) * 100) : 0;
              const pctKuliah = totalTraced > 0 ? Math.round((kuliahCount / totalTraced) * 100) : 0;
              const pctWirausaha = totalTraced > 0 ? Math.round((wirausahaCount / totalTraced) * 100) : 0;
              const pctBelum = totalTraced > 0 ? Math.round((belumKerjaCount / totalTraced) * 100) : 0;

              return (
                <div key={item.id} className="col-xl-6 col-lg-6 col-md-12">
                  <div
                    className="bg-white p-4 rounded-4 shadow-sm border h-100 d-flex flex-column justify-content-between"
                    style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
                  >
                    <div>
                      {/* Top Header Card */}
                      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                        <div className="d-flex align-items-center gap-2">
                          <span
                            className="badge rounded-pill px-2 py-1"
                            style={{
                              background: isKota ? 'rgba(2, 132, 199, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                              color: isKota ? '#0284c7' : '#475569',
                              fontSize: '11px',
                              fontWeight: 700,
                            }}
                          >
                            {isKota ? 'KOTA' : 'KABUPATEN'}
                          </span>
                          <h4 className="fw-bold mb-0 text-dark" style={{ fontSize: '18px' }}>
                            {displayName}
                          </h4>
                        </div>
                        <span className="font-monospace text-muted" style={{ fontSize: '11.5px' }}>
                          Kode: {item.kode}
                        </span>
                      </div>

                      {/* Info Stat Row */}
                      <div className="row g-2 mb-3 text-center">
                        <div className="col-4">
                          <div className="p-2 rounded-3 bg-light border">
                            <small className="text-muted d-block" style={{ fontSize: '11px' }}>Sekolah</small>
                            <strong className="text-dark" style={{ fontSize: '14px' }}>{item.total_sekolah} Unit</strong>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="p-2 rounded-3 bg-light border">
                            <small className="text-muted d-block" style={{ fontSize: '11px' }}>Responden</small>
                            <strong className="text-dark" style={{ fontSize: '14px' }}>{item.total_responden} Org</strong>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="p-2 rounded-3 border" style={{ background: 'rgba(171, 12, 47, 0.05)', borderColor: 'rgba(171, 12, 47, 0.15)' }}>
                            <small className="d-block" style={{ fontSize: '11px', color: '#AB0C2F' }}>Partisipasi</small>
                            <strong style={{ fontSize: '14px', color: '#AB0C2F' }}>{item.persentase_partisipasi}%</strong>
                          </div>
                        </div>
                      </div>

                      {/* 4-Color Distribution Progress Bar */}
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1" style={{ fontSize: '11.5px' }}>
                          <span className="fw-semibold text-dark">Distribusi Aktivitas Alumni:</span>
                          <span className="text-muted font-monospace">{totalTraced} Terdata</span>
                        </div>
                        <div className="progress rounded-pill overflow-hidden" style={{ height: '9px', background: '#e2e8f0' }}>
                          {totalTraced > 0 ? (
                            <>
                              <div className="progress-bar" style={{ width: `${pctBekerja}%`, backgroundColor: '#AB0C2F' }} title={`Bekerja: ${bekerjaCount} (${pctBekerja}%)`} />
                              <div className="progress-bar" style={{ width: `${pctKuliah}%`, backgroundColor: '#0284c7' }} title={`Kuliah: ${kuliahCount} (${pctKuliah}%)`} />
                              <div className="progress-bar" style={{ width: `${pctWirausaha}%`, backgroundColor: '#f59e0b' }} title={`Wirausaha: ${wirausahaCount} (${pctWirausaha}%)`} />
                              <div className="progress-bar" style={{ width: `${pctBelum}%`, backgroundColor: '#94a3b8' }} title={`Belum Bekerja: ${belumKerjaCount} (${pctBelum}%)`} />
                            </>
                          ) : (
                            <div className="progress-bar bg-light text-muted" style={{ width: '100%' }}></div>
                          )}
                        </div>

                        {/* Legend Mini Tags */}
                        <div className="d-flex flex-wrap gap-2 mt-2 pt-1" style={{ fontSize: '11px' }}>
                          <span className="d-inline-flex align-items-center gap-1">
                            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#AB0C2F' }} />
                            Kerja: <strong>{bekerjaCount}</strong>
                          </span>
                          <span className="d-inline-flex align-items-center gap-1">
                            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#0284c7' }} />
                            Kuliah: <strong>{kuliahCount}</strong>
                          </span>
                          <span className="d-inline-flex align-items-center gap-1">
                            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                            Usaha: <strong>{wirausahaCount}</strong>
                          </span>
                          <span className="d-inline-flex align-items-center gap-1 text-muted">
                            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#94a3b8' }} />
                            Belum: <strong>{belumKerjaCount}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Button */}
                    <div className="pt-3 border-top d-flex justify-content-between align-items-center">
                      <small className="text-muted" style={{ fontSize: '11.5px' }}>
                        Terserap: <strong style={{ color: '#AB0C2F' }}>{item.serapan_kerja_kuliah}%</strong>
                      </small>
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(item.id)}
                        className="btn btn-sm rounded-pill px-3 py-1 fw-semibold text-decoration-none"
                        style={{
                          background: 'rgba(171, 12, 47, 0.08)',
                          color: '#AB0C2F',
                          border: '1px solid rgba(171, 12, 47, 0.22)',
                          fontSize: '12px',
                        }}
                      >
                        Lihat Rincian <i className="fa-solid fa-arrow-right ms-1"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ==================== POPUP MODAL RINCIAN ANALITIK WILAYAH ==================== */}
      {selectedWilayahId && (
        <div
          className="d-flex align-items-center justify-content-center p-3"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(3, 15, 33, 0.65)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
          onClick={() => setSelectedWilayahId(null)}
        >
          <div
            className="bg-white rounded-4 shadow-lg p-3 p-md-5 position-relative"
            style={{
              maxWidth: '840px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              border: '1px solid rgba(171, 12, 47, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setSelectedWilayahId(null)}
              className="btn btn-sm btn-light rounded-circle position-absolute"
              style={{ top: 20, right: 20, width: 36, height: 36 }}
              aria-label="Tutup"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            {loadingDetail ? (
              <div className="text-center py-5">
                <div className="spinner-border" style={{ color: '#AB0C2F' }} role="status"></div>
                <p className="mt-2 text-muted" style={{ fontSize: '14px' }}>Memuat analitik wilayah…</p>
              </div>
            ) : detailData ? (
              <div>
                {/* Header Modal */}
                <div className="border-bottom pb-3 mb-4">
                  <span className="badge rounded-pill px-3 py-1 mb-2" style={{ background: 'rgba(171, 12, 47, 0.08)', color: '#AB0C2F', fontSize: '11px', fontWeight: 700 }}>
                    ANALITIK WILAYAH KALTIM
                  </span>
                  <h3 className="fw-bold text-dark mb-1" style={{ fontSize: '24px' }}>
                    {detailData.wilayah.nama}
                  </h3>
                  <p className="text-muted mb-0" style={{ fontSize: '13px' }}>
                    Provinsi: {detailData.wilayah.provinsi} &bull; Total {detailData.wilayah.total_sekolah} Satuan Pendidikan Terdata
                  </p>
                </div>

                {/* 4 Summary Stat Cards */}
                <div className="row g-2 mb-4 text-center">
                  <div className="col-3">
                    <div className="p-2 p-md-3 rounded-3 bg-light border">
                      <small className="text-muted d-block" style={{ fontSize: '11px' }}>Total Sekolah</small>
                      <strong className="text-dark fs-6">{detailData.wilayah.total_sekolah} Unit</strong>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="p-2 p-md-3 rounded-3 bg-light border">
                      <small className="text-muted d-block" style={{ fontSize: '11px' }}>Total Alumni</small>
                      <strong className="text-dark fs-6">{detailData.kpi.total_alumni} Siswa</strong>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="p-2 p-md-3 rounded-3 bg-light border">
                      <small className="text-muted d-block" style={{ fontSize: '11px' }}>Responden</small>
                      <strong className="text-dark fs-6">{detailData.kpi.total_responden} Terdata</strong>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="p-2 p-md-3 rounded-3 border" style={{ background: 'rgba(171, 12, 47, 0.06)', borderColor: 'rgba(171, 12, 47, 0.18)' }}>
                      <small className="d-block" style={{ fontSize: '11px', color: '#AB0C2F' }}>Serapan</small>
                      <strong className="fs-6" style={{ color: '#AB0C2F' }}>{detailData.kpi.serapan_kerja_kuliah}%</strong>
                    </div>
                  </div>
                </div>

                {/* Status Distribusi Alumni Rinci */}
                <div className="p-3 rounded-3 border mb-4" style={{ background: '#f8fafc' }}>
                  <h6 className="fw-bold text-dark mb-3" style={{ fontSize: '13.5px' }}>
                    <i className="fa-solid fa-chart-pie me-2" style={{ color: '#AB0C2F' }}></i>
                    Distribusi Status Karier Alumni di {detailData.wilayah.nama}
                  </h6>
                  <div className="row g-2 text-center" style={{ fontSize: '12px' }}>
                    <div className="col-md-3 col-6">
                      <div className="bg-white p-2 rounded-2 border">
                        <span className="text-muted d-block" style={{ fontSize: '11px' }}>Bekerja</span>
                        <strong style={{ color: '#AB0C2F' }}>
                          {(detailData.status_distribusi.bekerja || 0) + (detailData.status_distribusi.kerja_kuliah || 0)} Org
                        </strong>
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div className="bg-white p-2 rounded-2 border">
                        <span className="text-muted d-block" style={{ fontSize: '11px' }}>Kuliah / Studi</span>
                        <strong style={{ color: '#0284c7' }}>{detailData.status_distribusi.kuliah || 0} Org</strong>
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div className="bg-white p-2 rounded-2 border">
                        <span className="text-muted d-block" style={{ fontSize: '11px' }}>Wirausaha</span>
                        <strong style={{ color: '#d97706' }}>{detailData.status_distribusi.wirausaha || 0} Org</strong>
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div className="bg-white p-2 rounded-2 border">
                        <span className="text-muted d-block" style={{ fontSize: '11px' }}>Belum Bekerja</span>
                        <strong className="text-muted">{detailData.status_distribusi.belum_bekerja || 0} Org</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Daftar Sekolah di Wilayah Ini */}
                <div>
                  <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '13.5px' }}>
                    <i className="fa-solid fa-building-columns me-2" style={{ color: '#AB0C2F' }}></i>
                    Daftar Sekolah Terdaftar ({detailData.sekolah_list.length} Satuan)
                  </h6>
                  <div className="table-responsive rounded-3 border" style={{ maxHeight: '240px', overflowY: 'auto' }}>
                    <table className="table table-hover table-striped mb-0" style={{ fontSize: '12.5px' }}>
                      <thead className="table-light">
                        <tr>
                          <th>NPSN</th>
                          <th>Nama Sekolah</th>
                          <th>Jenjang</th>
                          <th>Status</th>
                          <th className="text-center">Responden</th>
                          <th className="text-center">Partisipasi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailData.sekolah_list.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-3 text-muted">Belum ada sekolah terdata.</td>
                          </tr>
                        ) : (
                          detailData.sekolah_list.map((s) => (
                            <tr key={s.id}>
                              <td className="font-monospace text-muted">{s.npsn}</td>
                              <td className="fw-semibold text-dark">{s.nama_sekolah}</td>
                              <td>
                                <span className={`badge ${s.jenjang === 'SMK' ? 'bg-primary' : 'bg-secondary'}`} style={{ fontSize: '10px' }}>
                                  {s.jenjang}
                                </span>
                              </td>
                              <td><small className="text-muted">{s.status_sekolah}</small></td>
                              <td className="text-center font-monospace">{s.total_responden} / {s.total_alumni}</td>
                              <td className="text-center fw-bold" style={{ color: '#AB0C2F' }}>{s.persentase_partisipasi}%</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}

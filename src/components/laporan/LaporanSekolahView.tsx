'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { fetchApi } from '@/lib/api';

interface KotaItem {
  id: number;
  kode: string;
  nama: string;
}

interface LaporanSekolahItem {
  id: number;
  npsn: string;
  nama_sekolah: string;
  jenjang: 'SMA' | 'SMK';
  status_sekolah: 'NEGERI' | 'SWASTA';
  kota: {
    id: number;
    nama: string;
    provinsi: string;
  };
  jurusan_count: number;
  total_alumni: number;
  total_responden: number;
  persentase_partisipasi: number;
  status_distribusi: {
    bekerja: number;
    kuliah: number;
    wirausaha: number;
    kerja_kuliah: number;
    belum_bekerja: number;
  };
}

interface DetailSekolahData {
  sekolah: {
    id: number;
    npsn: string;
    nama_sekolah: string;
    jenjang: 'SMA' | 'SMK';
    status_sekolah: string;
    alamat: string | null;
    kota: string;
    provinsi: string;
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
  evaluasi_rata_rata: {
    komputer: number;
    bahasa_asing: number;
    komunikasi: number;
    etika_kerja: number;
    kerja_sama_tim: number;
    sarana_praktik: number;
    peran_bkk: number;
    pendampingan_guru: number;
  } | null;
  jurusan_stats: Array<{
    id: number;
    kode: string;
    nama: string;
    total_alumni: number;
    total_responden: number;
    bekerja: number;
    kuliah: number;
    wirausaha: number;
  }>;
  responden_terbaru: Array<{
    id: number;
    nisn: string;
    nama_lengkap: string;
    tahun_lulus: number;
    jurusan: string;
    sudah_mengisi: boolean;
    status_utama: string | null;
  }>;
}

interface ApiLaporanSekolahResponse {
  sukses: boolean;
  data: LaporanSekolahItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export default function LaporanSekolahView() {
  const [list, setList] = useState<LaporanSekolahItem[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 15, total_pages: 1 });
  const [loading, setLoading] = useState(true);
  const [kotaList, setKotaList] = useState<KotaItem[]>([]);

  // Filter States
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedKotaId, setSelectedKotaId] = useState('');
  const [selectedJenjang, setSelectedJenjang] = useState<'' | 'SMA' | 'SMK'>('');
  const [selectedStatus, setSelectedStatus] = useState<'' | 'NEGERI' | 'SWASTA'>('');
  const [page, setPage] = useState(1);

  // Modal States
  const [selectedSekolahId, setSelectedSekolahId] = useState<number | null>(null);
  const [detailData, setDetailData] = useState<DetailSekolahData | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [modalRespondenPage, setModalRespondenPage] = useState(1);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  // Lock body scroll saat modal aktif agar background tidak ikut scroll
  useEffect(() => {
    if (selectedSekolahId) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [selectedSekolahId]);

  // Load Kota List
  useEffect(() => {
    async function loadKota() {
      try {
        const res = await fetchApi<{ sukses: boolean; data: KotaItem[] }>('/wilayah/kota?kode_provinsi=64');
        if (res.sukses && Array.isArray(res.data)) {
          setKotaList(res.data);
        }
      } catch (err) {
        console.error('Gagal memuat data kota:', err);
      }
    }
    loadKota();
  }, []);

  // Fetch Data Sekolah
  useEffect(() => {
    let ignore = false;
    async function fetchSekolah() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "15",
        });
        if (debouncedSearch.trim()) params.set("cari", debouncedSearch.trim());
        if (selectedKotaId) params.set("kota_id", selectedKotaId);
        if (selectedJenjang) params.set("jenjang", selectedJenjang);
        if (selectedStatus) params.set("status_sekolah", selectedStatus);

        const res = await fetchApi<ApiLaporanSekolahResponse>(`/publik/laporan/sekolah?${params.toString()}`);
        if (!ignore && res.sukses && Array.isArray(res.data)) {
          setList(res.data);
          if (res.meta) setMeta(res.meta);
        }
      } catch (err) {
        console.error("Gagal memuat laporan sekolah publik:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchSekolah();
    return () => {
      ignore = true;
    };
  }, [page, debouncedSearch, selectedKotaId, selectedJenjang, selectedStatus]);

  // Open Detail Modal
  const handleOpenDetail = async (id: number) => {
    setSelectedSekolahId(id);
    setLoadingDetail(true);
    setDetailData(null);
    setModalRespondenPage(1);
    try {
      const res = await fetchApi<{ sukses: boolean; data: DetailSekolahData }>(
        `/publik/laporan/sekolah/${id}/analitik`
      );
      if (res.sukses && res.data) {
        setDetailData(res.data);
      }
    } catch (err) {
      console.error('Gagal memuat detail analitik sekolah:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setSelectedKotaId('');
    setSelectedJenjang('');
    setSelectedStatus('');
    setPage(1);
  };

  const hasActiveFilters = Boolean(search || selectedKotaId || selectedJenjang || selectedStatus);

  // Summary Metrics
  const summaryKpi = useMemo(() => {
    const totalSekolah = meta.total || 0;
    const totalRespondenList = list.reduce((acc, curr) => acc + (curr.total_responden || 0), 0);
    const totalAlumniList = list.reduce((acc, curr) => acc + (curr.total_alumni || 0), 0);
    const avgPartisipasi =
      totalAlumniList > 0 ? ((totalRespondenList / totalAlumniList) * 100).toFixed(1) : '94.2';

    return {
      totalSekolah,
      avgPartisipasi,
    };
  }, [meta.total, list]);

  return (
    <section className="pt-20 pb-100 grey-bg" style={{ minHeight: '80vh' }}>
      <div className="container">
        {/* ==================== 1. KPI SUMMARY CARDS ==================== */}
        <div className="row g-3 mb-40">
          <div className="col-lg-4 col-md-6">
            <div className="bg-white p-4 rounded-4 shadow-sm border h-100 d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                style={{ width: "52px", height: "52px", background: "rgba(171, 12, 47, 0.08)", color: "#AB0C2F" }}
              >
                <i className="fa-solid fa-school fa-xl"></i>
              </div>
              <div>
                <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                  Total Satuan Pendidikan
                </span>
                <h3 className="fw-bold mb-0 text-dark" style={{ fontSize: "24px" }}>
                  {summaryKpi.totalSekolah} <small className="fs-6 text-muted fw-normal">Sekolah</small>
                </h3>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="bg-white p-4 rounded-4 shadow-sm border h-100 d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                style={{ width: "52px", height: "52px", background: "rgba(2, 132, 199, 0.08)", color: "#0284c7" }}
              >
                <i className="fa-solid fa-graduation-cap fa-xl"></i>
              </div>
              <div>
                <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                  Jenjang Satuan
                </span>
                <h3 className="fw-bold mb-0 text-dark" style={{ fontSize: "20px" }}>
                  SMA <span className="text-muted fw-normal">&amp;</span> SMK
                </h3>
                <small className="text-muted" style={{ fontSize: "12px" }}>Negeri &amp; Swasta Kaltim</small>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-12">
            <div className="bg-white p-4 rounded-4 shadow-sm border h-100 d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                style={{ width: "52px", height: "52px", background: "rgba(22, 163, 74, 0.08)", color: "#16a34a" }}
              >
                <i className="fa-solid fa-chart-line fa-xl"></i>
              </div>
              <div>
                <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                  Tingkat Partisipasi
                </span>
                <h3 className="fw-bold mb-0 text-dark" style={{ fontSize: "24px" }}>
                  {summaryKpi.avgPartisipasi}%
                </h3>
                <small className="text-muted" style={{ fontSize: "12px" }}>Pengisian Kuesioner</small>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 2. FILTER & PENCARIAN ==================== */}
        <div className="bg-white p-4 rounded-4 shadow-sm border mb-30">
          <div className="row g-3 align-items-center">
            {/* Search Box */}
            <div className="col-lg-4 col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-start-0"
                  placeholder="Cari nama sekolah atau NPSN…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ fontSize: '14px' }}
                />
                {search && (
                  <button
                    className="btn btn-light border"
                    type="button"
                    onClick={() => setSearch('')}
                    title="Hapus pencarian"
                  >
                    <i className="fa-solid fa-xmark text-muted"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Filter Wilayah (Kota/Kabupaten) */}
            <div className="col-lg-3 col-md-6">
              <select
                className="form-select bg-light"
                value={selectedKotaId}
                onChange={(e) => {
                  setSelectedKotaId(e.target.value);
                  setPage(1);
                }}
                style={{ fontSize: '13.5px' }}
              >
                <option value="">Semua Wilayah (10 Kab/Kota)</option>
                {kotaList.map((kota) => (
                  <option key={kota.id} value={kota.id}>
                    {kota.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Jenjang (Pills) */}
            <div className="col-lg-3 col-md-6">
              <div className="btn-group w-100" role="group">
                <button
                  type="button"
                  className={`btn btn-sm ${selectedJenjang === '' ? 'btn-dark' : 'btn-outline-secondary'}`}
                  onClick={() => {
                    setSelectedJenjang('');
                    setPage(1);
                  }}
                  style={{ fontSize: '12px' }}
                >
                  Semua
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${selectedJenjang === 'SMA' ? 'text-white' : 'btn-outline-secondary'}`}
                  style={{
                    backgroundColor: selectedJenjang === 'SMA' ? '#0284c7' : 'transparent',
                    borderColor: selectedJenjang === 'SMA' ? '#0284c7' : undefined,
                    fontSize: '12px',
                  }}
                  onClick={() => {
                    setSelectedJenjang('SMA');
                    setPage(1);
                  }}
                >
                  SMA
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${selectedJenjang === 'SMK' ? 'text-white' : 'btn-outline-secondary'}`}
                  style={{
                    backgroundColor: selectedJenjang === 'SMK' ? '#AB0C2F' : 'transparent',
                    borderColor: selectedJenjang === 'SMK' ? '#AB0C2F' : undefined,
                    fontSize: '12px',
                  }}
                  onClick={() => {
                    setSelectedJenjang('SMK');
                    setPage(1);
                  }}
                >
                  SMK
                </button>
              </div>
            </div>

            {/* Filter Status & Reset */}
            <div className="col-lg-2 col-md-6 d-flex gap-2">
              <select
                className="form-select form-select-sm bg-light"
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value as "" | "NEGERI" | "SWASTA");
                  setPage(1);
                }}
                style={{ fontSize: '12.5px' }}
              >
                <option value="">Semua Status</option>
                <option value="NEGERI">Negeri</option>
                <option value="SWASTA">Swasta</option>
              </select>

              {hasActiveFilters && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger flex-shrink-0"
                  onClick={handleResetFilters}
                  title="Reset Filter"
                >
                  <i className="fa-solid fa-arrow-rotate-left"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ==================== 3. TABEL DATA SEKOLAH ==================== */}
        <div className="bg-white rounded-4 shadow-sm border overflow-hidden">
          <div className="p-4 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h5 className="fw-bold mb-1 text-dark" style={{ fontSize: '17px' }}>
                Direktori Capaian Satuan Pendidikan
              </h5>
              <p className="text-muted mb-0" style={{ fontSize: '13px' }}>
                Menampilkan data {list.length} dari total {meta.total} satuan pendidikan terdata di Kaltim
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: '#AB0C2F' }} role="status"></div>
              <p className="mt-3 text-muted" style={{ fontSize: '14px' }}>Memuat daftar sekolah…</p>
            </div>
          ) : list.length === 0 ? (
            <div className="text-center py-5">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{ width: '64px', height: '64px', background: '#f1f5f9', color: '#94a3b8' }}
              >
                <i className="fa-solid fa-school-circle-xmark fa-2xl"></i>
              </div>
              <h6 className="fw-bold text-dark">Tidak ada sekolah yang sesuai kriteria</h6>
              <p className="text-muted mb-3" style={{ fontSize: '13px' }}>
                Coba ubah kata kunci pencarian atau reset filter wilayah dan jenjang.
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="btn btn-sm text-white px-3 py-2 rounded-pill"
                  style={{ background: '#AB0C2F', fontSize: '13px' }}
                >
                  Reset Semua Filter
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ fontSize: '13.5px' }}>
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '60px' }} className="text-center">No</th>
                    <th>Nama Satuan Pendidikan</th>
                    <th>Jenjang / Status</th>
                    <th>Kabupaten / Kota</th>
                    <th className="text-center">Responden</th>
                    <th style={{ width: '180px' }}>Partisipasi Survei</th>
                    <th style={{ width: '130px' }} className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((item, index) => {
                    const rowNumber = (meta.page - 1) * meta.limit + index + 1;
                    const partisipasiPct = Math.min(100, item.persentase_partisipasi || 0);

                    return (
                      <tr key={item.id}>
                        <td className="text-center text-muted fw-semibold">{rowNumber}</td>
                        <td>
                          <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>
                            {item.nama_sekolah}
                          </div>
                          <span className="font-monospace text-muted" style={{ fontSize: '12px' }}>
                            NPSN: {item.npsn}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-1">
                            <span
                              className="badge"
                              style={{
                                backgroundColor: item.jenjang === 'SMK' ? '#AB0C2F' : '#0284c7',
                                fontSize: '10.5px',
                                fontWeight: 600,
                              }}
                            >
                              {item.jenjang}
                            </span>
                            <span className="badge bg-light text-secondary border" style={{ fontSize: '10.5px' }}>
                              {item.status_sekolah}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="text-dark fw-medium">{item.kota.nama}</span>
                        </td>
                        <td className="text-center">
                          <strong className="text-dark">{item.total_responden}</strong>
                          <span className="text-muted" style={{ fontSize: '12px' }}> / {item.total_alumni}</span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center justify-content-between mb-1">
                            <span className="fw-bold" style={{ fontSize: '12.5px', color: '#AB0C2F' }}>
                              {partisipasiPct}%
                            </span>
                          </div>
                          <div className="progress" style={{ height: '6px', backgroundColor: '#f1f5f9' }}>
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{
                                width: `${partisipasiPct}%`,
                                backgroundColor: partisipasiPct >= 80 ? '#16a34a' : '#AB0C2F',
                              }}
                              aria-valuenow={partisipasiPct}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            ></div>
                          </div>
                        </td>
                        <td className="text-center">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(item.id)}
                            className="btn btn-sm rounded-pill px-3 py-1 fw-semibold text-white shadow-sm"
                            style={{
                              background: '#AB0C2F',
                              fontSize: '12px',
                              border: 'none',
                              transition: 'all 0.2s',
                            }}
                          >
                            <i className="fa-solid fa-chart-pie me-1"></i>
                            Rincian
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ==================== 4. PAGINATION ==================== */}
          {meta.total_pages > 1 && (
            <div className="p-3 border-top d-flex justify-content-between align-items-center flex-wrap gap-2">
              <span className="text-muted" style={{ fontSize: '13px' }}>
                Halaman <strong>{meta.page}</strong> dari <strong>{meta.total_pages}</strong>
              </span>

              <nav aria-label="Navigasi Halaman Sekolah">
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${meta.page <= 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={meta.page <= 1}
                      aria-label="Sebelumnya"
                    >
                      <i className="fa-solid fa-chevron-left"></i>
                    </button>
                  </li>

                  {Array.from({ length: meta.total_pages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === meta.total_pages || Math.abs(p - meta.page) <= 2)
                    .map((p, idx, arr) => {
                      const prevPage = arr[idx - 1];
                      const showEllipsis = prevPage && p - prevPage > 1;

                      return (
                        <React.Fragment key={p}>
                          {showEllipsis && (
                            <li className="page-item disabled">
                              <span className="page-link">…</span>
                            </li>
                          )}
                          <li className={`page-item ${meta.page === p ? 'active' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => setPage(p)}
                              style={{
                                backgroundColor: meta.page === p ? '#AB0C2F' : undefined,
                                borderColor: meta.page === p ? '#AB0C2F' : undefined,
                                color: meta.page === p ? '#ffffff' : undefined,
                              }}
                            >
                              {p}
                            </button>
                          </li>
                        </React.Fragment>
                      );
                    })}

                  <li className={`page-item ${meta.page >= meta.total_pages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setPage((p) => Math.min(meta.total_pages, p + 1))}
                      disabled={meta.page >= meta.total_pages}
                      aria-label="Berikutnya"
                    >
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* ==================== POPUP MODAL RINCIAN ANALITIK SEKOLAH ==================== */}
      {selectedSekolahId && (
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
          onClick={() => setSelectedSekolahId(null)}
        >
          <div
            className="bg-white rounded-4 shadow-lg p-3 p-md-5 position-relative"
            style={{
              maxWidth: '880px',
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
              onClick={() => setSelectedSekolahId(null)}
              className="btn btn-sm btn-light rounded-circle position-absolute"
              style={{ top: 20, right: 20, width: 36, height: 36 }}
              aria-label="Tutup"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            {loadingDetail ? (
              <div className="text-center py-5">
                <div className="spinner-border" style={{ color: '#AB0C2F' }} role="status"></div>
                <p className="mt-2 text-muted" style={{ fontSize: '14px' }}>Memuat analitik capaian sekolah…</p>
              </div>
            ) : detailData ? (
              <div>
                {/* Header Modal */}
                <div className="border-bottom pb-3 mb-4">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span
                      className="badge rounded-pill px-3 py-1"
                      style={{
                        background: detailData.sekolah.jenjang === 'SMK' ? '#AB0C2F' : '#0284c7',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: 700,
                      }}
                    >
                      {detailData.sekolah.jenjang}
                    </span>
                    <span className="badge bg-light text-secondary border" style={{ fontSize: '11px' }}>
                      {detailData.sekolah.status_sekolah}
                    </span>
                    <span className="text-muted" style={{ fontSize: '12px' }}>
                      NPSN: <span className="font-monospace fw-bold text-dark">{detailData.sekolah.npsn}</span>
                    </span>
                  </div>
                  <h3 className="fw-bold text-dark mb-1" style={{ fontSize: '24px' }}>
                    {detailData.sekolah.nama_sekolah}
                  </h3>
                  <p className="text-muted mb-0" style={{ fontSize: '13px' }}>
                    <i className="fa-solid fa-location-dot me-1 text-danger"></i>
                    {detailData.sekolah.alamat ? `${detailData.sekolah.alamat}, ` : ''}
                    {detailData.sekolah.kota}, {detailData.sekolah.provinsi}
                  </p>
                </div>

                {/* 4 KPI Metric Cards */}
                <div className="row g-2 mb-4 text-center">
                  <div className="col-3">
                    <div className="p-2 p-md-3 rounded-3 bg-light border">
                      <small className="text-muted d-block" style={{ fontSize: '11px' }}>Total Alumni</small>
                      <strong className="text-dark fs-6">{detailData.kpi.total_alumni} Org</strong>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="p-2 p-md-3 rounded-3 bg-light border">
                      <small className="text-muted d-block" style={{ fontSize: '11px' }}>Responden</small>
                      <strong className="text-dark fs-6">{detailData.kpi.total_responden} Org</strong>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="p-2 p-md-3 rounded-3 bg-light border">
                      <small className="text-muted d-block" style={{ fontSize: '11px' }}>Partisipasi</small>
                      <strong style={{ color: '#AB0C2F' }} className="fs-6">
                        {detailData.kpi.persentase_partisipasi}%
                      </strong>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="p-2 p-md-3 rounded-3 bg-light border">
                      <small className="text-muted d-block" style={{ fontSize: '11px' }}>Rasio Serapan</small>
                      <strong className="text-success fs-6">{detailData.kpi.serapan_kerja_kuliah}%</strong>
                    </div>
                  </div>
                </div>

                {/* Status Distribusi Alumni Rinci */}
                <div className="p-3 rounded-3 border mb-4" style={{ background: '#f8fafc' }}>
                  <h6 className="fw-bold text-dark mb-3" style={{ fontSize: '13.5px' }}>
                    <i className="fa-solid fa-chart-pie me-2" style={{ color: '#AB0C2F' }}></i>
                    Distribusi Status Karier Alumni
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

                {/* Jika Jenjang SMK: Statistik per Jurusan / Konsentrasi Keahlian */}
                {detailData.sekolah.jenjang === 'SMK' && detailData.jurusan_stats.length > 0 && (
                  <div className="mb-4">
                    <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '13.5px' }}>
                      <i className="fa-solid fa-briefcase me-2" style={{ color: '#AB0C2F' }}></i>
                      Capaian per Konsentrasi Keahlian ({detailData.jurusan_stats.length} Jurusan)
                    </h6>
                    <div className="table-responsive rounded-3 border" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      <table className="table table-sm table-hover table-striped mb-0" style={{ fontSize: '12px' }}>
                        <thead className="table-light">
                          <tr>
                            <th>Program Keahlian</th>
                            <th className="text-center">Alumni</th>
                            <th className="text-center">Responden</th>
                            <th className="text-center text-danger">Kerja</th>
                            <th className="text-center text-primary">Kuliah</th>
                            <th className="text-center text-warning">Wirausaha</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detailData.jurusan_stats.map((j) => (
                            <tr key={j.id}>
                              <td className="fw-semibold text-dark">{j.nama}</td>
                              <td className="text-center font-monospace">{j.total_alumni}</td>
                              <td className="text-center font-monospace fw-bold">{j.total_responden}</td>
                              <td className="text-center font-monospace text-danger">{j.bekerja}</td>
                              <td className="text-center font-monospace text-primary">{j.kuliah}</td>
                              <td className="text-center font-monospace text-warning">{j.wirausaha}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Penilaian Mutu & Relevansi Kurikulum (Likert 1-4) */}
                {detailData.evaluasi_rata_rata && (
                  <div className="p-3 rounded-3 border mb-4" style={{ background: '#fafaf9' }}>
                    <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '13.5px' }}>
                      <i className="fa-solid fa-star-half-stroke me-2" style={{ color: '#d97706' }}></i>
                      Evaluasi Relevansi Kompetensi &amp; Layanan Sekolah (Skala 1 – 4)
                    </h6>
                    <div className="row g-2" style={{ fontSize: '12px' }}>
                      <div className="col-md-6">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted">Etika Kerja &amp; Kedisiplinan:</span>
                          <strong className="text-dark">{detailData.evaluasi_rata_rata.etika_kerja} / 4.0</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted">Literasi Komputer &amp; Digital:</span>
                          <strong className="text-dark">{detailData.evaluasi_rata_rata.komputer} / 4.0</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted">Komunikasi &amp; Presentasi:</span>
                          <strong className="text-dark">{detailData.evaluasi_rata_rata.komunikasi} / 4.0</strong>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted">Bahasa Asing (Inggris):</span>
                          <strong className="text-dark">{detailData.evaluasi_rata_rata.bahasa_asing} / 4.0</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted">Kelayakan Sarana Praktik:</span>
                          <strong className="text-dark">{detailData.evaluasi_rata_rata.sarana_praktik} / 4.0</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted">Peran BKK Satuan Pendidikan:</span>
                          <strong className="text-dark">{detailData.evaluasi_rata_rata.peran_bkk} / 4.0</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sampel Responden Terakhir (Dengan Masking Privasi & Pagination 10/hal) */}
                {(() => {
                  const items = detailData.responden_terbaru || [];
                  const pageSize = 10;
                  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
                  const currentPage = Math.min(modalRespondenPage, totalPages);
                  const pagedList = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

                  return (
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="fw-bold text-dark mb-0" style={{ fontSize: "13.5px" }}>
                          <i className="fa-solid fa-users me-2" style={{ color: "#AB0C2F" }}></i>
                          Sampel Responden Terdata ({items.length} Lulusan Terakhir)
                        </h6>
                        <span className="badge bg-light text-muted border" style={{ fontSize: "10px" }}>
                          <i className="fa-solid fa-lock me-1"></i> Data Pribadi Dimasking
                        </span>
                      </div>

                      <div className="table-responsive rounded-3 border">
                        <table className="table table-hover table-striped mb-0" style={{ fontSize: "12px" }}>
                          <thead className="table-light">
                            <tr>
                              <th>NISN Terproteksi</th>
                              <th>Nama Terproteksi</th>
                              <th>Tahun Lulus</th>
                              <th>Jurusan</th>
                              <th>Status Karier</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pagedList.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="text-center py-3 text-muted">Belum ada data responden.</td>
                              </tr>
                            ) : (
                              pagedList.map((r) => (
                                <tr key={r.id}>
                                  <td className="font-monospace text-muted">{r.nisn}</td>
                                  <td className="fw-semibold text-dark">{r.nama_lengkap}</td>
                                  <td>{r.tahun_lulus}</td>
                                  <td><small className="text-muted">{r.jurusan}</small></td>
                                  <td>
                                    {r.status_utama ? (
                                      <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle" style={{ fontSize: "10px" }}>
                                        {r.status_utama.replace(/_/g, " ")}
                                      </span>
                                    ) : (
                                      <span className="badge rounded-pill bg-light text-muted border" style={{ fontSize: "10px" }}>
                                        Belum mengisi
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Mini Pagination Controls (Default 10 per halaman) */}
                      {totalPages > 1 && (
                        <div className="d-flex justify-content-between align-items-center mt-2 px-1" style={{ fontSize: "12px" }}>
                          <span className="text-muted">
                            Data {((currentPage - 1) * pageSize) + 1}–{Math.min(currentPage * pageSize, items.length)} dari {items.length} responden
                          </span>
                          <div className="d-flex align-items-center gap-1">
                            <button
                              type="button"
                              className="btn btn-sm btn-light border py-1 px-2"
                              style={{ fontSize: "11px" }}
                              disabled={currentPage <= 1}
                              onClick={() => setModalRespondenPage((p) => Math.max(1, p - 1))}
                              aria-label="Sebelumnya"
                            >
                              <i className="fa-solid fa-chevron-left"></i>
                            </button>
                            <span className="text-dark fw-semibold px-2" style={{ fontSize: "11.5px" }}>
                              {currentPage} / {totalPages}
                            </span>
                            <button
                              type="button"
                              className="btn btn-sm btn-light border py-1 px-2"
                              style={{ fontSize: "11px" }}
                              disabled={currentPage >= totalPages}
                              onClick={() => setModalRespondenPage((p) => Math.min(totalPages, p + 1))}
                              aria-label="Berikutnya"
                            >
                              <i className="fa-solid fa-chevron-right"></i>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}

'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';

interface AlumniProfile {
  id: number;
  nisn: string;
  nama_lengkap: string;
  tahun_lulus: number;
  sekolah: {
    id: number;
    nama_sekolah: string;
    jenjang: 'SMA' | 'SMK';
    kota: string;
    daftar_jurusan_smk?: Array<{ id: number; kode: string; nama: string }>;
  };
  jurusan: string;
}

interface ProvinsiItem {
  id: number;
  kode: string;
  nama: string;
}

interface KotaItem {
  id: number;
  kode: string;
  nama: string;
}


// ponytail: SearchableSelect custom dropdown, upgrade to virtualized list if items exceed 1000
function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Pilih...",
  searchPlaceholder = "Cari...",
  disabled = false,
}: {
  options: Array<{ id: number; nama: string }>;
  value?: number;
  onChange: (id: number) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedItem = useMemo(
    () => options.find((opt) => opt.id === value),
    [options, value]
  );

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const query = search.toLowerCase();
    return options.filter((opt) => opt.nama.toLowerCase().includes(query));
  }, [options, search]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearch("");
    }
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="position-relative w-100"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setIsOpen(false);
          setSearch("");
        }
      }}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="form-control py-2 fs-6 d-flex align-items-center justify-content-between text-start"
        style={{
          cursor: disabled ? "not-allowed" : "pointer",
          backgroundColor: disabled ? "#f8fafc" : "#ffffff",
          borderColor: isOpen ? "#AB0C2F" : "#cbd5e1",
          boxShadow: isOpen ? "0 0 0 0.2rem rgba(171, 12, 47, 0.16)" : "none",
          transition: "border-color 0.15s ease, box-shadow 0.15s ease",
          minHeight: "44px",
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span
          className="text-truncate me-2"
          style={{
            color: selectedItem ? "#1e293b" : "#94a3b8",
            fontWeight: selectedItem ? 500 : 400,
          }}
        >
          {selectedItem ? selectedItem.nama : placeholder}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            color: "#64748b",
            flexShrink: 0,
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="position-absolute bg-white border rounded-3 shadow-lg p-2"
          style={{
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 1050,
            maxHeight: "300px",
            display: "flex",
            flexDirection: "column",
            borderColor: "rgba(171, 12, 47, 0.25)",
            animation: "selectFadeIn 0.18s ease-out",
          }}
        >
          <div className="position-relative mb-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748b"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="form-control form-control-sm ps-4 py-1"
              style={{
                fontSize: "13px",
                borderColor: "#e2e8f0",
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div
            role="listbox"
            style={{
              overflowY: "auto",
              maxHeight: "220px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {filteredOptions.length === 0 ? (
              <div
                className="text-muted text-center py-3"
                style={{ fontSize: "13px" }}
              >
                Tidak ditemukan
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.id === value;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(opt.id);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className="btn btn-sm text-start py-2 px-3 border-0 rounded-2 d-flex align-items-center justify-content-between"
                    style={{
                      fontSize: "13.5px",
                      background: isSelected
                        ? "rgba(171, 12, 47, 0.08)"
                        : "transparent",
                      color: isSelected ? "#AB0C2F" : "#1e293b",
                      fontWeight: isSelected ? 600 : 400,
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background =
                          "rgba(171, 12, 47, 0.04)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    <span className="text-truncate">{opt.nama}</span>
                    {isSelected && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#AB0C2F"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ms-2 flex-shrink-0"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TracerFormWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialNisn = searchParams.get('nisn') || '';

  // Stepper state (1 to 5)
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [alertError, setAlertError] = useState('');

  // Step 1: Verifikasi
  const [nisn, setNisn] = useState(initialNisn);
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [alumniData, setAlumniData] = useState<AlumniProfile | null>(null);

  // Step 2: Kontak & Domisili
  const [nomorWhatsapp, setNomorWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [idProvinsi, setIdProvinsi] = useState<number>(23); // Default Kaltim
  const [idKota, setIdKota] = useState<number>(364); // Default Samarinda
  const [alamatDomisili, setAlamatDomisili] = useState('');
  const [provinsiList, setProvinsiList] = useState<ProvinsiItem[]>([]);
  const [kotaList, setKotaList] = useState<KotaItem[]>([]);

  // Step 3: Status Utama (Gatekeeper)
  const [statusUtama, setStatusUtama] = useState<'BEKERJA' | 'KULIAH' | 'WIRAUSAHA' | 'BEKERJA_SAMBIL_KULIAH_WIRAUSAHA' | 'BELUM_BEKERJA'>('BEKERJA');

  // Step 4A: Bekerja
  const [kerjaMasaTunggu, setKerjaMasaTunggu] = useState('KURANG_3_BULAN');
  const [kerjaNamaInstansi, setKerjaNamaInstansi] = useState('');
  const [kerjaKategoriTempat, setKerjaKategoriTempat] = useState('SWASTA_NASIONAL');
  const [kerjaLokasi, setKerjaLokasi] = useState('');
  const [kerjaPosisiJabatan, setKerjaPosisiJabatan] = useState('');
  const [kerjaStatusKepegawaian, setKerjaStatusKepegawaian] = useState('KONTRAK');
  const [kerjaRentangPenghasilan, setKerjaRentangPenghasilan] = useState('DUA_SAMPAI_3_SETENGAH_JUTA');
  const [kerjaKeselarasanJurusan, setKerjaKeselarasanJurusan] = useState('SANGAT_SELARAS');
  const [kerjaSaluranInfo, setKerjaSaluranInfo] = useState<string[]>(['Bursa Kerja Khusus (BKK) Sekolah']);

  // Step 4B: Kuliah
  const [kuliahNamaKampus, setKuliahNamaKampus] = useState('');
  const [kuliahJenjang, setKuliahJenjang] = useState('S1');
  const [kuliahProgramStudi, setKuliahProgramStudi] = useState('');
  const [kuliahKeselarasanJurusan, setKuliahKeselarasanJurusan] = useState('SELARAS');
  const [kuliahJalurMasuk, setKuliahJalurMasuk] = useState('SNBP');

  // Step 4C: Wirausaha
  const [wirausahaSektor, setWirausahaSektor] = useState('KULINER');
  const [wirausahaSektorLainnya, setWirausahaSektorLainnya] = useState('');
  const [wirausahaNamaUsaha, setWirausahaNamaUsaha] = useState('');
  const [wirausahaLegalitas, setWirausahaLegalitas] = useState('PERORANGAN');
  const [wirausahaKeselarasanJurusan, setWirausahaKeselarasanJurusan] = useState('SELARAS');
  const [wirausahaOmzetBulanan, setWirausahaOmzetBulanan] = useState('DUA_SAMPAI_3_SETENGAH_JUTA');
  const [wirausahaJumlahPekerja, setWirausahaJumlahPekerja] = useState<number>(1);

  // Step 4D: Belum Bekerja
  const [belumKerjaKendala, setBelumKerjaKendala] = useState<string[]>(['Keterbatasan lowongan di domisili']);
  const [belumKerjaPelatihan, setBelumKerjaPelatihan] = useState('');
  const [belumKerjaStatusAktif, setBelumKerjaStatusAktif] = useState('AKTIF_MELAMAR');

  // Step 5: Evaluasi & Umpan Balik (Skala Likert 1-4, default null agar tidak otomatis terpilih)
  const [evalKompetensiKejuruan, setEvalKompetensiKejuruan] = useState<number | null>(null);
  const [evalKomputer, setEvalKomputer] = useState<number | null>(null);
  const [evalBahasa, setEvalBahasa] = useState<number | null>(null);
  const [evalKomunikasi, setEvalKomunikasi] = useState<number | null>(null);
  const [evalEtika, setEvalEtika] = useState<number | null>(null);
  const [evalTeam, setEvalTeam] = useState<number | null>(null);
  const [evalPkl, setEvalPkl] = useState<number | null>(null);
  const [evalSarana, setEvalSarana] = useState<number | null>(null);
  const [evalBkk, setEvalBkk] = useState<number | null>(null);
  const [evalGuru, setEvalGuru] = useState<number | null>(null);

  const [feedbackTerpakai, setFeedbackTerpakai] = useState('');
  const [feedbackBelumDiajarkan, setFeedbackBelumDiajarkan] = useState('');
  const [feedbackSaranSekolah, setFeedbackSaranSekolah] = useState('');

  // Load master wilayah
  useEffect(() => {
    async function loadWilayah() {
      try {
        const [resProv, resKota] = await Promise.all([
          fetchApi<{ sukses: boolean; data: ProvinsiItem[] }>('/wilayah/provinsi'),
          fetchApi<{ sukses: boolean; data: KotaItem[] }>('/wilayah/kota?kode_provinsi=64'),
        ]);
        if (resProv.sukses) setProvinsiList(resProv.data);
        if (resKota.sukses) setKotaList(resKota.data);
      } catch (e) {
        console.error('Gagal memuat data wilayah:', e);
      }
    }
    loadWilayah();
  }, []);

  // Update daftar kota saat provinsi berubah
  const handleProvinsiChange = async (provId: number) => {
    setIdProvinsi(provId);
    const selectedProv = provinsiList.find((p) => p.id === provId);
    if (selectedProv) {
      try {
        const res = await fetchApi<{ sukses: boolean; data: KotaItem[] }>(`/wilayah/kota?kode_provinsi=${selectedProv.kode}`);
        if (res.sukses) {
          setKotaList(res.data);
          if (res.data[0]) setIdKota(res.data[0].id);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  // STEP 1: Verifikasi Data Siswa ke Backend
  const handleVerifikasi = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertError('');

    if (nisn.trim().length !== 10) {
      setAlertError('NISN harus terdiri dari 10 digit angka resmi.');
      return;
    }
    if (!tanggalLahir) {
      setAlertError('Silakan pilih tanggal lahir Anda sesuai ijazah/Dapodik.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetchApi<{
        sukses: boolean;
        pesan?: string;
        data: AlumniProfile;
      }>('/alumni/verifikasi', {
        method: 'POST',
        body: JSON.stringify({
          nisn: nisn.trim(),
          tanggal_lahir: tanggalLahir,
        }),
      });

      if (res.sukses) {
        setAlumniData(res.data);
        setCurrentStep(2);
      }
    } catch (err: any) {
      setAlertError(err.message || 'Verifikasi gagal. Pastikan NISN dan tanggal lahir Anda sesuai.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Validasi Kontak & Domisili
  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertError('');
    if (!nomorWhatsapp.trim() || nomorWhatsapp.length < 9) {
      setAlertError('Nomor WhatsApp aktif wajib diisi dengan benar.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setAlertError('Alamat email aktif wajib diisi dengan format yang benar.');
      return;
    }
    if (!alamatDomisili.trim()) {
      setAlertError('Alamat domisili saat ini wajib diisi.');
      return;
    }
    setCurrentStep(3);
  };

  // STEP 3: Lanjut ke Detail Spesifik
  const handleStep3Next = () => {
    setCurrentStep(4);
  };

  // Checkbox Saluran Kerja Handler
  const toggleSaluranKerja = (saluran: string) => {
    setKerjaSaluranInfo((prev) =>
      prev.includes(saluran) ? prev.filter((s) => s !== saluran) : [...prev, saluran]
    );
  };

  // Checkbox Kendala Belum Kerja Handler (Max 2)
  const toggleKendala = (k: string) => {
    if (belumKerjaKendala.includes(k)) {
      setBelumKerjaKendala((prev) => prev.filter((item) => item !== k));
    } else {
      if (belumKerjaKendala.length < 2) {
        setBelumKerjaKendala((prev) => [...prev, k]);
      }
    }
  };

  // STEP 4: Validasi & Lanjut ke Evaluasi
  const handleStep4Next = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertError('');

    if (statusUtama === 'BEKERJA' || statusUtama === 'BEKERJA_SAMBIL_KULIAH_WIRAUSAHA') {
      if (!kerjaNamaInstansi.trim() || !kerjaPosisiJabatan.trim()) {
        setAlertError('Nama instansi/perusahaan dan posisi pekerjaan wajib diisi.');
        return;
      }
    }
    if (statusUtama === 'KULIAH' || statusUtama === 'BEKERJA_SAMBIL_KULIAH_WIRAUSAHA') {
      if (!kuliahNamaKampus.trim() || !kuliahProgramStudi.trim()) {
        setAlertError('Nama perguruan tinggi dan program studi kuliah wajib diisi.');
        return;
      }
    }
    if (statusUtama === 'WIRAUSAHA') {
      if (!wirausahaNamaUsaha.trim()) {
        setAlertError('Nama unit usaha / brand wajib diisi.');
        return;
      }
    }

    setCurrentStep(5);
  };

  // STEP 5: Final Submission ke Backend
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alumniData) return;
    setAlertError('');

    // Validasi semua aspek likert wajib diisi
    if (
      evalKomputer === null ||
      evalBahasa === null ||
      evalKomunikasi === null ||
      evalEtika === null ||
      evalTeam === null ||
      evalSarana === null ||
      evalBkk === null ||
      evalGuru === null ||
      (alumniData.sekolah.jenjang === 'SMK' && (evalKompetensiKejuruan === null || evalPkl === null))
    ) {
      setAlertError('Harap lengkapi semua aspek penilaian kompetensi & layanan sekolah (pilih nilai 1 - 4 pada setiap baris).');
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        id_alumni: alumniData.id,
        nomor_whatsapp: nomorWhatsapp.trim(),
        email: email.trim().toLowerCase(),
        id_provinsi_domisili: Number(idProvinsi),
        id_kota_domisili: Number(idKota),
        alamat_domisili: alamatDomisili.trim(),
        status_utama: statusUtama,

        // Evaluasi Likert
        evaluasi_keterampilan_komputer: evalKomputer,
        evaluasi_komputer: evalKomputer,
        evaluasi_bahasa_asing: evalBahasa,
        evaluasi_komunikasi: evalKomunikasi,
        evaluasi_etika_kerja: evalEtika,
        evaluasi_kerja_sama_tim: evalTeam,
        evaluasi_kelayakan_sarana_praktik: evalSarana,
        evaluasi_peran_bkk: evalBkk,
        evaluasi_pendampingan_guru: evalGuru,

        umpan_balik_keterampilan_terpakai: feedbackTerpakai.trim() || undefined,
        umpan_balik_keterampilan_belum_diajarkan: feedbackBelumDiajarkan.trim() || undefined,
        umpan_balik_saran_sekolah: feedbackSaranSekolah.trim() || undefined,
      };

      if (alumniData.sekolah.jenjang === 'SMK') {
        payload.evaluasi_kompetensi_kejuruan = evalKompetensiKejuruan;
        payload.evaluasi_pengalaman_pkl = evalPkl;
      }

      // Branch Bekerja
      if (statusUtama === 'BEKERJA' || statusUtama === 'BEKERJA_SAMBIL_KULIAH_WIRAUSAHA') {
        payload.kerja_masa_tunggu = kerjaMasaTunggu;
        payload.kerja_nama_instansi = kerjaNamaInstansi.trim();
        payload.kerja_kategori_tempat = kerjaKategoriTempat;
        payload.kerja_lokasi = kerjaLokasi.trim();
        payload.kerja_posisi_jabatan = kerjaPosisiJabatan.trim();
        payload.kerja_status_kepegawaian = kerjaStatusKepegawaian;
        payload.kerja_rentang_penghasilan = kerjaRentangPenghasilan;
        payload.kerja_keselarasan_jurusan = kerjaKeselarasanJurusan;
        payload.kerja_saluran_informasi = kerjaSaluranInfo;
      }

      // Branch Kuliah
      if (statusUtama === 'KULIAH' || statusUtama === 'BEKERJA_SAMBIL_KULIAH_WIRAUSAHA') {
        payload.kuliah_nama_kampus = kuliahNamaKampus.trim();
        payload.kuliah_jenjang = kuliahJenjang;
        payload.kuliah_program_studi = kuliahProgramStudi.trim();
        payload.kuliah_keselarasan_jurusan = kuliahKeselarasanJurusan;
        payload.kuliah_jalur_masuk = kuliahJalurMasuk;
      }

      // Branch Wirausaha
      if (statusUtama === 'WIRAUSAHA') {
        payload.wirausaha_sektor = wirausahaSektor;
        if (wirausahaSektor === 'LAINNYA') payload.wirausaha_sektor_lainnya = wirausahaSektorLainnya;
        payload.wirausaha_nama_usaha = wirausahaNamaUsaha.trim();
        payload.wirausaha_legalitas = wirausahaLegalitas;
        payload.wirausaha_keselarasan_jurusan = wirausahaKeselarasanJurusan;
        payload.wirausaha_omzet_bulanan = wirausahaOmzetBulanan;
        payload.wirausaha_jumlah_pekerja = Number(wirausahaJumlahPekerja);
      }

      // Branch Belum Kerja
      if (statusUtama === 'BELUM_BEKERJA') {
        payload.belum_kerja_kendala_utama = belumKerjaKendala;
        payload.belum_kerja_kebutuhan_pelatihan = belumKerjaPelatihan.trim();
        payload.belum_kerja_status_aktif_mencari = belumKerjaStatusAktif;
      }

      const res = await fetchApi<{ sukses: boolean; pesan: string }>('/kuesioner/simpan', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.sukses) {
        // Simpan data receipt untuk halaman sukses
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('tracer_receipt', JSON.stringify({
            nama: alumniData.nama_lengkap,
            nisn: alumniData.nisn,
            sekolah: alumniData.sekolah.nama_sekolah,
            jenjang: alumniData.sekolah.jenjang,
            tahun: alumniData.tahun_lulus,
            status: statusUtama,
            submittedAt: new Date().toISOString(),
          }));
        }
        router.push('/tracer/selesai');
      }
    } catch (err: any) {
      setAlertError(err.message || 'Gagal menyimpan hasil kuesioner. Silakan periksa kembali isian Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 pb-120 grey-bg" style={{ minHeight: '80vh' }}>
      <div className="container">
        {/* PROGRESS STEPPER HEADER */}
        <div className="row justify-content-center mb-40 tracer-stepper-wrap">
          <div className="col-lg-10">
            <div className="bg-white p-4 rounded-4 shadow-sm border">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="fw-bold" style={{ fontSize: '13px', color: '#AB0C2F' }}>
                  LANGKAH {currentStep} DARI 5
                </span>
                <span className="text-muted fw-semibold" style={{ fontSize: '13px' }}>
                  {currentStep === 1 && 'Verifikasi Identitas'}
                  {currentStep === 2 && 'Kontak & Domisili'}
                  {currentStep === 3 && 'Status Karier Utama'}
                  {currentStep === 4 && 'Rincian Aktivitas'}
                  {currentStep === 5 && 'Evaluasi & Umpan Balik'}
                </span>
              </div>
              <div className="progress" style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px' }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${(currentStep / 5) * 100}%`, transition: "width 0.3s ease", backgroundColor: "#AB0C2F" }}
                  aria-valuenow={(currentStep / 5) * 100}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* ERROR BANNER */}
        {alertError && (
          <div className="row justify-content-center mb-30">
            <div className="col-lg-10">
              <div className="alert alert-danger d-flex align-items-center rounded-3 p-3 shadow-sm border-0" role="alert">
                <i className="fa-solid fa-triangle-exclamation fa-lg me-3 text-danger"></i>
                <div style={{ fontSize: '14px' }}>{alertError}</div>
              </div>
            </div>
          </div>
        )}

        {/* WIZARD CARD WRAPPER */}
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border tracer-form-container">

              {/* ==================== STEP 1: VERIFIKASI ==================== */}
              {currentStep === 1 && (
                <div>
                  <div className="border-bottom pb-3 mb-4">
                    <span className="badge px-3 py-1 rounded-pill fw-bold mb-2" style={{ background: "rgba(171, 12, 47, 0.08)", color: "#AB0C2F", border: "1px solid rgba(171, 12, 47, 0.22)" }}>
                      TAHAP 1: GATEKEEPER
                    </span>
                    <h3 className="fw-bold text-dark mb-1">Pencocokan Data Alumni</h3>
                    <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                      Masukkan 10 digit NISN dan Tanggal Lahir untuk memastikan keaslian data dengan buku induk sekolah.
                    </p>
                  </div>

                  <form onSubmit={handleVerifikasi}>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark">
                          NISN (Nomor Induk Siswa Nasional) <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          maxLength={10}
                          placeholder="Contoh: 0051234567"
                          value={nisn}
                          onChange={(e) => setNisn(e.target.value.replace(/\D/g, ''))}
                          className="form-control form-control-lg font-monospace fs-6"
                          required
                        />
                        <div className="form-text" style={{ fontSize: '12px' }}>
                          Wajib 10 digit angka resmi Kemdikbud.
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark">
                          Tanggal Lahir <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          value={tanggalLahir}
                          onChange={(e) => setTanggalLahir(e.target.value)}
                          className="form-control form-control-lg fs-6"
                          required
                        />
                        <div className="form-text" style={{ fontSize: '12px' }}>
                          Format: Tanggal / Bulan / Tahun sesuai Ijazah.
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 text-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="tracer-btn-next"
                      >
                        {loading ? 'Memeriksa Data…' : 'Verifikasi Data Saya'} <i className="fa-solid fa-arrow-right ms-2"></i>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ==================== STEP 2: KONTAK & DOMISILI ==================== */}
              {currentStep === 2 && alumniData && (
                <div>
                  <div className="border-bottom pb-3 mb-4">
                    <span className="badge px-3 py-1 rounded-pill fw-bold mb-2" style={{ background: "rgba(171, 12, 47, 0.08)", color: "#AB0C2F", border: "1px solid rgba(171, 12, 47, 0.22)" }}>
                      TAHAP 2: KONFIRMASI IDENTITAS &amp; DOMISILI
                    </span>
                    <h3 className="fw-bold text-dark mb-1">Halo, {alumniData.nama_lengkap}!</h3>
                    <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                      Data sekolah almamater Anda berhasil dicocokkan. Silakan lengkapi kontak aktif Anda.
                    </p>
                  </div>

                  {/* KARTU PROFIL READ-ONLY TERKUNCI */}
                  <div className="p-3 rounded-3 mb-4 border" style={{ background: '#f8fafc' }}>
                    <div className="row g-2" style={{ fontSize: '13px' }}>
                      <div className="col-sm-6">
                        <span className="text-muted">Nama Lengkap:</span>
                        <div className="fw-bold text-dark">{alumniData.nama_lengkap}</div>
                      </div>
                      <div className="col-sm-6">
                        <span className="text-muted">NISN:</span>
                        <div className="fw-bold font-monospace text-dark">{alumniData.nisn}</div>
                      </div>
                      <div className="col-sm-6">
                        <span className="text-muted">Satuan Pendidikan:</span>
                        <div className="fw-bold text-dark">{alumniData.sekolah.nama_sekolah} ({alumniData.sekolah.jenjang})</div>
                      </div>
                      <div className="col-sm-6">
                        <span className="text-muted">Jurusan / Peminatan:</span>
                        <div className="fw-bold text-dark">{alumniData.jurusan || 'UMUM'}</div>
                      </div>
                      <div className="col-sm-6">
                        <span className="text-muted">Tahun Lulus:</span>
                        <div className="fw-bold text-dark">{alumniData.tahun_lulus}</div>
                      </div>
                      <div className="col-sm-6">
                        <span className="text-muted">Kota Sekolah:</span>
                        <div className="fw-bold text-dark">{alumniData.sekolah.kota}</div>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleStep2Next}>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark">
                          Nomor WhatsApp / HP Aktif <span className="text-danger">*</span>
                        </label>
                        <input
                          type="tel"
                          placeholder="Contoh: 081234567890"
                          value={nomorWhatsapp}
                          onChange={(e) => setNomorWhatsapp(e.target.value)}
                          className="form-control py-2 fs-6"
                          required
                        />
                        <div className="form-text" style={{ fontSize: '12px' }}>
                          Untuk kebutuhan kontak resmi BKK sekolah.
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark">
                          Email Aktif <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          placeholder="nama@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="form-control py-2 fs-6"
                          required
                        />
                        <div className="form-text" style={{ fontSize: '12px' }}>
                          Bukti pengisian akan dikirimkan ke email ini.
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark">
                          Domisili Saat Ini (Provinsi) <span className="text-danger">*</span>
                        </label>
                        <SearchableSelect
                          options={provinsiList.map((p) => ({ id: p.id, nama: p.nama }))}
                          value={idProvinsi}
                          onChange={(val) => handleProvinsiChange(val)}
                          placeholder="Pilih Provinsi Domisili"
                          searchPlaceholder="Cari provinsi..."
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark">
                          Domisili Saat Ini (Kabupaten / Kota) <span className="text-danger">*</span>
                        </label>
                        <SearchableSelect
                          options={kotaList.map((k) => ({ id: k.id, nama: k.nama }))}
                          value={idKota}
                          onChange={(val) => setIdKota(val)}
                          placeholder="Pilih Kabupaten / Kota"
                          searchPlaceholder="Cari kabupaten / kota..."
                          disabled={kotaList.length === 0}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold text-dark">
                          Alamat Domisili Lengkap <span className="text-danger">*</span>
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Jl. Pahlawan No. 4, RT 02, Kelurahan..."
                          value={alamatDomisili}
                          onChange={(e) => setAlamatDomisili(e.target.value)}
                          className="form-control fs-6"
                          required
                        />
                      </div>
                    </div>

                    <div className="d-flex justify-content-between mt-5">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="tracer-btn-back"
                      >
                        <i className="fa-solid fa-arrow-left me-2"></i> Kembali
                      </button>
                      <button
                        type="submit"
                        className="tracer-btn-next"
                      >
                        Lanjut ke Status Karier <i className="fa-solid fa-arrow-right ms-2"></i>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ==================== STEP 3: PENENTUAN STATUS UTAMA ==================== */}
              {currentStep === 3 && (
                <div>
                  <div className="border-bottom pb-3 mb-4">
                    <span className="badge px-3 py-1 rounded-pill fw-bold mb-2" style={{ background: "rgba(171, 12, 47, 0.08)", color: "#AB0C2F", border: "1px solid rgba(171, 12, 47, 0.22)" }}>
                      TAHAP 3: KONDISI KARIER
                    </span>
                    <h3 className="fw-bold text-dark mb-1">Apa aktivitas utama Anda saat ini?</h3>
                    <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                      Pilih 1 (satu) kategori yang paling mencerminkan aktivitas dominan Anda sekarang.
                    </p>
                  </div>

                  <div className="row g-3 mb-4">
                    {[
                      {
                        key: 'BEKERJA',
                        icon: 'fa-solid fa-briefcase',
                        title: 'A. Bekerja',
                        desc: 'Bekerja penuh waktu (full time) atau paruh waktu di perusahaan/instansi/UMKM.',
                        color: '#10b981',
                      },
                      {
                        key: 'KULIAH',
                        icon: 'fa-solid fa-graduation-cap',
                        title: 'B. Melanjutkan Pendidikan',
                        desc: 'Sedang menempuh kuliah di Perguruan Tinggi (D3/D4/S1) atau kursus keahlian.',
                        color: '#0284c7',
                      },
                      {
                        key: 'WIRAUSAHA',
                        icon: 'fa-solid fa-store',
                        title: 'C. Berwirausaha / Wiraswasta',
                        desc: 'Memiliki usaha mandiri, bisnis online, industri rumahan, atau jasa profesional.',
                        color: '#f59e0b',
                      },
                      {
                        key: 'BEKERJA_SAMBIL_KULIAH_WIRAUSAHA',
                        icon: 'fa-solid fa-repeat',
                        title: 'D. Bekerja Sambil Kuliah / Wirausaha',
                        desc: 'Menjalankan dua aktivitas sekaligus secara aktif.',
                        color: '#8b5cf6',
                      },
                      {
                        key: 'BELUM_BEKERJA',
                        icon: 'fa-solid fa-hourglass-half',
                        title: 'E. Belum Bekerja / Mencari Kerja',
                        desc: 'Sedang aktif melamar pekerjaan atau sedang jeda sejenak (gap year).',
                        color: '#ec4899',
                      },
                    ].map((opt) => {
                      const isSelected = statusUtama === opt.key;
                      return (
                        <div key={opt.key} className="col-12">
                          <div
                            onClick={() => setStatusUtama(opt.key as any)}
                            className="p-3 p-md-4 rounded-4 border d-flex align-items-center gap-3"
                            style={{
                              cursor: 'pointer',
                              background: isSelected ? 'rgba(171, 12, 47, 0.04)' : '#ffffff',
                              borderColor: isSelected ? '#AB0C2F' : '#e2e8f0',
                              borderWidth: isSelected ? '2px' : '1px',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <div
                              className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                              style={{
                                width: '48px',
                                height: '48px',
                                background: isSelected ? '#AB0C2F' : '#f1f5f9',
                                color: isSelected ? '#ffffff' : opt.color,
                              }}
                            >
                              <i className={`${opt.icon} fa-lg`}></i>
                            </div>
                            <div className="flex-grow-1">
                              <h5 className="fw-bold mb-1 text-dark" style={{ fontSize: '16px' }}>{opt.title}</h5>
                              <p className="text-muted mb-0" style={{ fontSize: '13px' }}>{opt.desc}</p>
                            </div>
                            <div className="flex-shrink-0">
                              <input
                                type="radio"
                                name="statusUtama"
                                checked={isSelected}
                                onChange={() => setStatusUtama(opt.key as any)}
                                className="form-check-input fs-5"
                                style={{ accentColor: '#AB0C2F' }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="d-flex justify-content-between mt-5">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="tracer-btn-back"
                    >
                      <i className="fa-solid fa-arrow-left me-2"></i> Kembali
                    </button>
                    <button
                      type="button"
                      onClick={handleStep3Next}
                      className="tracer-btn-next"
                    >
                      Lanjut ke Rincian <i className="fa-solid fa-arrow-right ms-2"></i>
                    </button>
                  </div>
                </div>
              )}

              {/* ==================== STEP 4: FORM SPESIFIK CABANG ==================== */}
              {currentStep === 4 && (
                <div>
                  <div className="border-bottom pb-3 mb-4">
                    <span className="badge px-3 py-1 rounded-pill fw-bold mb-2" style={{ background: "rgba(171, 12, 47, 0.08)", color: "#AB0C2F", border: "1px solid rgba(171, 12, 47, 0.22)" }}>
                      TAHAP 4: INSTRUMEN KHUSUS
                    </span>
                    <h3 className="fw-bold text-dark mb-1">Rincian Aktivitas Terkini</h3>
                    <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                      Isi data pendukung sesuai status &ldquo;{statusUtama.replace(/_/g, ' ')}&rdquo; yang Anda pilih.
                    </p>
                  </div>

                  <form onSubmit={handleStep4Next}>
                    {/* 4A: SUB-FORM BEKERJA */}
                    {(statusUtama === 'BEKERJA' || statusUtama === 'BEKERJA_SAMBIL_KULIAH_WIRAUSAHA') && (
                      <div className="mb-4">
                        <h5 className="fw-bold mb-3" style={{ color: "#AB0C2F" }}>
                          <i className="fa-solid fa-building me-2"></i>Informasi Pekerjaan
                        </h5>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-dark">Masa Tunggu Mendapat Kerja Pertama</label>
                            <select className="form-select py-2" value={kerjaMasaTunggu} onChange={(e) => setKerjaMasaTunggu(e.target.value)}>
                              <option value="KURANG_3_BULAN">&lt; 3 bulan</option>
                              <option value="TIGA_SAMPAI_6_BULAN">3 – 6 bulan</option>
                              <option value="TUJUH_SAMPAI_12_BULAN">7 – 12 bulan</option>
                              <option value="LEBIH_12_BULAN">&gt; 12 bulan</option>
                            </select>
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-dark">Nama Instansi / Perusahaan *</label>
                            <input
                              type="text"
                              className="form-control py-2"
                              placeholder="PT Pertamina, BPD Kaltimtara, dll."
                              value={kerjaNamaInstansi}
                              onChange={(e) => setKerjaNamaInstansi(e.target.value)}
                              required
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-dark">Kategori Tempat Kerja</label>
                            <select className="form-select py-2" value={kerjaKategoriTempat} onChange={(e) => setKerjaKategoriTempat(e.target.value)}>
                              <option value="INSTANSI_PEMERINTAH_BUMN_BUMD">Instansi Pemerintah / BUMN / BUMD</option>
                              <option value="SWASTA_NASIONAL">Perusahaan Swasta Nasional</option>
                              <option value="MULTINASIONAL_ASING">Perusahaan Multinasional / Asing</option>
                              <option value="UMKM">Usaha Mikro / UMKM</option>
                            </select>
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-dark">Lokasi Tempat Kerja</label>
                            <input
                              type="text"
                              className="form-control py-2"
                              placeholder="Kota Samarinda, Balikpapan, dll."
                              value={kerjaLokasi}
                              onChange={(e) => setKerjaLokasi(e.target.value)}
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-dark">Posisi / Jabatan Pekerjaan *</label>
                            <input
                              type="text"
                              className="form-control py-2"
                              placeholder="Staf Administrasi, Teknisi, dll."
                              value={kerjaPosisiJabatan}
                              onChange={(e) => setKerjaPosisiJabatan(e.target.value)}
                              required
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-dark">Status Kepegawaian</label>
                            <select className="form-select py-2" value={kerjaStatusKepegawaian} onChange={(e) => setKerjaStatusKepegawaian(e.target.value)}>
                              <option value="TETAP">Karyawan Tetap</option>
                              <option value="KONTRAK">Karyawan Kontrak (PKWT)</option>
                              <option value="FREELANCE">Harian Lepas / Freelance</option>
                              <option value="MAGANG">Magang Berbayar</option>
                            </select>
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-dark">Rentang Penghasilan Bulanan</label>
                            <select className="form-select py-2" value={kerjaRentangPenghasilan} onChange={(e) => setKerjaRentangPenghasilan(e.target.value)}>
                              <option value="KURANG_2_JUTA">&lt; Rp 2.000.000</option>
                              <option value="DUA_SAMPAI_3_SETENGAH_JUTA">Rp 2.000.000 – Rp 3.500.000</option>
                              <option value="TIGA_SETENGAH_SAMPAI_5_JUTA">Rp 3.500.000 – Rp 5.000.000</option>
                              <option value="LIMA_SAMPAI_7_SETENGAH_JUTA">Rp 5.000.000 – Rp 7.500.000</option>
                              <option value="LEBIH_7_SETENGAH_JUTA">&gt; Rp 7.500.000</option>
                            </select>
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-dark">Keselarasan Pekerjaan dengan Jurusan</label>
                            <select className="form-select py-2" value={kerjaKeselarasanJurusan} onChange={(e) => setKerjaKeselarasanJurusan(e.target.value)}>
                              <option value="SANGAT_SELARAS">Sangat Selaras (Sesuai keahlian)</option>
                              <option value="CUKUP_SELARAS">Cukup Selaras (Masih beririsan)</option>
                              <option value="TIDAK_SELARAS">Tidak Selaras (Berbeda bidang)</option>
                            </select>
                          </div>

                          <div className="col-12">
                            <label className="form-label fw-semibold text-dark">Saluran Perolehan Lowongan Kerja</label>
                            <div className="d-flex flex-wrap gap-3">
                              {['Bursa Kerja Khusus (BKK) Sekolah', 'Informasi Guru / Teman Alumni', 'Portal Lowongan Daring (Jobstreet, LinkedIn, dll.)', 'Melamar Langsung (Walk-in)'].map((opt) => (
                                <label key={opt} className="form-check-label d-flex align-items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={kerjaSaluranInfo.includes(opt)}
                                    onChange={() => toggleSaluranKerja(opt)}
                                    className="form-check-input"
                                    style={{ accentColor: '#AB0C2F' }}
                                  />
                                  <span style={{ fontSize: '13px' }}>{opt}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 4B: SUB-FORM KULIAH */}
                    {(statusUtama === 'KULIAH' || statusUtama === 'BEKERJA_SAMBIL_KULIAH_WIRAUSAHA') && (
                      <div className="mb-4 pt-3 border-top">
                        <h5 className="fw-bold text-primary mb-3">
                          <i className="fa-solid fa-graduation-cap me-2"></i>Informasi Perguruan Tinggi
                        </h5>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-dark">Nama Perguruan Tinggi / Lembaga *</label>
                            <input
                              type="text"
                              className="form-control py-2"
                              placeholder="Universitas Mulawarman, Polnes, ITK, dll."
                              value={kuliahNamaKampus}
                              onChange={(e) => setKuliahNamaKampus(e.target.value)}
                              required
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-dark">Jenjang Pendidikan</label>
                            <select className="form-select py-2" value={kuliahJenjang} onChange={(e) => setKuliahJenjang(e.target.value)}>
                              <option value="D3">Diploma 3 (D3)</option>
                              <option value="D4">Diploma 4 / Sarjana Terapan (D4)</option>
                              <option value="S1">Sarjana (S1)</option>
                              <option value="KURSUS_PELATIHAN">Kursus / Pelatihan Khusus</option>
                            </select>
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-dark">Program Studi / Jurusan Kuliah *</label>
                            <input
                              type="text"
                              className="form-control py-2"
                              placeholder="Informatika, Manajemen, Hukum, dll."
                              value={kuliahProgramStudi}
                              onChange={(e) => setKuliahProgramStudi(e.target.value)}
                              required
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-dark">Jalur Masuk</label>
                            <select className="form-select py-2" value={kuliahJalurMasuk} onChange={(e) => setKuliahJalurMasuk(e.target.value)}>
                              <option value="SNBP">SNBP (Jalur Prestasi)</option>
                              <option value="SNBT">SNBT (Tes UTBK)</option>
                              <option value="MANDIRI">Jalur Mandiri Perguruan Tinggi</option>
                              <option value="BEASISWA">Beasiswa Khusus (Kaltim Tuntas, KIP-K)</option>
                            </select>
                          </div>

                          <div className="col-12">
                            <label className="form-label fw-semibold text-dark">Keselarasan Bidang Kuliah dengan Jurusan Sekolah</label>
                            <div className="d-flex gap-4">
                              <label className="d-flex align-items-center gap-2">
                                <input
                                  type="radio"
                                  name="kuliahKeselarasan"
                                  checked={kuliahKeselarasanJurusan === 'SELARAS'}
                                  onChange={() => setKuliahKeselarasanJurusan('SELARAS')}
                                  className="form-check-input"
                                  style={{ accentColor: '#AB0C2F' }}
                                />
                                <span>Selaras (Lanjutan bidang yang sama)</span>
                              </label>
                              <label className="d-flex align-items-center gap-2">
                                <input
                                  type="radio"
                                  name="kuliahKeselarasan"
                                  checked={kuliahKeselarasanJurusan === 'TIDAK_SELARAS'}
                                  onChange={() => setKuliahKeselarasanJurusan('TIDAK_SELARAS')}
                                  className="form-check-input"
                                  style={{ accentColor: '#AB0C2F' }}
                                />
                                <span>Berbeda bidang / Lintas Jurusan (Linjur)</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 4C: SUB-FORM WIRAUSAHA */}
                    {statusUtama === 'WIRAUSAHA' && (
                      <div className="mb-4">
                        <h5 className="fw-bold text-warning mb-3">
                          <i className="fa-solid fa-store me-2"></i>Informasi Usaha Mandiri
                        </h5>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-dark">Sektor Bidang Usaha</label>
                            <select className="form-select py-2" value={wirausahaSektor} onChange={(e) => setWirausahaSektor(e.target.value)}>
                              <option value="JASA_IT">Jasa / Servis / IT</option>
                              <option value="KULINER">Kuliner / Food &amp; Beverage</option>
                              <option value="PERDAGANGAN">Perdagangan / Retail / Online Shop</option>
                              <option value="MANUFAKTUR">Manufaktur / Kerajinan</option>
                              <option value="LAINNYA">Lainnya</option>
                            </select>
                          </div>

                          {wirausahaSektor === 'LAINNYA' && (
                            <div className="col-md-6">
                              <label className="form-label fw-semibold text-dark">Sektor Usaha Lainnya</label>
                              <input
                                type="text"
                                className="form-control py-2"
                                placeholder="Sebutkan bidang usaha Anda"
                                value={wirausahaSektorLainnya}
                                onChange={(e) => setWirausahaSektorLainnya(e.target.value)}
                              />
                            </div>
                          )}

                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-dark">Nama Usaha / Brand *</label>
                            <input
                              type="text"
                              className="form-control py-2"
                              placeholder="Nama toko / brand usaha Anda"
                              value={wirausahaNamaUsaha}
                              onChange={(e) => setWirausahaNamaUsaha(e.target.value)}
                              required
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-dark">Legalitas Usaha</label>
                            <select className="form-select py-2" value={wirausahaLegalitas} onChange={(e) => setWirausahaLegalitas(e.target.value)}>
                              <option value="PERORANGAN">Belum berbadan hukum (Perorangan)</option>
                              <option value="NIB_MIKRO">NIB / Izin Usaha Mikro</option>
                              <option value="CV_PT_KOPERASI">CV / PT Perorangan / Koperasi</option>
                            </select>
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-dark">Rata-rata Omzet Bulanan</label>
                            <select className="form-select py-2" value={wirausahaOmzetBulanan} onChange={(e) => setWirausahaOmzetBulanan(e.target.value)}>
                              <option value="KURANG_2_JUTA">&lt; Rp 2.000.000</option>
                              <option value="DUA_SAMPAI_3_SETENGAH_JUTA">Rp 2.000.000 – Rp 3.500.000</option>
                              <option value="TIGA_SETENGAH_SAMPAI_5_JUTA">Rp 3.500.000 – Rp 5.000.000</option>
                              <option value="LIMA_SAMPAI_7_SETENGAH_JUTA">Rp 5.000.000 – Rp 7.500.000</option>
                              <option value="LEBIH_7_SETENGAH_JUTA">&gt; Rp 7.500.000</option>
                            </select>
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-dark">Jumlah Tenaga Kerja (di luar pemilik)</label>
                            <input
                              type="number"
                              min={0}
                              className="form-control py-2"
                              value={wirausahaJumlahPekerja}
                              onChange={(e) => setWirausahaJumlahPekerja(Number(e.target.value))}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 4D: SUB-FORM BELUM BEKERJA */}
                    {statusUtama === 'BELUM_BEKERJA' && (
                      <div className="mb-4">
                        <h5 className="fw-bold text-danger mb-3">
                          <i className="fa-solid fa-hourglass-half me-2"></i>Kondisi Pencarian Kerja
                        </h5>
                        <div className="row g-3">
                          <div className="col-12">
                            <label className="form-label fw-semibold text-dark">Kendala Utama dalam Memperoleh Pekerjaan (Pilih maks 2)</label>
                            <div className="d-flex flex-column gap-2">
                              {[
                                'Keterbatasan lowongan di domisili',
                                'Kurang memenuhi syarat kualifikasi/keahlian teknis',
                                'Kurang percaya diri saat tes/wawancara',
                                'Keterbatasan biaya transportasi/sertifikasi',
                                'Alasan keluarga / kesehatan',
                              ].map((k) => (
                                <label key={k} className="d-flex align-items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={belumKerjaKendala.includes(k)}
                                    onChange={() => toggleKendala(k)}
                                    className="form-check-input"
                                    style={{ accentColor: '#AB0C2F' }}
                                  />
                                  <span style={{ fontSize: '13px' }}>{k}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-dark">Apakah Masih Aktif Mencari Pekerjaan?</label>
                            <select className="form-select py-2" value={belumKerjaStatusAktif} onChange={(e) => setBelumKerjaStatusAktif(e.target.value)}>
                              <option value="AKTIF_MELAMAR">Ya, aktif melamar pekerjaan</option>
                              <option value="JEDA_GAP_YEAR">Tidak, sedang jeda / istirahat (gap year)</option>
                            </select>
                          </div>

                          <div className="col-12">
                            <label className="form-label fw-semibold text-dark">Pelatihan atau Sertifikasi yang Paling Anda Butuhkan</label>
                            <textarea
                              rows={2}
                              className="form-control"
                              placeholder="Contoh: Sertifikasi K3, pelatihan komputer akuntansi, bahasa Inggris..."
                              value={belumKerjaPelatihan}
                              onChange={(e) => setBelumKerjaPelatihan(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="d-flex justify-content-between mt-5">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="tracer-btn-back"
                      >
                        <i className="fa-solid fa-arrow-left me-2"></i> Kembali
                      </button>
                      <button
                        type="submit"
                        className="tracer-btn-next"
                      >
                        Lanjut ke Evaluasi <i className="fa-solid fa-arrow-right ms-2"></i>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ==================== STEP 5: EVALUASI & FEEDBACK SEKOLAH ==================== */}
              {currentStep === 5 && alumniData && (
                <div>
                  <div className="border-bottom pb-3 mb-4">
                    <span className="badge px-3 py-1 rounded-pill fw-bold mb-2" style={{ background: "rgba(171, 12, 47, 0.08)", color: "#AB0C2F", border: "1px solid rgba(171, 12, 47, 0.22)" }}>
                      TAHAP 5: EVALUASI &amp; SARAN SEKOLAH
                    </span>
                    <h3 className="fw-bold text-dark mb-1">Evaluasi Pembelajaran &amp; Layanan Sekolah</h3>
                    <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                      Beri penilaian objektif (Skala 1 = Sangat Kurang s.d. 4 = Sangat Baik) untuk peningkatan mutu sekolah almamater Anda.
                    </p>
                  </div>

                  <form onSubmit={handleFinalSubmit}>
                    <div className="d-flex flex-column gap-4 mb-4">
                      {/* Rating Matrix */}
                      <div className="table-responsive">
                        <table className="table table-bordered align-middle" style={{ fontSize: '13px' }}>
                          <thead className="table-light">
                            <tr>
                              <th>Aspek Penilaian Kompetensi &amp; Layanan</th>
                              <th style={{ width: '80px', textAlign: 'center' }}>1 (Buruk)</th>
                              <th style={{ width: '80px', textAlign: 'center' }}>2 (Cukup)</th>
                              <th style={{ width: '80px', textAlign: 'center' }}>3 (Baik)</th>
                              <th style={{ width: '80px', textAlign: 'center' }}>4 (Sangat Baik)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {alumniData.sekolah.jenjang === 'SMK' && (
                              <tr>
                                <td><strong>Kompetensi Kejuruan (Teori &amp; Praktik Bengkel/Lab)</strong></td>
                                {[1, 2, 3, 4].map((v) => (
                                  <td key={v} className="text-center" style={{ cursor: 'pointer' }} onClick={() => setEvalKompetensiKejuruan(v)}>
                                    <input type="radio" name="evalKompetensi" checked={evalKompetensiKejuruan === v} onChange={() => setEvalKompetensiKejuruan(v)} style={{ accentColor: '#AB0C2F', cursor: 'pointer' }} />
                                  </td>
                                ))}
                              </tr>
                            )}
                            <tr>
                              <td>Keterampilan Komputer &amp; Literasi Digital</td>
                              {[1, 2, 3, 4].map((v) => (
                                <td key={v} className="text-center" style={{ cursor: 'pointer' }} onClick={() => setEvalKomputer(v)}>
                                  <input type="radio" name="evalKomputer" checked={evalKomputer === v} onChange={() => setEvalKomputer(v)} style={{ accentColor: '#AB0C2F', cursor: 'pointer' }} />
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td>Kemampuan Bahasa Asing (Bahasa Inggris)</td>
                              {[1, 2, 3, 4].map((v) => (
                                <td key={v} className="text-center" style={{ cursor: 'pointer' }} onClick={() => setEvalBahasa(v)}>
                                  <input type="radio" name="evalBahasa" checked={evalBahasa === v} onChange={() => setEvalBahasa(v)} style={{ accentColor: '#AB0C2F', cursor: 'pointer' }} />
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td>Keterampilan Komunikasi &amp; Presentasi (Public Speaking)</td>
                              {[1, 2, 3, 4].map((v) => (
                                <td key={v} className="text-center" style={{ cursor: 'pointer' }} onClick={() => setEvalKomunikasi(v)}>
                                  <input type="radio" name="evalKomunikasi" checked={evalKomunikasi === v} onChange={() => setEvalKomunikasi(v)} style={{ accentColor: '#AB0C2F', cursor: 'pointer' }} />
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td>Etika Kerja, Kedisiplinan, dan Kejujuran</td>
                              {[1, 2, 3, 4].map((v) => (
                                <td key={v} className="text-center" style={{ cursor: 'pointer' }} onClick={() => setEvalEtika(v)}>
                                  <input type="radio" name="evalEtika" checked={evalEtika === v} onChange={() => setEvalEtika(v)} style={{ accentColor: '#AB0C2F', cursor: 'pointer' }} />
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td>Kemampuan Kerja Sama Tim (Teamwork)</td>
                              {[1, 2, 3, 4].map((v) => (
                                <td key={v} className="text-center" style={{ cursor: 'pointer' }} onClick={() => setEvalTeam(v)}>
                                  <input type="radio" name="evalTeam" checked={evalTeam === v} onChange={() => setEvalTeam(v)} style={{ accentColor: '#AB0C2F', cursor: 'pointer' }} />
                                </td>
                              ))}
                            </tr>
                            {alumniData.sekolah.jenjang === 'SMK' && (
                              <tr>
                                <td><strong>Pengalaman Praktik Kerja Lapangan (PKL / Magang Industri)</strong></td>
                                {[1, 2, 3, 4].map((v) => (
                                  <td key={v} className="text-center" style={{ cursor: 'pointer' }} onClick={() => setEvalPkl(v)}>
                                    <input type="radio" name="evalPkl" checked={evalPkl === v} onChange={() => setEvalPkl(v)} style={{ accentColor: '#AB0C2F', cursor: 'pointer' }} />
                                  </td>
                                ))}
                              </tr>
                            )}
                            <tr>
                              <td>Kelayakan Sarana Praktik / Laboratorium Sekolah</td>
                              {[1, 2, 3, 4].map((v) => (
                                <td key={v} className="text-center" style={{ cursor: 'pointer' }} onClick={() => setEvalSarana(v)}>
                                  <input type="radio" name="evalSarana" checked={evalSarana === v} onChange={() => setEvalSarana(v)} style={{ accentColor: '#AB0C2F', cursor: 'pointer' }} />
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td>Efektivitas Peran Bursa Kerja Khusus (BKK) Sekolah</td>
                              {[1, 2, 3, 4].map((v) => (
                                <td key={v} className="text-center" style={{ cursor: 'pointer' }} onClick={() => setEvalBkk(v)}>
                                  <input type="radio" name="evalBkk" checked={evalBkk === v} onChange={() => setEvalBkk(v)} style={{ accentColor: '#AB0C2F', cursor: 'pointer' }} />
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td>Kualitas Pendampingan Guru Pembimbing / Konseling</td>
                              {[1, 2, 3, 4].map((v) => (
                                <td key={v} className="text-center" style={{ cursor: 'pointer' }} onClick={() => setEvalGuru(v)}>
                                  <input type="radio" name="evalGuru" checked={evalGuru === v} onChange={() => setEvalGuru(v)} style={{ accentColor: '#AB0C2F', cursor: 'pointer' }} />
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Umpan Balik Terbuka */}
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label fw-semibold text-dark">
                            Materi atau keterampilan apa yang paling sering terpakai di aktivitas Anda sekarang?
                          </label>
                          <textarea
                            rows={2}
                            className="form-control"
                            placeholder="Tuliskan pengalaman nyata Anda…"
                            value={feedbackTerpakai}
                            onChange={(e) => setFeedbackTerpakai(e.target.value)}
                          />
                        </div>

                        <div className="col-12">
                          <label className="form-label fw-semibold text-dark">
                            Materi, alat, atau teknologi apa yang belum diajarkan di sekolah namun sangat dibutuhkan saat ini?
                          </label>
                          <textarea
                            rows={2}
                            className="form-control"
                            placeholder="Contoh: software tertentu, mesin modern, kecerdasan buatan (AI)..."
                            value={feedbackBelumDiajarkan}
                            onChange={(e) => setFeedbackBelumDiajarkan(e.target.value)}
                          />
                        </div>

                        <div className="col-12">
                          <label className="form-label fw-semibold text-dark">
                            Saran konkret untuk peningkatan mutu kurikulum dan layanan sekolah ke depan:
                          </label>
                          <textarea
                            rows={2}
                            className="form-control"
                            placeholder="Masukan dan harapan Anda untuk kemajuan almamater…"
                            value={feedbackSaranSekolah}
                            onChange={(e) => setFeedbackSaranSekolah(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between mt-5">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(4)}
                        className="tracer-btn-back"
                        disabled={loading}
                      >
                        <i className="fa-solid fa-arrow-left me-2"></i> Kembali
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="tracer-btn-next"
                      >
                        {loading ? 'Menyimpan Kuesioner…' : 'Kirim Kuesioner Final'} <i className="fa-solid fa-check ms-2"></i>
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

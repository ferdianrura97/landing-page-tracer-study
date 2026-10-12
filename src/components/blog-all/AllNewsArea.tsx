'use client';

import React, { useEffect, useState, useMemo } from 'react';
import BlogItem from '../blog/single/blog-item';
import { fetchApi } from '@/lib/api';
import { IBlogDT } from '@/types/blog-d-t';

export default function AllNewsArea() {
  const [news, setNews] = useState<IBlogDT[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKategori, setSelectedKategori] = useState<string>('Semua');

  useEffect(() => {
    async function loadAllNews() {
      setLoading(true);
      try {
        const res = await fetchApi<{ sukses: boolean; data: any[] }>('/publik/berita');
        if (res.sukses && Array.isArray(res.data)) {
          const mapped: IBlogDT[] = res.data.map((item) => ({
            id: item.id,
            img: item.gambar || '/assets/img/blog/blog-thumb-1.jpg',
            tag: item.kategori,
            title: item.judul,
            author: item.penulis,
            author_img: '/assets/img/logo/logo kaltim.webp',
            date: new Date(item.dibuat_pada).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
            desc: item.ringkasan,
            link: item.link_eksternal || undefined,
          }));
          setNews(mapped);
        }
      } catch (err) {
        console.error('Gagal memuat semua berita:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAllNews();
  }, []);

  // Ambil daftar kategori unik
  const kategoriList = useMemo(() => {
    const list = new Set<string>();
    news.forEach((n) => {
      if (n.tag) list.add(n.tag);
    });
    return ['Semua', ...Array.from(list)];
  }, [news]);

  // Filter berita berdasar kategori
  const filteredNews = useMemo(() => {
    if (selectedKategori === 'Semua') return news;
    return news.filter((n) => n.tag === selectedKategori);
  }, [news, selectedKategori]);

  return (
    <section className="blog-area grey-bg pt-80 pb-100">
      <div className="container">
        {/* Filter Kategori Tab Pills */}
        <div className="row justify-content-center mb-40">
          <div className="col-12">
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {kategoriList.map((kat) => (
                <button
                  key={kat}
                  type="button"
                  onClick={() => setSelectedKategori(kat)}
                  className={`btn rounded-pill px-4 py-2 ${
                    selectedKategori === kat
                      ? 'btn-success text-white fw-bold shadow-sm'
                      : 'btn-outline-secondary bg-white'
                  }`}
                  style={{
                    fontSize: '13px',
                    borderColor: selectedKategori === kat ? '#1E856C' : '#e2e8f0',
                    backgroundColor: selectedKategori === kat ? '#1E856C' : '#ffffff',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {kat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Grid 3 Kolom */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Memuat data berita…</span>
            </div>
            <p className="mt-2 text-muted">Memuat daftar berita dan publikasi…</p>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 border p-5">
            <i className="fa-regular fa-newspaper fa-3x text-muted mb-3"></i>
            <h4 className="fw-bold text-dark">Tidak Ada Berita</h4>
            <p className="text-muted mb-0">
              Belum ada artikel yang dipublikasikan dalam kategori &quot;{selectedKategori}&quot;.
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredNews.map((blog) => (
              <div key={blog.id} className="col-lg-4 col-md-6">
                <BlogItem blog={blog} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { IBlogDT } from '@/types/blog-d-t';
import { university_blogs } from '@/data/blog-data';
import BeritaStoriesBanner from './berita-stories-banner';
import BeritaStoriesArea from './berita-stories-area';

const ITEMS_PER_PAGE = 6;

const normalizeText = (text?: string | null) =>
  (text || '')
    .trim()
    .toLowerCase()
    .replace(/&amp;/g, '&');

export default function BeritaClient() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('kategori') || 'Semua';

  const [news, setNews] = useState<IBlogDT[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [activeTag, setActiveTag] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(0);

  // Sinkronisasi saat URL query param kategori berubah
  useEffect(() => {
    const catParam = searchParams.get('kategori');
    if (catParam) {
      setSelectedCategory(catParam);
    } else {
      setSelectedCategory('Semua');
    }
    setCurrentPage(0);
  }, [searchParams]);

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      try {
        const res = await fetchApi<{ sukses: boolean; data: any[] }>('/publik/berita');
        if (res.sukses && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: IBlogDT[] = res.data.map((item) => ({
            id: item.id,
            img: item.gambar || '/assets/img/blog/blog-thumb-1.jpg',
            tag: item.kategori || 'Warta Disdikbud',
            title: item.judul,
            author: item.penulis || 'Humas Disdikbud Kaltim',
            author_img: '/assets/img/blog/blog-stories/blog-stories-user-1.jpg',
            date: new Date(item.dibuat_pada).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
            desc: item.ringkasan,
            link: item.link_eksternal || undefined,
          }));
          setNews(mapped);
        } else {
          setNews(university_blogs);
        }
      } catch (err) {
        console.error('Gagal memuat berita publik, memakai data lokal:', err);
        setNews(university_blogs);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  // Kategori unik
  const categories = useMemo(() => {
    const list = new Set<string>();
    news.forEach((n) => {
      if (n.tag) list.add(n.tag.trim());
    });
    return ['Semua', ...Array.from(list)];
  }, [news]);

  // Hitungan jumlah per kategori
  const categoriesWithCount = useMemo(() => {
    return categories.map((cat) => ({
      name: cat,
      count:
        cat === 'Semua'
          ? news.length
          : news.filter((n) => normalizeText(n.tag) === normalizeText(cat)).length,
    }));
  }, [categories, news]);

  // Filter feed berita berdasarkan kategori, search, dan tag aktif
  const filteredItems = useMemo(() => {
    return news.filter((item) => {
      const matchCategory =
        selectedCategory === 'Semua' ||
        normalizeText(item.tag) === normalizeText(selectedCategory);

      const kw = searchKeyword.trim().toLowerCase();
      const matchSearch =
        !kw ||
        item.title.toLowerCase().includes(kw) ||
        (item.desc && item.desc.toLowerCase().includes(kw)) ||
        (item.tag && item.tag.toLowerCase().includes(kw)) ||
        (item.author && item.author.toLowerCase().includes(kw));

      const tagKw = activeTag.trim().toLowerCase();
      const matchTag =
        !tagKw ||
        item.title.toLowerCase().includes(tagKw) ||
        (item.tag && item.tag.toLowerCase().includes(tagKw)) ||
        (item.desc && item.desc.toLowerCase().includes(tagKw));

      return matchCategory && matchSearch && matchTag;
    });
  }, [news, selectedCategory, searchKeyword, activeTag]);

  // Featured spotlight banner mengikuti hasil filter artikel
  const featured = useMemo(() => {
    return filteredItems.length > 0 ? filteredItems[0] : null;
  }, [filteredItems]);

  // Pagination slice
  const pageCount = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const currentItems = useMemo(() => {
    const start = currentPage * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  const handleSelectCategory = useCallback((category: string) => {
    setSelectedCategory(category);
    setCurrentPage(0);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (category === 'Semua') {
        url.searchParams.delete('kategori');
      } else {
        url.searchParams.set('kategori', category);
      }
      window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
    }
  }, []);

  const handleSearchChange = useCallback((keyword: string) => {
    setSearchKeyword(keyword);
    setCurrentPage(0);
  }, []);

  const handleSelectTag = useCallback((tag: string) => {
    setActiveTag((prev) => (prev === tag ? '' : tag));
    setCurrentPage(0);
  }, []);

  const handlePageClick = useCallback((event: { selected: number }) => {
    setCurrentPage(event.selected);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }, []);

  const handleResetFilter = useCallback(() => {
    setSelectedCategory('Semua');
    setSearchKeyword('');
    setActiveTag('');
    setCurrentPage(0);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('kategori');
      window.history.replaceState({}, '', url.pathname);
    }
  }, []);

  return (
    <>
      {/* 1. Banner dengan Breadcrumb, Kategori Pills, dan Featured Spotlight */}
      <BeritaStoriesBanner
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        featured={featured}
        searchKeyword={searchKeyword}
        onSearchChange={handleSearchChange}
      />

      {/* 2. Grid Berita 2-Kolom & Sidebar Berita */}
      <BeritaStoriesArea
        items={currentItems}
        loading={loading}
        pageCount={pageCount}
        handlePageClick={handlePageClick}
        categoriesWithCount={categoriesWithCount}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        recentPosts={news}
        searchKeyword={searchKeyword}
        onSearchChange={handleSearchChange}
        activeTag={activeTag}
        onSelectTag={handleSelectTag}
        onResetFilter={handleResetFilter}
      />
    </>
  );
}

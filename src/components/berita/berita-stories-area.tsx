'use client';

import React from 'react';
import { IBlogDT } from '@/types/blog-d-t';
import BlogStoriesItem from '@/components/blog/single/blog-stories-item';
import Pagination from '@/components/ui/pagination';
import BeritaSidebar from './berita-sidebar';

interface Props {
  items: IBlogDT[];
  loading: boolean;
  pageCount: number;
  handlePageClick: (event: { selected: number }) => void;
  categoriesWithCount: Array<{ name: string; count: number }>;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  recentPosts: IBlogDT[];
  searchKeyword: string;
  onSearchChange: (keyword: string) => void;
  activeTag: string;
  onSelectTag: (tag: string) => void;
  onResetFilter: () => void;
}

export default function BeritaStoriesArea({
  items,
  loading,
  pageCount,
  handlePageClick,
  categoriesWithCount,
  selectedCategory,
  onSelectCategory,
  recentPosts,
  searchKeyword,
  onSearchChange,
  activeTag,
  onSelectTag,
  onResetFilter,
}: Props) {
  return (
    <section className="tp-blog-stories-area p-relative pb-120">
      <div className="container">
        <div className="row">
          {/* Kolom Kiri: 8 Grid Artikel */}
          <div className="col-lg-8">
            {loading ? (
              <div className="text-center py-5">
                <div
                  className="spinner-border text-danger"
                  style={{ color: 'var(--tp-theme-primary)' }}
                  role="status"
                >
                  <span className="visually-hidden">Memuat artikel...</span>
                </div>
                <p className="mt-3 text-muted">Memuat daftar berita &amp; publikasi...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-5 bg-white rounded-4 border p-5 mb-50">
                <i
                  className="fa-regular fa-newspaper fa-3x mb-3"
                  style={{ color: 'var(--tp-theme-primary)' }}
                />
                <h4 className="fw-bold text-dark">Tidak Ada Berita</h4>
                <p className="text-muted mb-4">
                  Tidak ditemukan artikel yang sesuai dengan kriteria filter atau pencarian Anda.
                </p>
                <button
                  type="button"
                  className="tp-btn tp-btn-sm"
                  onClick={onResetFilter}
                >
                  Reset Semua Filter
                </button>
              </div>
            ) : (
              <div className="row">
                {items.map((blog) => (
                  <div key={blog.id} className="col-lg-6 col-md-6">
                    <BlogStoriesItem blog={blog} />
                  </div>
                ))}
              </div>
            )}

            {/* Paginasi */}
            {!loading && pageCount > 1 && (
              <div className="row">
                <div className="col-lg-12">
                  <div className="tp-event-inner-pagination">
                    <div className="tp-dashboard-pagination">
                      <div className="tp-pagination">
                        <Pagination
                          handlePageClick={handlePageClick}
                          pageCount={pageCount}
                          isCenter={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Kolom Kanan: 4 Grid Sidebar */}
          <div className="col-lg-4">
            <BeritaSidebar
              categoriesWithCount={categoriesWithCount}
              selectedCategory={selectedCategory}
              onSelectCategory={onSelectCategory}
              recentPosts={recentPosts}
              searchKeyword={searchKeyword}
              onSearchChange={onSearchChange}
              activeTag={activeTag}
              onSelectTag={onSelectTag}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

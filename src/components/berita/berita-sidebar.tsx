'use client';

import React from 'react';
import Link from 'next/link';
import { SearchSvgTwo } from '@/components/svg';
import { IBlogDT } from '@/types/blog-d-t';

// ponytail: static tags array until database tags table is added
export const STATIC_TAGS = [
  'Tracer Study',
  'Alumni Kaltim',
  'SMK Bisa',
  'SMA Unggul',
  'Vokasi Kaltim',
  'IKN Nusantara',
  'Disdikbud Kaltim',
  'Bursa Kerja',
  'Beasiswa & Kuliah',
  'Wirausaha Mandiri',
];

interface Props {
  categoriesWithCount: Array<{ name: string; count: number }>;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  recentPosts: IBlogDT[];
  searchKeyword: string;
  onSearchChange: (keyword: string) => void;
  activeTag: string;
  onSelectTag: (tag: string) => void;
  availableTags?: Array<{ id: number; nama: string; slug: string }>;
}

export default function BeritaSidebar({
  categoriesWithCount,
  selectedCategory,
  onSelectCategory,
  recentPosts,
  searchKeyword,
  onSearchChange,
  activeTag,
  onSelectTag,
  availableTags,
}: Props) {
  const tagsToRender = availableTags && availableTags.length > 0 ? availableTags.map(t => t.nama) : STATIC_TAGS;
  return (
    <div className="tp-sidebar-wrapper pl-55">
      {/* 1. Search Box */}
      <div className="tp-sidebar-widgets mb-50">
        <div className="tp-sidebar-content">
          <div className="tp-sidebar-search p-relative">
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Cari berita atau pengumuman..."
                value={searchKeyword}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              <button className="tp-sidebar-search-btn" type="button" aria-label="Cari berita">
                <span>
                  <SearchSvgTwo />
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 2. Categories List */}
      <div className="tp-sidebar-widget mb-50">
        <div className="tp-sidebar-content">
          <h5 className="tp-sidebar-widget-title">Kategori</h5>
          <ul>
            {categoriesWithCount.map((item) => (
              <li key={item.name}>
                <a
                  role="button"
                  tabIndex={0}
                  className={(selectedCategory || '').trim().toLowerCase().replace(/&amp;/g, '&') === (item.name || '').trim().toLowerCase().replace(/&amp;/g, '&') ? 'active' : ''}
                  onClick={() => onSelectCategory(item.name)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectCategory(item.name);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {item.name} <span>({item.count})</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 3. Recent Posts */}
      {recentPosts.length > 0 && (
        <div className="tp-sidebar-widget mb-50">
          <h5 className="tp-sidebar-widget-title">Berita Terbaru</h5>
          {recentPosts.slice(0, 3).map((blog) => {
            const url = `/berita/${blog.id}`;
            const isExternal = url.startsWith('http');
            return (
              <div key={blog.id} className="tp-recent-post-content">
                <span className="tp-recent-post-span">
                  {blog.tag || 'Berita'}
                </span>
                <h5 className="tp-recent-post-title">
                  {isExternal ? (
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {blog.title}
                    </a>
                  ) : (
                    <Link href={url}>{blog.title}</Link>
                  )}
                </h5>
                <div className="tp-recent-post-tag">
                  <span>{blog.date}</span>
                  <span>{blog.author || 'Admin'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Tagcloud (Statis) */}
      <div className="tp-sidebar-widget mb-50">
        <div className="tp-sidebar-content">
          <h5 className="tp-sidebar-widget-title">Tag Populer</h5>
          <div className="tagcloud">
            {tagsToRender.map((tag) => (
              <a
                key={tag}
                role="button"
                tabIndex={0}
                className={activeTag === tag ? 'active' : ''}
                onClick={() => onSelectTag(tag)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectTag(tag);
                  }
                }}
              >
                #{tag}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

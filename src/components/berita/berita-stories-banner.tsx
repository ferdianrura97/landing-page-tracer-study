'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HomeSvg, SearchSvg } from '@/components/svg';
import { IBlogDT } from '@/types/blog-d-t';

interface Props {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  featured: IBlogDT | null;
  searchKeyword: string;
  onSearchChange: (keyword: string) => void;
}

export default function BeritaStoriesBanner({
  categories,
  selectedCategory,
  onSelectCategory,
  featured,
  searchKeyword,
  onSearchChange,
}: Props) {
  const featuredUrl = featured ? `/berita/${featured.id}` : '#';
  const isExternal = featuredUrl.startsWith('http');

  return (
    <section className="tp-blog-stories-area fix p-relative pt-120 pb-60">
      <div
        className="tp-blog-stories-bg"
        style={{
          backgroundImage: 'url(/assets/img/blog/blog-stories/blog-stories-bg.png)',
        }}
      />
      <div className="container">
        <div className="row align-items-center">
          <div className="col-sm-12">
            <div className="tp-breadcrumb__content">
              <div className="tp-breadcrumb__list">
                <span>
                  <Link href="/" aria-label="Beranda">
                    <HomeSvg />
                  </Link>
                </span>
                <span className="color">Berita &amp; Publikasi</span>
              </div>
              <h3 className="tp-breadcrumb__title">Berita &amp; Kabar Terkini</h3>
              <p className="tp-blog-stories-p">
                Informasi resmi, agenda penelusuran tamatan SMA &amp; SMK, serta dinamika kebutuhan karier dan vokasi se-Kalimantan Timur.
              </p>

              {/* Category Pills Bar */}
              <div className="tp-blog-stories-btn-box mb-60 d-flex flex-wrap align-items-center gap-2">
                {categories.map((cat) => (
                  <a
                    key={cat}
                    role="button"
                    tabIndex={0}
                    className={(selectedCategory || '').trim().toLowerCase().replace(/&amp;/g, '&') === (cat || '').trim().toLowerCase().replace(/&amp;/g, '&') ? 'active' : ''}
                    onClick={() => onSelectCategory(cat)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectCategory(cat);
                      }
                    }}
                  >
                    {cat}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Spotlight News Card */}
          {featured && (
            <div className="col-lg-12">
              <div className="tp-blog-stories-banner-wrap p-relative">
                <div className="tp-blog-stories-banner-thumb p-relative">
                  {isExternal ? (
                    <a href={featuredUrl} target="_blank" rel="noopener noreferrer">
                      <Image
                        src={featured.img}
                        alt={featured.title}
                        width={1200}
                        height={480}
                        unoptimized={typeof featured.img === 'string' && featured.img.startsWith('http')}
                        style={{ height: '420px', width: '100%', objectFit: 'cover' }}
                        priority
                      />
                    </a>
                  ) : (
                    <Link href={featuredUrl}>
                      <Image
                        src={featured.img}
                        alt={featured.title}
                        width={1200}
                        height={480}
                        unoptimized={typeof featured.img === 'string' && featured.img.startsWith('http')}
                        style={{ height: '420px', width: '100%', objectFit: 'cover' }}
                        priority
                      />
                    </Link>
                  )}
                </div>

                <div className="tp-blog-stories-banner-content">
                  <span className="tp-blog-stories-banner-sub">
                    {featured.tag || 'Sorotan Utama'}
                  </span>
                  <h3 className="tp-blog-stories-banner-title">
                    {isExternal ? (
                      <a href={featuredUrl} target="_blank" rel="noopener noreferrer">
                        {featured.title}
                      </a>
                    ) : (
                      <Link href={featuredUrl}>{featured.title}</Link>
                    )}
                  </h3>
                  <div className="tp-blog-stories-banner-user d-flex align-items-center">
                    {featured.author_img && (
                      <div className="tp-blog-stories-user-thumb">
                        <Image
                          src={featured.author_img}
                          alt={featured.author}
                          width={44}
                          height={44}
                          unoptimized={typeof featured.author_img === 'string' && featured.author_img.startsWith('http')}
                          style={{ borderRadius: '50%', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <div className="tp-blog-stories-user-content">
                      <h6>{featured.author}</h6>
                      <span>{featured.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

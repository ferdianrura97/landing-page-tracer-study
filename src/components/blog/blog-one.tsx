'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShapeLineTwo, RightArrow } from "../svg";
import BlogItem from "./single/blog-item";
import { university_blogs } from "@/data/blog-data";
import { fetchApi } from "@/lib/api";
import { IBlogDT } from "@/types/blog-d-t";

export default function BlogOne() {
  const [blogs, setBlogs] = useState<IBlogDT[]>(university_blogs);

  useEffect(() => {
    async function loadPublishedNews() {
      try {
        const res = await fetchApi<{ sukses: boolean; data: any[] }>('/publik/berita?limit=3');
        if (res.sukses && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: IBlogDT[] = res.data.map((item) => ({
            id: item.id,
            img: item.gambar || "/assets/img/blog/blog-thumb-1.jpg",
            tag: item.kategori,
            title: item.judul,
            author: item.penulis,
            author_img: "/assets/img/logo/logo kaltim.webp",
            date: new Date(item.dibuat_pada).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
            desc: item.ringkasan,
            link: item.link_eksternal || undefined,
          }));
          setBlogs(mapped.slice(0, 3));
        }
      } catch (err) {
        console.error("Gagal memuat berita publik:", err);
      }
    }
    loadPublishedNews();
  }, []);

  return (
    <section className="blog-area grey-bg pt-110 pb-95">
      <div className="container">
        {/* Header Section dengan Tombol di Pojok Kanan */}
        <div className="row align-items-end mb-50">
          <div className="col-lg-8 col-md-8">
            <div className="tp-section">
              <h5 className="tp-section-subtitle mb-10" style={{ color: "var(--tp-theme-primary)", fontWeight: 600 }}>
                KABAR &amp; INFORMASI TERKINI
              </h5>
              <h3 className="tp-section-2-title mb-0">
                Berita &amp; Publikasi{" "}
                <span>
                  Tracer Study Kaltim.
                  <ShapeLineTwo />
                </span>
              </h3>
            </div>
          </div>
          <div className="col-lg-4 col-md-4">
            <div className="tp-event-btn text-md-end mt-20 mt-md-0">
              <Link className="tp-btn" href="/berita">
                Lihat Semua Berita
                <span>
                  <RightArrow />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Grid 3 Kolom per Baris */}
        <div className="row g-4">
          {blogs.map((blog) => (
            <div key={blog.id} className="col-lg-4 col-md-6">
              <BlogItem blog={blog} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

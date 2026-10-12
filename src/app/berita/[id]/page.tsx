import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HeaderOne from '@/components/header/header-one';
import FooterOne from '@/components/footer/footer-one';
import BackToTop from '@/components/back-to-top';
import MainProvider from '@/components/provider/main-provider';
import BeritaDetailView, {
  BeritaDetailData,
} from '@/components/berita/detail/berita-detail-view';
import all_blogs from '@/data/blog-data';
import { IBlogDT } from '@/types/blog-d-t';

type Props = {
  params: Promise<{ id: string }>;
};

async function fetchBeritaDetail(id: string): Promise<BeritaDetailData | null> {
  const apiBase =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

  try {
    const res = await fetch(`${apiBase}/publik/berita/${id}`, {
      next: { revalidate: 30 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.sukses && json.data) {
        return json.data as BeritaDetailData;
      }
    }
  } catch {
    // API backend tidak terjangkau, fallback ke mock data
  }

  // Fallback ke data mock lokal
  const found = all_blogs.find((item) => String(item.id) === String(id));
  if (found) {
    return {
      id: Number(found.id),
      judul: found.title,
      kategori: found.tag || 'Warta Disdikbud',
      penulis: found.author || 'Humas Disdikbud Kaltim',
      gambar: found.img || '/assets/img/blog/blog-thumb-1.jpg',
      ringkasan: found.desc || found.title,
      konten: `<p>${found.desc || found.title}</p><p>Survei Tracer Study Kalimantan Timur terus memantau rekam jejak keterserapan kerja, wirausaha, serta studi lanjut lulusan SMA &amp; SMK demi peningkatan mutu pendidikan daerah Benua Etam.</p>`,
      link_eksternal: found.link || null,
      diterbitkan: true,
      dibuat_pada: found.date || '01 Oktober 2026',
    };
  }

  return null;
}

async function fetchRelatedNews(currentId: number): Promise<IBlogDT[]> {
  const apiBase =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

  try {
    const res = await fetch(`${apiBase}/publik/berita`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.sukses && Array.isArray(json.data)) {
        const filtered = json.data.filter(
          (item: { id: number }) => Number(item.id) !== Number(currentId)
        );
        if (filtered.length > 0) {
          return filtered.slice(0, 3).map((item: any) => ({
            id: item.id,
            img: item.gambar || '/assets/img/blog/blog-thumb-1.jpg',
            tag: item.kategori || 'Warta Disdikbud',
            title: item.judul,
            author: item.penulis || 'Humas Disdikbud Kaltim',
            author_img: '/assets/img/logo/logo kaltim.webp',
            date: new Date(item.dibuat_pada).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
            desc: item.ringkasan,
            link: `/berita/${item.id}`,
          }));
        }
      }
    }
  } catch {
    // API backend tidak terjangkau, fallback ke mock data
  }

  return all_blogs
    .filter((b) => Number(b.id) !== Number(currentId))
    .slice(0, 3)
    .map((b) => ({
      ...b,
      link: `/berita/${b.id}`,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const berita = await fetchBeritaDetail(resolvedParams.id);

  if (!berita) {
    return {
      title: 'Berita Tidak Ditemukan — Tracer Study Kalimantan Timur',
      description: 'Detail publikasi tidak ditemukan pada arsip Tracer Study Kaltim.',
    };
  }

  return {
    title: `${berita.judul} — Tracer Study Kalimantan Timur`,
    description:
      berita.ringkasan ||
      'Publikasi resmi Dinas Pendidikan dan Kebudayaan Provinsi Kalimantan Timur.',
    openGraph: {
      title: berita.judul,
      description: berita.ringkasan,
      images: berita.gambar ? [berita.gambar] : undefined,
    },
  };
}

export default async function BeritaDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const berita = await fetchBeritaDetail(resolvedParams.id);

  if (!berita) {
    notFound();
  }

  const related = await fetchRelatedNews(berita.id);

  return (
    <MainProvider>
      <HeaderOne transparent={false} />
      <main>
        <BeritaDetailView berita={berita} related={related} />
      </main>
      <FooterOne />
      <BackToTop />
    </MainProvider>
  );
}

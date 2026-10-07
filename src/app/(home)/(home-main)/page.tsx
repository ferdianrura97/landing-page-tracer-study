import { Metadata } from 'next';
import TracerHero from '@/components/tracer/TracerHero';
import TracerCounter from '@/components/tracer/TracerCounter';
import TracerPublicCharts from '@/components/tracer/TracerPublicCharts';
import TracerProcess from '@/components/tracer/TracerProcess';
import TracerFaq from '@/components/tracer/TracerFaq';

export const metadata: Metadata = {
  title: "Tracer Study Kalimantan Timur — Portal Resmi Penelusuran Tamatan SMA & SMK",
  description: "Portal resmi Tracer Study Dinas Pendidikan dan Kebudayaan Provinsi Kalimantan Timur untuk memetakan serapan alumni SMA & SMK se-Kaltim.",
};

export default function HomePage() {
  return (
    <main>
      {/* 1. Hero Area */}
      <TracerHero />

      {/* 2. Live Counter */}
      <TracerCounter />

      {/* 3. Public Interactive Charts */}
      <TracerPublicCharts />

      {/* 4. 4-Step Process */}
      <TracerProcess />

      {/* 5. FAQ */}
      <TracerFaq />
    </main>
  );
}

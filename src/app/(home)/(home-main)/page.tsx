import { Metadata } from 'next';
import HeroAreaOne from '@/components/hero-area/hero-area-one';
import ServiceOne from '@/components/service/service-one';
import AboutTracerStudy from '@/components/about/about-tracer-study';
import AboutIknNusantara from '@/components/about/about-ikn-nusantara';
import CounterOne from '@/components/counter/counter-one';
import ProgramArea from '@/components/program/program-area';
import EventArea from '@/components/event/event-area';
import TestimonialOne from '@/components/testimonial/testimonial-one';
import BlogOne from '@/components/blog/blog-one';
import InstagramArea from '@/components/instagram/instagram-area';
import CtaOne from '@/components/cta/cta-one';

export const metadata: Metadata = {
  title: "Home University Classic - Acadia",
};

export default function HomePage() {
  return (
    <main>
      {/* hero area start */}
      <HeroAreaOne/>
      {/* hero area end */}

      {/* service area start */}
      <ServiceOne/>
      {/* service area end */}

      {/* section 1: tentang tracer study kaltim (foto kiri, teks kanan) */}
      <AboutTracerStudy/>

      {/* section 2: sdm unggul kaltim & ikn (teks kiri, foto kanan) */}
      <AboutIknNusantara/>

      {/* counter area start */}
      <CounterOne/>
      {/* counter area end */}

      {/* program area start */}
      <ProgramArea/>
      {/* program area end */}

      {/* event area start */}
      <EventArea/>
      {/* event area end */}

      {/* testimonial area start */}
      <TestimonialOne/>
      {/* testimonial area end */}

      {/* blog area start */}
      <BlogOne/>
      {/* blog area end */}

      {/* instagram area start */}
      <InstagramArea/>
      {/* instagram area end */}

      {/* cta area start */}
      <CtaOne/>
      {/* cta area end */}
    </main>
  )
}

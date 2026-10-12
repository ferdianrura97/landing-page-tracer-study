"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { SwiperOptions } from "swiper/types";
import { NextArrow, PrevArrow } from "../svg";
import { testimonial_one_data } from "@/data/testimonial-data";
import { fetchApi } from "@/lib/api";

const swiper_options: SwiperOptions = {
  slidesPerView: 1,
  spaceBetween: 10,
  loop: true,
  speed: 800,
  autoplay: {
    delay: 1500,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  navigation: {
    nextEl: ".tp-testimonial-next",
    prevEl: ".tp-testimonial-prev",
  },
};

interface TestimonialItemUI {
  id: number;
  img: string;
  content: string;
  name: string;
  position: string;
}

export default function TestimonialSliderOne() {
  const [testimonials, setTestimonials] = useState<TestimonialItemUI[]>(testimonial_one_data);

  useEffect(() => {
    async function loadTestimoni() {
      try {
        const res = await fetchApi<{ sukses: boolean; data: any[] }>('/publik/testimoni');
        if (res.sukses && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: TestimonialItemUI[] = res.data.map((item) => ({
            id: item.id,
            img: item.foto || "/assets/img/testimonial/testimonial-avatar-1.png",
            content: item.pesan,
            name: item.nama,
            position: item.posisi,
          }));
          setTestimonials(mapped);
        }
      } catch (err) {
        console.error("Gagal memuat testimoni alumni publik:", err);
      }
    }
    loadTestimoni();
  }, []);

  return (
    <>
      <Swiper
        {...swiper_options}
        modules={[Navigation, Autoplay]}
        className="swiper tp-testimonial-active"
      >
        {testimonials.map((item) => (
          <SwiperSlide
            key={item.id}
            className="tp-testimonial-item"
          >
            <div className="tp-testimonial-avatar">
              <Image
                src={item.img}
                alt={item.name}
                width={60}
                height={60}
                unoptimized={typeof item.img === "string" && item.img.startsWith("http")}
                style={{ objectFit: "cover", borderRadius: "50%" }}
              />
            </div>
            <div className="tp-testimonial-content">
              <p>{item.content}</p>
            </div>
            <div className="tp-testimonial-avatar-info">
              <h4 className="tp-testimonial-avatar-title">{item.name}</h4>
              <span>{item.position}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="tp-testimonial-arrow text-md-end">
        <div className="tp-testimonial-prev pointer">
          <span>
            <PrevArrow />
          </span>
        </div>
        <div className="tp-testimonial-next pointer">
          <span>
            <NextArrow />
          </span>
        </div>
      </div>
    </>
  );
}

"use client";
import Image from "next/image";
import React from "react";
import { Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { SwiperOptions } from "swiper/types";
import { NextArrow, PrevArrow } from "../svg";
import { testimonial_one_data } from "@/data/testimonial-data";

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

export default function TestimonialSliderOne() {
  return (
    <>
      <Swiper
        {...swiper_options}
        modules={[Navigation, Autoplay]}
        className="swiper tp-testimonial-active"
      >
        {testimonial_one_data.map((item) => (
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

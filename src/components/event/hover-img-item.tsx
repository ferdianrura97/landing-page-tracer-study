"use client";

import useHoverReveal from "@/hooks/use-hover-reveal";
import Link from "next/link";

type IProps = {
  title: string;
  img: string;
  link?: string;
};

export default function HoverImgItem({ img, title, link = "/tracer" }: IProps) {
  const { handleMouseMove } = useHoverReveal();
  const isExternal = link.startsWith("http");

  if (isExternal) {
    return (
      <a
        className="tp-img-reveal tp-img-reveal-item"
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        data-img={img}
        data-fx="1"
        onMouseMove={handleMouseMove}
      >
        {title}
        <div
          className="tp-hover-reveal-bg"
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      </a>
    );
  }

  return (
    <Link
      className="tp-img-reveal tp-img-reveal-item"
      href={link}
      data-img={img}
      data-fx="1"
      onMouseMove={handleMouseMove}
    >
      {title}
      <div
        className="tp-hover-reveal-bg"
        style={{
          backgroundImage: `url(${img})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
    </Link>
  );
}

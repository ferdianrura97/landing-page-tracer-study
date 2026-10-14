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

  const revealContent = (
    <>
      {title}
      <div className="tp-hover-reveal-bg img-blur-frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt="" aria-hidden="true" className="img-blur-bg" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={title} className="img-blur-main" />
      </div>
    </>
  );

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
        {revealContent}
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
      {revealContent}
    </Link>
  );
}

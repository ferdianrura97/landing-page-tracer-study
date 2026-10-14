import Image from "next/image";
import { AuthorSvg, ClockSvg, NextArrow } from "@/components/svg";
import { IBlogDT } from "@/types/blog-d-t";
import Link from "next/link";

type IProps = {
  blog: IBlogDT;
};

export default function BlogItem({ blog }: IProps) {
  const targetUrl = `/berita/${blog.slug || blog.id}`;

  return (
    <div
      className="tp-blog-item text-center mb-40 wow fadeInLeft"
      data-wow-delay=".4s"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100% - 40px)",
      }}
    >
      <div
        className="tp-blog-thumb fix img-blur-frame"
        style={{
          height: "230px",
          width: "100%",
          borderRadius: "12px",
          marginBottom: "24px",
          flexShrink: 0,
        }}
      >
        <Link href={targetUrl} style={{ display: "block", width: "100%", height: "100%", position: "relative" }}>
          {/* Lapis 1: Background Blur */}
          <Image
            src={blog.img}
            alt=""
            aria-hidden="true"
            fill
            sizes="350px"
            className="img-blur-bg"
            unoptimized={typeof blog.img === "string" && blog.img.startsWith("http")}
          />
          {/* Lapis 2: Gambar Asli Utuh */}
          <Image
            src={blog.img}
            alt={blog.title}
            fill
            sizes="350px"
            className="img-blur-main"
            unoptimized={typeof blog.img === "string" && blog.img.startsWith("http")}
          />
        </Link>
      </div>

      <div
        className="tp-blog-content"
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "space-between",
        }}
      >
        <div>
          <span className="tp-blog-tag" style={{ fontSize: "14px", fontWeight: 600 }}>
            {blog.tag}
          </span>
          <h4
            className="tp-blog-title"
            style={{
              fontSize: "19px",
              lineHeight: 1.4,
              minHeight: "54px",
              marginBottom: "14px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            <Link href={targetUrl}>{blog.title}</Link>
          </h4>
        </div>

        <div>
          <div className="tp-blog-meta mb-2">
            <span>
              <span>
                <AuthorSvg />
                {blog.author}
              </span>
            </span>
            <span>
              <span>
                <ClockSvg />
                {blog.date}
              </span>
            </span>
          </div>

          <div className="tp-blog-btn">
            <Link href={targetUrl} aria-label="Baca berita">
              <span className="tp-blog-btn-bg blog-btn-bg"></span>
              <span className="tp-blog-btn-border blog-btn-border"></span>
              <span className="icon">
                <NextArrow />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

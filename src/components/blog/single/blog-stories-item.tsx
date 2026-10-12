import Image from "next/image";
import { IBlogDT } from "@/types/blog-d-t";
import Link from "next/link";

type IProps = {
  blog: IBlogDT;
};

export default function BlogStoriesItem({ blog }: IProps) {
  const targetUrl = `/berita/${blog.id}`;

  return (
    <div className="tp-blog-stories-item p-relative mb-50">
      <div className="tp-blog-stories-thumb">
        <Link href={targetUrl}>
          <Image
            src={blog.img}
            width={384}
            height={220}
            alt={blog.title}
            unoptimized={typeof blog.img === "string" && blog.img.startsWith("http")}
            style={{ objectFit: "cover", height: "220px", width: "100%" }}
          />
        </Link>
      </div>
      <div className="tp-blog-stories-content">
        <div className="tp-blog-stories-tag-wrap d-flex align-items-center">
          <Link href={`/berita?kategori=${encodeURIComponent(blog.tag)}`}>
            {blog.tag}
          </Link>
          <span>{blog.date}</span>
        </div>
        <h4 className="tp-blog-stories-title" style={{ fontSize: "20px", lineHeight: 1.4, minHeight: "56px" }}>
          <Link href={targetUrl}>{blog.title}</Link>
        </h4>
        <div className="tp-blog-stories-user-box d-flex align-items-center">
          {blog.author_img && (
            <div className="tp-blog-stories-user-thumb">
              <Image
                src={blog.author_img}
                alt={blog.author}
                width={44}
                height={44}
                unoptimized={typeof blog.author_img === "string" && blog.author_img.startsWith("http")}
                style={{ borderRadius: "50%", objectFit: "contain", backgroundColor: "#ffffff", padding: "2px", border: "1px solid #e2e8f0" }}
              />
            </div>
          )}
          <span>{blog.author}</span>
        </div>
      </div>
    </div>
  );
}

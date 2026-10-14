import { Metadata } from "next";
import Image from "next/image";
import error_img from '@/assets/img/error/error.png';
import Link from "next/link";
import HeaderOne from "@/components/header/header-one";
import FooterOne from "@/components/footer/footer-one";

export const metadata: Metadata = {
  title: "Halaman Tidak Ditemukan — Tracer Study Kalimantan Timur",
};

export default function NotFound() {
  return (
    <>
      <HeaderOne transparent={false} />
      <main>
        <div className="tp-error-area pt-120 pb-120">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-10">
                <div className="tp-error-wrapper text-center">
                  <h4 className="tp-error-title">404</h4>
                  <div className="tp-error-thumb mb-50">
                    <Image src={error_img} alt="error-img" style={{ height: "auto" }} priority />
                  </div>
                  <div className="tp-error-content">
                    <h4 className="tp-error-title-sm">Halaman Tidak Ditemukan</h4>
                    <p>Mohon maaf, halaman yang Anda cari tidak tersedia atau tautan telah dipindahkan.</p>
                    <Link className="tp-btn" href="/">Kembali ke Beranda</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FooterOne />
    </>
  );
}

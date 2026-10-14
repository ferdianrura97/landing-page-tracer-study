import Image from "next/image";
import Link from "next/link";
import cta_shape from '@/assets/img/cta/cta-shape-1.png';
import { RightArrow } from "../svg";

export default function CtaTracerStudy() {
  return (
    <section
      className="cta-area tp-cta-bg grey-bg"
      data-background="assets/img/cta/cta-bg-1.jpg"
      style={{ backgroundImage: "url(/assets/img/cta/cta-bg-1.jpg)" }}
    >
      <div className="container">
        <div
          className="row align-items-center wow fadeInUp"
          data-wow-delay=".2s"
        >
          <div className="col-xxl-9 col-lg-8">
            <div className="tp-cta-wrapper d-flex align-items-center">
              <div className="tp-cta-logo">
                <Link href="/">
                  <div
                    style={{
                      width: "76px",
                      height: "76px",
                      borderRadius: "50%",
                      backgroundColor: "#ffffff",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "8px",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.3)",
                      border: "2px solid rgba(255,255,255,0.5)",
                      transition: "transform 0.25s ease",
                    }}
                  >
                    <Image
                      src="/assets/img/logo/logo_kaltim.png"
                      alt="Logo Pemprov Kalimantan Timur"
                      width={58}
                      height={58}
                      style={{
                        objectFit: "contain",
                      }}
                    />
                  </div>
                </Link>
              </div>
              <div className="tp-cta-content">
                <span>SUARAKAN PERJALANAN KARIERMU</span>
                <h3 className="tp-cta-title">
                  KONTRIBUSI NYATA ALUMNI UNTUK MASA DEPAN KALTIM.
                </h3>
              </div>
            </div>
          </div>
          <div className="col-xxl-3 col-lg-4">
            <div className="tp-cta-btn-wrap">
              <div className="tp-cta-btn text-lg-end">
                <Link className="tp-btn" href="/tracer">
                  Isi Kuesioner Sekarang{" "}
                  <span>
                    <RightArrow clr="currentColor" />
                  </span>
                </Link>
              </div>
              <div className="tp-cta-shape-1">
                <Image src={cta_shape} alt="shape" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

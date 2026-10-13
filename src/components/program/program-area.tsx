import Image from "next/image";
import ProgramSlider from "./slider/program-slider";
import shape_line from "@/assets/img/unlerline/program-1-svg-1.svg";
import { RightSmArrowThree } from "../svg";

export default function ProgramArea() {
  return (
    <section id="program" className="program-area mb-75">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="tp-program-wrap wow fadeInUp" data-wow-delay=".3s">
              <div className="tp-section text-center mb-55">
                <h5 className="tp-section-subtitle mb-15" style={{ color: "var(--tp-theme-primary)", fontWeight: 600 }}>
                  MEMBANGUN KALIMANTAN TIMUR UNTUK SEMUA
                </h5>
                <h3 className="tp-section-title">
                  <span>
                    {" "}
                    Program Prioritas{" "}
                    <Image
                      className="tp-underline-shape-2 wow bounceIn"
                      data-wow-duration="1.5s"
                      data-wow-delay=".4s"
                      src={shape_line}
                      alt="shape-line"
                    />
                  </span>{" "}
                  Pemprov Kaltim
                </h3>
                <p>
                  Kebijakan strategis Pemerintah Provinsi Kalimantan Timur dalam penjaminan biaya pendidikan,
                  penguatan daya saing tenaga kerja muda, dan pembangunan masa depan hijau yang berkelanjutan.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <ProgramSlider />
          </div>
          <div className="col-12">
            <div className="tp-program-dot text-center"></div>
          </div>
          <div className="col-12">
            <div className="tp-program-all text-center">
              <p>
                Data Tracer Study Anda menjadi rujukan penting evaluasi dan penyaluran program daerah.​​{" "}
                <a
                  href="https://kaltimprov.go.id/program-prioritas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fw-semibold text-primary"
                >
                  Lihat Seluruh Program Prioritas{" "}
                  <span>
                    <RightSmArrowThree />
                  </span>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import Image from "next/image";
import { RightArrowTwo, RightSmArrowTwo } from "../svg";

// icons
import ser_icon_1 from "@/assets/img/icon/service/service-icon-1.svg";
import ser_icon_2 from "@/assets/img/icon/service/service-icon-2.svg";
import ser_icon_3 from "@/assets/img/icon/service/service-icon-3.svg";
import ser_icon_4 from "@/assets/img/icon/service/service-icon-4.svg";
import ser_shape from '@/assets/img/shape/service/services-shape-1.png';

// service data: 4 Cabang Status Tamatan
const service_data = [
  {
    id: 1,
    icon: ser_icon_1,
    title: "Alumni <br/> Bekerja",
    text: "Penelusuran masa tunggu kerja, profil perusahaan/instansi, rentang penghasilan, dan keselarasan kejuruan.",
    link: "/tracer",
  },
  {
    id: 2,
    icon: ser_icon_2,
    title: "Melanjutkan <br/> Kuliah",
    text: "Penelusuran perguruan tinggi tujuan, program studi pilihan, jenjang D3/D4/S1, dan jalur masuk beasiswa.",
    link: "/tracer",
  },
  {
    id: 3,
    icon: ser_icon_3,
    title: "Alumni <br/> Wirausaha",
    text: "Pemetaan unit usaha rintisan, legalitas NIB/badan hukum, omzet bulanan, dan serapan tenaga kerja mandiri.",
    link: "/tracer",
  },
  {
    id: 4,
    icon: ser_icon_4,
    title: "Mencari <br/> Peluang Kerja",
    text: "Pemetaan kendala lulusan untuk penyaluran pelatihan kompetensi dan sertifikasi keahlian oleh Disdikbud.",
    link: "/tracer",
  },
];

export default function ServiceOne() {
  return (
    <section
      className="service-area tp-service-bg"
      style={{ backgroundImage: `url(/assets/img/bg/services-bg.jpg)` }}
    >
      <div className="container">
        <div className="row">
          {service_data.map((item) => (
            <div key={item.id} className="col-lg-3 col-md-6">
              <div
                className="tp-service-item text-center mb-40 wow fadeInUp"
                data-wow-delay={`.${item.id}s`}
              >
                <div className="tp-service-wrap">
                  <div className="tp-service-icon">
                    <span>
                      <Image src={item.icon} alt="service-icon" />
                    </span>
                  </div>
                  <h4 className="tp-service-title">
                    <Link
                      href={item.link}
                      dangerouslySetInnerHTML={{ __html: item.title }}
                    ></Link>
                  </h4>
                  <div className="tp-service-btn">
                    <Link href={item.link}>
                      <span>
                        <RightArrowTwo />
                      </span>
                    </Link>
                  </div>
                </div>
                <div className="tp-service-content">
                  <p>{item.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="tp-service-all text-center">
              <span>
                Menghubungkan lulusan SMA &amp; SMK dengan kemajuan masa depan{" "}
                <Link href="/tracer">
                  Kalimantan Timur <RightSmArrowTwo />
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="tp-service-shape">
        <div
          className="tp-service-shape-1 wow bounceIn"
          data-wow-duration="1.5s"
          data-wow-delay=".4s"
        >
          <Image
            src={ser_shape}
            alt="service-shape"
          />
        </div>
      </div>
    </section>
  );
}

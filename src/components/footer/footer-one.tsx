import Link from "next/link";
import { Email } from "../svg";

type IProps = { style_2?: boolean };

export default function FooterOne({ style_2 = false }: IProps) {
  return (
    <footer>
      <div className="tp-footer-main grey-bg pt-80 pb-55">
        <div className="container">
          <div className="row">
            <div className="col-xl-5 col-lg-5 col-md-6 mb-30">
              <div className="tp-footer-widget tp-footer-col-1">
                <h4 className="tp-footer-widget-title mb-20" style={{ color: '#1E856C' }}>
                  Tracer Study Kalimantan Timur
                </h4>
                <div className="tp-footer-widget-content mb-20">
                  <p style={{ lineHeight: 1.6, color: '#636b78' }}>
                    Sistem Penelusuran Tamatan Resmi jenjang SMA &amp; SMK di bawah naungan Dinas Pendidikan dan Kebudayaan Provinsi Kalimantan Timur untuk memetakan serapan lulusan ke dunia kerja, wirausaha, dan perguruan tinggi.
                  </p>
                </div>
                <div className="tp-footer-contact">
                  <span>Kontak Informasi / BKK:</span>
                  <a href="tel:0541743580">(0541) 743580</a>
                </div>
                <div className="tp-footer-contact-mail mt-2">
                  <a href="mailto:disdikbud@kaltimprov.go.id">
                    <span><Email /></span>
                    disdikbud@kaltimprov.go.id
                  </a>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-lg-3 col-md-6 mb-30">
              <div className="tp-footer-widget tp-footer-col-2">
                <h4 className="tp-footer-widget-title mb-20">Tautan Penting</h4>
                <div className="tp-footer-widget-link">
                  <ul>
                    <li><Link href="/">Beranda Utama</Link></li>
                    <li><Link href="/tracer">Formulir Kuesioner</Link></li>
                    <li><Link href="/#statistik">Statistik Serapan</Link></li>
                    <li><Link href="/#alur">Alur Pengisian</Link></li>
                    <li><Link href="/#faq">Tanya &amp; Jawab (FAQ)</Link></li>
                    <li><a href="http://localhost:3005/admin/login" target="_blank" rel="noreferrer">Portal Admin Disdik</a></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-xl-4 col-lg-4 col-md-12 mb-30">
              <div className="tp-footer-widget tp-footer-col-3">
                <h4 className="tp-footer-widget-title mb-20">Kantor Pelayanan</h4>
                <p style={{ color: '#636b78', lineHeight: 1.6 }}>
                  <strong>Dinas Pendidikan &amp; Kebudayaan Prov. Kaltim</strong><br />
                  Jl. Basuki Rahmat No. 5, Pelabuhan, Kec. Samarinda Kota, Kota Samarinda, Kalimantan Timur 75112
                </p>
                <div className="mt-3">
                  <span className="badge bg-success" style={{ padding: '8px 12px', fontSize: '12px' }}>
                    Wilayah: 10 Kabupaten &amp; Kota Se-Kaltim
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tp-footer-bottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="tp-footer-copyright text-center">
                <span>
                  © {new Date().getFullYear()} Pemerintah Provinsi Kalimantan Timur. Hak Cipta Dilindungi Undang-Undang.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

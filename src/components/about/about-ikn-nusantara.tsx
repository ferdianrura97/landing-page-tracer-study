import Image from 'next/image';
import { RightArrow, ShapeLine } from '../svg';

// images (sama persis dengan section tracer study)
import thumb_1 from '@/assets/img/about/about-thumb-1.jpg';
import thumb_2 from '@/assets/img/about/about-thumb-2.jpg';
import shape_1 from '@/assets/img/about/about-shape-1.jpg';
import shape_2 from '@/assets/img/about/about-shape-2.jpg';
import icon_1 from '@/assets/img/icon/about/about-icon-1.svg';
import icon_2 from '@/assets/img/icon/about/about-icon-2.svg';
import { CSSProperties } from 'react';
import CounterItem from '../counter/counter-item';
import Link from 'next/link';

// list data: Opsi 3 - SDM Unggul IKN
const ikn_lists = [
    {
        id: 1,
        icon: icon_1,
        title: 'Aspirasi Kurikulum Masa Depan',
        subtitle: 'Menyerap masukan alat, materi digital, & <br/> teknologi industri yang dibutuhkan di lapangan'
    },
    {
        id: 2,
        icon: icon_2,
        title: 'Monitoring Serapan Daerah',
        subtitle: 'Memetakan persebaran lulusan yang berkarir di <br/> sektor industri strategis IKN dan nasional'
    }
];

const imgStyle: CSSProperties = {
    height: 'auto'
};

export default function AboutIknNusantara() {
  return (
    <section className="about-area tp-about-bg grey-bg pb-60">
        <div className="container">
            <div className="row align-items-center">
                {/* Sisi Kiri: Konten Teks (DIBALIK) */}
                <div className="col-lg-6 order-2 order-lg-1">
                    <div className="tp-about-wrapper mb-60 wow fadeInLeft" data-wow-delay=".3s">
                    <div className="tp-section mb-40">
                        <h5 className="tp-section-subtitle">SDM Unggul Kaltim &amp; IKN</h5>
                        <h3 className="tp-section-title mb-30">Menyiapkan Talenta <br/> Masa Depan Menuju 
                            <span> Nusantara <ShapeLine/> </span>
                        </h3>
                        <p>Kehadiran Ibu Kota Nusantara (IKN) membuka peluang karir dan industri baru di Kalimantan Timur. Suara dan masukan alumni menjadi dasar penyusunan beasiswa Kaltim, pelatihan sertifikasi vokasi, serta kurikulum adaptif untuk melahirkan SDM lokal yang berdaya saing global.</p>
                    </div>
                    <div className="tp-about-list">
                        {ikn_lists.map((list) => (
                        <div key={list.id} className="tp-about-list-item d-flex align-items-center mb-35">
                            <div className="tp-about-list-icon">
                                <span>
                                    <Image src={list.icon} alt="about-icon"/>
                                </span>
                            </div>
                            <div className="tp-about-list-content">
                                <h5 className="tp-about-list-title">{list.title}</h5>
                                <p dangerouslySetInnerHTML={{__html: list.subtitle}}></p>
                            </div>
                        </div>
                        ))}
                        <div className="tp-about-btn pt-10">
                            <Link className="tp-btn tp-btn-sm" href="/tracer">Isi Kuesioner Sekarang 
                                <span>
                                <RightArrow/>
                             </span>
                            </Link>
                        </div>
                    </div>
                    </div>
                </div>

                {/* Sisi Kanan: Foto & Badge Counter (DIBALIK) */}
                <div className="col-lg-6 order-1 order-lg-2">
                    <div className="tp-about-wrap mb-60 wow fadeInRight" data-wow-delay=".3s">
                    <div className="tp-about-thumb-wrapper">
                        <div className="tp-about-thumb-1">
                            <Image src={thumb_1} alt="about-thumb" style={imgStyle}/>
                        </div>
                        <div className="tp-about-thumb-2">
                            <Image src={thumb_2} alt="about-thumb" style={imgStyle}/>
                        </div>
                    </div>
                    <div className="tp-about-shape">
                        <div className="tp-about-shape-1">
                            <Image src={shape_1} alt="shape"/>
                        </div>
                        <div className="tp-about-shape-2">
                            <Image src={shape_2} alt="shape"/>
                        </div>
                    </div>
                    <div className="tp-about-exprience">
                        <div className="tp-about-exprience-text d-flex">
                            <h3 className="tp-about-exprience-count">
                                <CounterItem min={0} max={100}/>
                            </h3>
                            <p>% Partisipasi <br/> Menuju IKN</p>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

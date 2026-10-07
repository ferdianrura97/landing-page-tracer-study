'use client';

import React, { useEffect, useState } from "react";
import CounterItem from "./counter-item";
import { fetchApi } from "@/lib/api";

interface RingkasanStatistik {
  total_alumni: number;
  total_responden: number;
  persentase_partisipasi: number;
  status_distribusi: {
    bekerja: number;
    kuliah: number;
    wirausaha: number;
    bekerja_kuliah_wirausaha: number;
    belum_bekerja: number;
  };
  sebaran_jenjang: Array<{ jenjang: string; _count: { jenjang: number } }>;
}

export default function CounterMilestoneTracer() {
  const [stats, setStats] = useState<RingkasanStatistik | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetchApi<{ sukses: boolean; data: RingkasanStatistik }>('/publik/statistik');
        if (res.sukses) setStats(res.data);
      } catch (err) {
        console.error('Gagal memuat statistik counter:', err);
      }
    }
    loadStats();
  }, []);

  const totalSekolah = stats?.sebaran_jenjang.reduce((acc, curr) => acc + curr._count.jenjang, 0) || 216;
  const totalResponden = stats?.total_responden ?? 20;
  const terserapKerja = (stats?.status_distribusi.bekerja ?? 7) + (stats?.status_distribusi.bekerja_kuliah_wirausaha ?? 2);
  const terserapKuliah = stats?.status_distribusi.kuliah ?? 7;
  const terserapWirausaha = stats?.status_distribusi.wirausaha ?? 2;

  const milestoneData = [
    { id: 1, count: totalSekolah, suffix: "", title: "Satuan Pendidikan" },
    { id: 2, count: totalResponden, suffix: "+", title: "Total Responden" },
    { id: 3, count: terserapKerja, suffix: "+", title: "Terserap Kerja" },
    { id: 4, count: terserapKuliah, suffix: "+", title: "Terserap Kuliah" },
    { id: 5, count: terserapWirausaha, suffix: "+", title: "Terserap Wirausaha" },
  ];

  return (
    <section className="counter-area tp-counter-wrap mb-90">
      <div className="container">
        <div
          className="tp-counter-bg wow fadeInUp"
          data-wow-delay=".3s"
          data-background="assets/img/bg/counter-bg.jpg"
          style={{ backgroundImage: `url(/assets/img/bg/counter-bg.jpg)`, padding: "10px 20px" }}
        >
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-3 justify-content-center">
            {milestoneData.map((item, idx) => {
              const isEnd = idx === milestoneData.length - 1;
              return (
                <div key={item.id} className="col">
                  <div className={`tp-counter-item text-center ${isEnd ? 'item-end' : ''}`} style={{ padding: "35px 10px" }}>
                    <h3 className="tp-counter-count mb-10" style={{ fontSize: "clamp(42px, 4vw, 64px)", lineHeight: 1.1 }}>
                      <CounterItem min={0} max={item.count} />
                      {item.suffix}
                    </h3>
                    <p style={{ fontSize: "15px", whiteSpace: "nowrap" }}>{item.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

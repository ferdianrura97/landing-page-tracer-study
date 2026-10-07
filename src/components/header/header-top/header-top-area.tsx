import React from "react";

export default function HeaderTopArea() {
  return (
    <div className="tp-header-top theme-bg">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-7 col-md-6">
            <div className="tp-heder-info d-flex justify-content-center justify-content-lg-start align-items-center">
              <div className="tp-header-info-item">
                <span className="text-white" style={{ fontSize: '13px', fontWeight: 500 }}>
                  <i className="fa-solid fa-graduation-cap me-2"></i>
                  Portal Resmi Tracer Study SMA &amp; SMK — Disdikbud Provinsi Kalimantan Timur
                </span>
              </div>
            </div>
          </div>
          <div className="col-lg-5 col-md-6 d-none d-md-block">
            <div className="tp-header-right-list d-flex justify-content-md-end align-items-center">
              <a href="/#statistik" style={{ fontSize: '12px', color: '#fff' }}>Statistik</a>
              <a href="/#faq" style={{ fontSize: '12px', color: '#fff' }}>Bantuan</a>
              <a 
                href="http://localhost:3005/admin/login" 
                target="_blank" 
                rel="noreferrer"
                style={{ fontSize: '12px', color: '#ffd166', fontWeight: 600 }}
              >
                <i className="fa-solid fa-lock me-1"></i>
                Login Admin
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import Image from "next/image";
import NavMenus from "./navbar/nav-menus";
import HeaderTopArea from "./header-top/header-top-area";
import HeaderStickyWrapper from "./header-sticky-provider/header-sticky-wrapper";
import OffcanvasButton from "./button/offcanvas-btn";

type IProps = {
  transparent?: boolean;
};

export default function HeaderOne({ transparent = true }: IProps) {
  return (
    <>
      <header className={`header-area ${transparent ? "tp-header-transparent" : "tp-header-solid"} p-relative`}>
        {/* header top start*/}
        <HeaderTopArea />
        {/* header top end */}

        <HeaderStickyWrapper>
          <div className="container">
            <div className="row align-items-center flex-nowrap justify-content-between">
              {/* BRAND LOGO */}
              <div className="col-auto">
                <div className="tp-header-logo-1 tp-header-logo">
                  <Link href="/" className="d-flex align-items-center gap-2 text-decoration-none" style={{ whiteSpace: 'nowrap' }}>
                    <Image
                      src="/assets/img/logo/logo_kaltim_removebg-preview.png"
                      alt="Logo Pemprov Kaltim"
                      width={44}
                      height={44}
                      style={{ objectFit: 'contain' }}
                      priority
                    />
                    <div className="tp-header-brand-text d-flex flex-column text-start">
                      <span className="brand-title">TRACER STUDY</span>
                      <span className="brand-sub">Disdikbud Kaltim</span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* NAVIGATION MENUS (1 ROW) */}
              <div className="col d-none d-xl-block">
                <div className="main-menu text-end">
                  <NavMenus />
                </div>
              </div>

              {/* CTA & MOBILE MENU */}
              <div className="col-auto">
                <div className="tp-header-contact d-flex align-items-center justify-content-end">
                  <div className="tp-header-btn d-none d-md-block">
                    <Link href="/tracer">Isi Kuesioner</Link>
                  </div>
                  <div className="tp-header-bar d-xl-none ml-20">
                    <OffcanvasButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </HeaderStickyWrapper>
      </header>

      {/* mobile offcanvas */}
      <div id="offcanvas-sidebar" />
      {/* mobile offcanvas */}
    </>
  );
}

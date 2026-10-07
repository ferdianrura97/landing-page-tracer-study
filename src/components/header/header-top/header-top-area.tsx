import React from "react";
import Link from "next/link";
import Image from "next/image";
import calling from "@/assets/img/icon/calling.svg";
import HeaderLanguage from "./header-language";

export default function HeaderTopArea() {
  return (
    <div className="tp-header-top theme-bg">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="tp-heder-info d-flex justify-content-center justify-content-lg-start align-items-center">
              <div className="tp-header-info-item d-none d-md-block">
                <span>
                  <a
                    href="https://www.instagram.com/disdikbudkaltim/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa-brands fa-instagram"></i>
                  </a>
                  <a
                    href="https://www.instagram.com/disdikbudkaltim/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    37K+ Followers
                  </a>
                </span>
              </div>
              <div className="tp-header-info-item">
                <span>
                  <a href="tel:+6285247350467">
                    <i>
                      <Image src={calling} alt="phone-img" />
                    </i>{" "}
                    +62 852-4735-0467
                  </a>
                </span>
              </div>
              <div className="tp-header-info-item">
                <div className="header-bottom__lang">
                  <ul>
                    <HeaderLanguage />
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 d-none d-lg-block">
            <div className="tp-header-right-list d-flex justify-content-md-end">
              <a href="#">SCHOOL</a>
              <a
                href="https://web.disdikbud.kaltimprov.go.id/"
                target="_blank"
                rel="noopener noreferrer"
              >
                DISDIK KALTIM
              </a>
              <Link href="/tracer">KUESIONER</Link>
              <a
                href="https://www.lapor.go.id/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LAPOR
              </a>
              <a
                href="https://www.instagram.com/disdikbudkaltim/"
                target="_blank"
                rel="noopener noreferrer"
              >
                SOSMED
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

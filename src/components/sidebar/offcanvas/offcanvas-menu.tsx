import Link from "next/link";
import menu_data from "@/data/menu-data";
import { useState } from "react";
import NavPagesDropdown from "@/components/header/navbar/dropdown/nav-pages-dropdown";
import NavHomeDropdown from "@/components/header/navbar/dropdown/nav-home-dropdown";

export default function OffcanvasMenu() {
  const [navTitle, setNavTitle] = useState("");
  //openMobileMenu
  const openMobileMenu = (menu: string) => {
    if (navTitle === menu) {
      setNavTitle("");
    } else {
      setNavTitle(menu);
    }
  };
  return (
    <div className="tp-main-menu-mobile d-xl-none">
      <nav className="tp-main-menu-content">
        <ul className="dropdown-opened">
          {menu_data.map((menu) => {
            const hasSubmenu = Boolean(
              menu.home_dropdown ||
              menu.pages_dropdown ||
              menu.sm_mega_menus ||
              (menu.dropdown_menus && menu.dropdown_menus.length > 0)
            );

            return (
              <li
                key={menu.id}
                className={`${hasSubmenu ? "has-dropdown" : ""} ${
                  menu.home_dropdown || menu.pages_dropdown ? "tp-static" : ""
                } ${navTitle === menu.title ? "dropdown-opened expanded" : ""}`.trim()}
              >
                <Link
                  href={menu.link}
                  className={`${menu.home_dropdown || menu.pages_dropdown ? "tp-static" : ""}`}
                >
                  {menu.title}{" "}
                  {hasSubmenu && (
                    <button
                      type="button"
                      onClick={() => openMobileMenu(menu.title)}
                      className={`dropdown-toggle-btn ${navTitle === menu.title ? "dropdown-opened" : ""}`}
                      aria-label="Toggle Submenu"
                    ></button>
                  )}
                </Link>

                {menu.home_dropdown && (
                  <div className="tp-megamenu-main" style={{ display: navTitle === menu.title ? "block" : "none" }}>
                    <NavHomeDropdown home_dropdown={menu.home_dropdown} />
                  </div>
                )}

                {menu.sm_mega_menus && (
                  <div className="tp-megamenu-main" style={{ display: navTitle === menu.title ? "block" : "none" }}>
                    <div className="megamenu-demo-small p-relative">
                      <div className="tp-megamenu-small-content">
                        <div className="row tp-gx-50">
                          <div className="col-xl-6">
                            <div className="tp-megamenu-list">
                              {menu.sm_mega_menus.slice(0, 4).map((dm) => (
                                <Link key={dm.id} href={dm.link}>
                                  {dm.title}
                                </Link>
                              ))}
                            </div>
                          </div>
                          <div className="col-xl-6">
                            <div className="tp-megamenu-list">
                              {menu.sm_mega_menus.slice(4).map((dm) => (
                                <Link key={dm.id} href={dm.link}>
                                  {dm.title}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {menu.pages_dropdown && (
                  <div className="tp-megamenu-main" style={{ display: navTitle === menu.title ? "block" : "none" }}>
                    <NavPagesDropdown pages_dropdown={menu.pages_dropdown} />
                  </div>
                )}

                {menu.dropdown_menus && (
                  <ul className="tp-submenu" style={{ display: navTitle === menu.title ? "block" : "none" }}>
                    {menu.dropdown_menus.map((dm) => (
                      <li key={dm.id}>
                        <Link href={dm.link}>{dm.title}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

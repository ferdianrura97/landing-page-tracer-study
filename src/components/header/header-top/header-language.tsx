'use client';
import React from "react";
import Image from "next/image";
import flagId from "@/assets/img/flag/flag-id.png";
import flagEn from "@/assets/img/flag/flag-en.png";
import { DownArrow } from "@/components/svg";

export default function HeaderLanguage() {
    const [openLang, setOpenLang] = React.useState(false);
    const [selectedLang, setSelectedLang] = React.useState<'id' | 'en'>('id');

    const handleSelect = (lang: 'id' | 'en') => {
        setSelectedLang(lang);
        setOpenLang(false);
    };

    return (
        <li>
            <a 
                onClick={(e) => {
                    e.preventDefault();
                    setOpenLang(!openLang);
                }} 
                id="header-bottom__lang-toggle" 
                href="#"
            >
                <span>
                    <Image 
                        src={selectedLang === 'id' ? flagId : flagEn} 
                        alt="flag-img" 
                        width={18} 
                        height={12} 
                        style={{ 
                            objectFit: "cover", 
                            verticalAlign: "middle", 
                            marginRight: "6px",
                            boxShadow: "0 0 0 1px rgba(0,0,0,0.15)",
                            borderRadius: "1px" 
                        }} 
                    />
                    {selectedLang === 'id' ? 'Indonesia' : 'English'}
                </span>
                <span>
                    <DownArrow />
                </span>
            </a>
            <ul className={`header-bottom__lang-submenu ${openLang ? "open" : ""}`} style={{ width: "135px" }}>
                <li>
                    <a 
                        href="#" 
                        onClick={(e) => {
                            e.preventDefault();
                            handleSelect('id');
                        }}
                        style={{ display: "flex", alignItems: "center", gap: "8px" }}
                    >
                        <Image 
                            src={flagId} 
                            alt="Indonesia" 
                            width={18} 
                            height={12} 
                            style={{ 
                                objectFit: "cover", 
                                boxShadow: "0 0 0 1px rgba(0,0,0,0.15)",
                                borderRadius: "1px" 
                            }} 
                        />
                        Indonesia
                    </a>
                </li>
                <li>
                    <a 
                        href="#" 
                        onClick={(e) => {
                            e.preventDefault();
                            handleSelect('en');
                        }}
                        style={{ display: "flex", alignItems: "center", gap: "8px" }}
                    >
                        <Image 
                            src={flagEn} 
                            alt="English" 
                            width={18} 
                            height={12} 
                            style={{ 
                                objectFit: "cover", 
                                boxShadow: "0 0 0 1px rgba(0,0,0,0.15)",
                                borderRadius: "1px" 
                            }} 
                        />
                        English
                    </a>
                </li>
            </ul>
        </li>
    );
}

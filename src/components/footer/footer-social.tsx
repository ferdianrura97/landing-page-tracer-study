'use client';
import React, { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";

interface SocialLinks {
  footer_facebook_url: string;
  footer_twitter_url: string;
  footer_linkedin_url: string;
  footer_youtube_url: string;
}

export default function FooterSocial() {
  const [links, setLinks] = useState<SocialLinks>({
    footer_facebook_url: "https://www.facebook.com",
    footer_twitter_url: "https://www.twitter.com",
    footer_linkedin_url: "https://www.linkedin.com",
    footer_youtube_url: "https://www.youtube.com",
  });

  useEffect(() => {
    async function loadSocial() {
      try {
        const res = await fetchApi<{ sukses: boolean; data: SocialLinks }>('/publik/pengaturan');
        if (res.sukses && res.data) {
          setLinks({
            footer_facebook_url: res.data.footer_facebook_url || "https://www.facebook.com",
            footer_twitter_url: res.data.footer_twitter_url || "https://www.twitter.com",
            footer_linkedin_url: res.data.footer_linkedin_url || "https://www.linkedin.com",
            footer_youtube_url: res.data.footer_youtube_url || "https://www.youtube.com",
          });
        }
      } catch {
        // Fallback default
      }
    }
    loadSocial();
  }, []);

  return (
    <>
      <a className="social-fb" href={links.footer_facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
        <i className="fa-brands fa-facebook-f"></i>
      </a>
      <a className="social-twit" href={links.footer_twitter_url} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
        <i className="fa-brands fa-twitter"></i>
      </a>
      <a className="social-lnkd" href={links.footer_linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
        <i className="fa-brands fa-linkedin-in"></i>
      </a>
      <a className="social-yout" href={links.footer_youtube_url} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
        <i className="fa-brands fa-youtube"></i>
      </a>
    </>
  );
}

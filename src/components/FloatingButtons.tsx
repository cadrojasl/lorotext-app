"use client";

import { MessageCircle } from "lucide-react";
import type { SiteConfigValues } from "@/lib/site-config";

export default function FloatingButtons({ config }: { config: SiteConfigValues }) {
  const { whatsapp_number, instagram_url, tiktok_url } = config;

  return (
    <div className="fixed bottom-6 right-4 flex flex-col gap-3 z-50">
      <a
        href={`https://wa.me/${whatsapp_number}?text=${encodeURIComponent("¡Hola! Quiero información sobre los productos Lorotext SYM.")}`}
        target="_blank" rel="noopener noreferrer"
        title="WhatsApp"
        className="rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
        style={{ width: 52, height: 52, backgroundColor: "#25D366" }}
      >
        <MessageCircle size={24} />
      </a>
      <a
        href={instagram_url} target="_blank" rel="noopener noreferrer"
        title="Instagram"
        className="rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
        style={{ width: 52, height: 52, background: "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)" }}
      >
        <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
        </svg>
      </a>
      <a
        href={tiktok_url} target="_blank" rel="noopener noreferrer"
        title="TikTok"
        className="flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform rounded-full font-black text-xs"
        style={{ width: 52, height: 52, backgroundColor: "#010101" }}
      >
        TT
      </a>
    </div>
  );
}

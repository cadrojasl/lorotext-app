import Link from "next/link";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { BRAND } from "@/lib/constants";
import type { SiteConfigValues } from "@/lib/site-config";

function IgIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

const CATS = ["Sábanas", "Cobijas", "Almohadas", "Ropa de Cama"];

export default function Footer({ config }: { config: SiteConfigValues }) {
  const { whatsapp_number, instagram_url, tiktok_url } = config;

  return (
    <footer className="text-white pt-12 pb-6" style={{ backgroundColor: "#0D5C5C" }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="rounded-full overflow-hidden bg-white shrink-0" style={{ width: 36, height: 36 }}>
                <Image src="/logo.png" alt="Lorotext SYM" width={36} height={36} className="object-contain" />
              </div>
              <span className="font-bold text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>LOROTEXT SYM</span>
            </div>
            <p className="text-sm mb-5 leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
              El placer de tu hogar. Ropa de cama premium para noches de descanso incomparables.
            </p>
            <div className="flex gap-2.5">
              <a href={instagram_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors">
                <IgIcon size={16} />
              </a>
              <a href={`https://wa.me/${whatsapp_number}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors">
                <MessageCircle size={16} />
              </a>
              <a href={tiktok_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors text-[11px] font-black">
                TT
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest mb-4" style={{ color: "#E67E22" }}>Categorías</h4>
            <ul className="space-y-2.5">
              {CATS.map((c) => (
                <li key={c}><Link href="/catalogo" className="text-sm hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.7)" }}>{c}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest mb-4" style={{ color: "#E67E22" }}>Contacto</h4>
            <ul className="space-y-2.5 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
              <li className="flex items-center gap-2">
                <MessageCircle size={13} />
                <a href={`https://wa.me/${whatsapp_number}`} className="hover:text-white transition-colors">
                  +{whatsapp_number}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <IgIcon size={13} />
                <a href={instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
              </li>
              <li className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>Lun – Sáb · 8 am – 6 pm</li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest mb-4" style={{ color: "#E67E22" }}>Información</h4>
            <ul className="space-y-2.5 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
              {[
                { label: "¿Cómo comprar?", href: "/info/como-comprar" },
                { label: "Envíos y tiempos", href: "/info/envios" },
              ].map(({ label, href }) => (
                <li key={label}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 text-center text-xs" style={{ borderTop: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.4)" }}>
          © {new Date().getFullYear()} Lorotext SYM · El placer de tu hogar · Todos los derechos reservados
        </div>
      </div>
    </footer>
  );
}

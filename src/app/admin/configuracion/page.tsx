"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Check, Loader2 } from "lucide-react";
import { AdminHeader, AdminTabs } from "@/components/AdminNav";
import { BRAND } from "@/lib/constants";
import { supabase } from "@/lib/supabase";

function IgIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

export default function AdminConfiguracionPage() {
  const router = useRouter();
  const [config, setConfig] = useState({ whatsapp_number: "", instagram_url: "", tiktok_url: "", promo_banner: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from("site_config").select("*").then(({ data }) => {
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((row: { key: string; value: string }) => { map[row.key] = row.value ?? ""; });
        setConfig({
          whatsapp_number: map.whatsapp_number ?? "",
          instagram_url: map.instagram_url ?? "",
          tiktok_url: map.tiktok_url ?? "",
          promo_banner: map.promo_banner ?? "",
        });
      }
      setLoading(false);
    });
  }, []);

  const logout = async () => { await supabase.auth.signOut(); router.push("/admin/login"); };

  const save = async () => {
    setSaving(true);
    const rows = Object.entries(config).map(([key, value]) => ({ key, value }));
    await supabase.from("site_config").upsert(rows, { onConflict: "key" });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <AdminHeader onLogout={logout} />

      <div className="max-w-7xl mx-auto px-4 py-7">
        <AdminTabs active="/admin/configuracion" />

        <div className="max-w-lg">
          <h2 className="font-bold text-lg text-gray-900 mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>Datos de contacto</h2>

          {loading ? (
            <div className="text-center py-12 text-gray-400"><Loader2 size={24} className="mx-auto animate-spin" /></div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2 flex items-center gap-2">
                  <MessageCircle size={13} style={{ color: "#25D366" }} /> Número de WhatsApp
                </label>
                <input value={config.whatsapp_number} onChange={(e) => setConfig({ ...config, whatsapp_number: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400" placeholder="57300..." />
                <p className="text-[10px] text-gray-400 mt-1">Código de país sin + (ej: 573001234567)</p>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2 flex items-center gap-2">
                  <IgIcon size={13} /> URL de Instagram
                </label>
                <input value={config.instagram_url} onChange={(e) => setConfig({ ...config, instagram_url: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400" placeholder="https://instagram.com/tu_usuario" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
                  <span className="font-black text-xs">TT</span> URL de TikTok
                </label>
                <input value={config.tiktok_url} onChange={(e) => setConfig({ ...config, tiktok_url: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400" placeholder="https://tiktok.com/@tu_usuario" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">Banner promocional</label>
                <input value={config.promo_banner} onChange={(e) => setConfig({ ...config, promo_banner: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400" placeholder="¡Envío gratis en pedidos mayores a $200.000!" />
              </div>
              <button onClick={save} disabled={saving}
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ backgroundColor: saved ? BRAND.GREEN : BRAND.BLUE }}
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : null}
                {saving ? "Guardando…" : saved ? "¡Guardado!" : "Guardar cambios"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

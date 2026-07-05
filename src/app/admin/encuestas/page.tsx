"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Package, Tag, Settings, Home, LogOut, Star, ThumbsUp, ThumbsDown, ClipboardList, Copy, Check } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { supabase } from "@/lib/supabase";

interface SurveyResponse {
  id: string;
  created_at: string;
  rating: number;
  name: string | null;
  comment: string | null;
  recommend: boolean | null;
  order_ref: string | null;
}

const BASE_URL = typeof window !== "undefined" ? window.location.origin : "";

export default function AdminEncuestasPage() {
  const router = useRouter();
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [refInput, setRefInput] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("survey_responses")
      .select("*")
      .order("created_at", { ascending: false });
    setResponses(data ?? []);
    setLoading(false);
  }

  const logout = async () => { await supabase.auth.signOut(); router.push("/admin/login"); };

  const surveyLink = `${BASE_URL}/encuesta${refInput ? `?ref=${encodeURIComponent(refInput)}` : ""}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(surveyLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const avg = responses.length
    ? (responses.reduce((s, r) => s + r.rating, 0) / responses.length).toFixed(1)
    : "—";

  const pctRecommend = responses.filter((r) => r.recommend !== null).length
    ? Math.round((responses.filter((r) => r.recommend === true).length / responses.filter((r) => r.recommend !== null).length) * 100)
    : null;

  const starDist = [5,4,3,2,1].map((s) => ({
    s,
    count: responses.filter((r) => r.rating === s).length,
    pct: responses.length ? Math.round((responses.filter((r) => r.rating === s).length / responses.length) * 100) : 0,
  }));

  const fmt = (iso: string) => new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="rounded-full overflow-hidden bg-white shrink-0 shadow-sm" style={{ width: 28, height: 28 }}>
              <Image src="/logo.png" alt="Lorotext" width={28} height={28} className="object-contain" />
            </div>
            <span className="font-bold text-sm text-gray-900">Lorotext SYM — Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1.5"><Home size={13} /> Ver sitio</Link>
            <button onClick={logout} className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1.5"><LogOut size={13} /> Salir</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-7">
        {/* Nav */}
        <div className="flex gap-1 bg-white rounded-2xl border border-gray-100 p-1.5 mb-6 w-fit flex-wrap">
          {[
            { href: "/admin/productos", label: "Productos", Icon: Package },
            { href: "/admin/categorias", label: "Categorías", Icon: Tag },
            { href: "/admin/configuracion", label: "Configuración", Icon: Settings },
            { href: "/admin/encuestas", label: "Encuestas", Icon: ClipboardList, active: true },
          ].map(({ href, label, Icon, active }) => (
            <Link key={href} href={href} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
              style={{ backgroundColor: active ? BRAND.BLUE : undefined, color: active ? "#fff" : "#6B7280" }}>
              <Icon size={13} /> {label}
            </Link>
          ))}
        </div>

        {/* Generador de link */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h3 className="font-bold text-sm text-gray-900 mb-1">Generar link de encuesta</h3>
          <p className="text-xs text-gray-500 mb-4">
            Copia este link y envíalo al cliente por WhatsApp cuando termine su compra. Puedes añadir una referencia opcional para identificar el pedido.
          </p>
          <div className="flex gap-2 flex-wrap">
            <input
              value={refInput}
              onChange={(e) => setRefInput(e.target.value)}
              placeholder="Referencia del pedido (opcional, ej: #001)"
              className="flex-1 min-w-48 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400"
            />
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-all"
              style={{ backgroundColor: copied ? BRAND.GREEN : BRAND.BLUE }}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "¡Copiado!" : "Copiar link"}
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 font-mono break-all">{surveyLink}</p>
        </div>

        {/* Métricas */}
        {responses.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
              <div className="font-black text-3xl mb-1" style={{ color: BRAND.GOLD }}>{avg}</div>
              <div className="flex justify-center gap-0.5 mb-1">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={12} fill={s <= Number(avg) ? BRAND.GOLD : "none"} stroke={BRAND.GOLD} strokeWidth={1.5} />
                ))}
              </div>
              <div className="text-xs text-gray-500">Promedio</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
              <div className="font-black text-3xl mb-1" style={{ color: BRAND.BLUE }}>{responses.length}</div>
              <div className="text-xs text-gray-500">Respuestas</div>
            </div>
            {pctRecommend !== null && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
                <div className="font-black text-3xl mb-1" style={{ color: BRAND.GREEN }}>{pctRecommend}%</div>
                <div className="text-xs text-gray-500">Recomendarían</div>
              </div>
            )}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Distribución</p>
              <div className="space-y-1">
                {starDist.map(({ s, count, pct }) => (
                  <div key={s} className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 w-2">{s}</span>
                    <Star size={9} fill={BRAND.GOLD} stroke="none" />
                    <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: BRAND.GOLD }} />
                    </div>
                    <span className="text-[10px] text-gray-400 w-5 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Lista */}
        <h2 className="font-bold text-lg text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Respuestas {responses.length > 0 && <span className="text-gray-400 font-normal text-base">({responses.length})</span>}
        </h2>

        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Cargando…</div>
        ) : responses.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <ClipboardList size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">Aún no hay respuestas</p>
            <p className="text-xs mt-1">Copia el link de arriba y envíalo a tus clientes por WhatsApp</p>
          </div>
        ) : (
          <div className="space-y-3">
            {responses.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} size={16} fill={s <= r.rating ? BRAND.GOLD : "none"} stroke={s <= r.rating ? BRAND.GOLD : "#D1D5DB"} strokeWidth={1.5} />
                      ))}
                    </div>
                    <span className="font-semibold text-sm text-gray-800">{r.name ?? "Anónimo"}</span>
                    {r.recommend !== null && (
                      r.recommend
                        ? <ThumbsUp size={14} style={{ color: BRAND.GREEN }} />
                        : <ThumbsDown size={14} style={{ color: BRAND.RED }} />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    {r.order_ref && <span className="font-mono bg-gray-100 px-2 py-0.5 rounded-full">ref: {r.order_ref}</span>}
                    <span>{fmt(r.created_at)}</span>
                  </div>
                </div>
                {r.comment && (
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed border-l-2 pl-3" style={{ borderColor: BRAND.GOLD }}>
                    "{r.comment}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

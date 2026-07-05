import Link from "next/link";
import Image from "next/image";
import { ChevronRight, MessageCircle } from "lucide-react";
import { BRAND } from "@/lib/constants";
import ProductCard from "@/components/ProductCard";
import CategoryCarousel from "@/components/CategoryCarousel";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getSiteConfig } from "@/lib/site-config";
import type { Category, Product } from "@/types";

async function getData() {
  try {
    const supabase = await createSupabaseServerClient();
    const [{ data: categories }, { data: products }, { data: catImages }, { data: surveys }] = await Promise.all([
      supabase.from("categories").select("*").eq("visible", true).order("sort_order"),
      supabase
        .from("products")
        .select("*, images:product_images(*), category:categories(*)")
        .eq("active", true)
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("products")
        .select("category_id, images:product_images(url, sort_order)")
        .eq("active", true)
        .not("images", "is", null)
        .order("created_at", { ascending: false }),
      supabase.from("survey_responses").select("rating"),
    ]);

    const catImageMap: Record<string, string> = {};
    for (const p of (catImages ?? [])) {
      if (!catImageMap[p.category_id]) {
        const imgs = (p.images as { url: string; sort_order: number }[]) ?? [];
        const sorted = [...imgs].sort((a, b) => a.sort_order - b.sort_order);
        if (sorted[0]?.url) catImageMap[p.category_id] = sorted[0].url;
      }
    }

    const surveyList = surveys ?? [];
    const surveyCount = surveyList.length;
    const surveyAvg = surveyCount
      ? (surveyList.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / surveyCount).toFixed(1)
      : null;

    return { categories: categories ?? [], products: products ?? [], catImageMap, surveyCount, surveyAvg };
  } catch {
    return { categories: [], products: [], catImageMap: {}, surveyCount: 0, surveyAvg: null };
  }
}

export default async function HomePage() {
  const [{ categories, products, catImageMap, surveyCount, surveyAvg }, config] = await Promise.all([getData(), getSiteConfig()]);
  const waNumber = config.whatsapp_number;

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ minHeight: "68vh" }}>
        <Image
          src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1600&h=900&fit=crop&auto=format"
          alt="Dormitorio elegante con ropa de cama Lorotext SYM"
          fill priority className="object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, rgba(27,77,158,0.88) 0%, rgba(27,77,158,0.55) 55%, rgba(27,77,158,0.1) 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 flex items-center" style={{ minHeight: "68vh" }}>
          <div className="text-white max-w-xl py-20">
            <p className="text-xs uppercase tracking-[0.25em] mb-4 font-medium" style={{ color: BRAND.GOLD }}>
              Nueva colección · 2025
            </p>
            <h1 className="font-bold leading-tight mb-5" style={{ fontSize: "clamp(2.2rem,5.5vw,3.8rem)", fontFamily: "'Playfair Display', serif" }}>
              El placer<br />de tu hogar
            </h1>
            <p className="text-lg text-blue-100 mb-8 max-w-md leading-relaxed">
              Sábanas, cobijas y almohadas premium para noches de descanso que mereces.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/catalogo" className="px-7 py-3.5 rounded-xl font-bold text-sm transition-all hover:brightness-110 shadow-md" style={{ backgroundColor: BRAND.GOLD, color: BRAND.BLACK }}>
                Ver catálogo
              </Link>
              <a
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent("¡Hola! Necesito asesoría para elegir ropa de cama.")}`}
                target="_blank" rel="noopener noreferrer"
                className="px-7 py-3.5 rounded-xl font-bold text-sm border-2 border-white/70 text-white backdrop-blur-sm transition-all hover:bg-white/15"
              >
                Hablar con asesor
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <div className="text-white py-5" style={{ backgroundColor: "#163E80" }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            [surveyCount > 0 ? `+ ${surveyCount.toLocaleString("es-CO")}` : "+ 0", "Clientes calificaron"],
            ["100%", "Algodón premium"],
            [surveyAvg ? `${surveyAvg} ★` : "— ★", "Calificación media"],
            ["24 h", "Respuesta WhatsApp"],
          ].map(([n, label]) => (
            <div key={label as string}>
              <div className="font-black text-xl" style={{ color: BRAND.GOLD }}>{n}</div>
              <div className="text-xs text-blue-300 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Categories ── */}
      {categories.length > 0 && (
        <section className="py-14">
          <div className="max-w-7xl mx-auto px-4 mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-bold text-3xl text-gray-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Nuestras categorías</h2>
              <p className="text-gray-500 text-sm">Encuentra exactamente lo que necesitas para tu hogar</p>
            </div>
            <Link href="/catalogo" className="text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all shrink-0" style={{ color: BRAND.BLUE }}>
              Ver todas <ChevronRight size={16} />
            </Link>
          </div>
          <CategoryCarousel categories={categories as Category[]} catImageMap={catImageMap} />
        </section>
      )}

      {/* ── Featured products ── */}
      {products.length > 0 && (
        <section className="py-16" style={{ backgroundColor: "#F8F6F1" }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-bold text-3xl text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Productos destacados</h2>
              <Link href="/catalogo" className="text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all" style={{ color: BRAND.BLUE }}>
                Ver todos <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {(products as Product[]).map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA banner ── */}
      <section className="py-16 text-center" style={{ backgroundColor: BRAND.BLUE }}>
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-white font-bold text-3xl mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            ¿Necesitas asesoría personalizada?
          </h2>
          <p className="text-blue-200 mb-8 text-sm leading-relaxed">
            Nuestro equipo está disponible de lunes a sábado por WhatsApp.<br />
            Te ayudamos a elegir la ropa de cama perfecta para tu hogar.
          </p>
          <a
            href={`https://wa.me/${waNumber}?text=${encodeURIComponent("¡Hola! Necesito asesoría para elegir ropa de cama Lorotext SYM.")}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-sm transition-all hover:opacity-90 shadow-lg"
            style={{ backgroundColor: "#25D366", color: "#fff" }}
          >
            <MessageCircle size={20} />
            Chatear por WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}

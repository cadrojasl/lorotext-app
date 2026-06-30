"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, Package, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { BRAND, fmt } from "@/lib/constants";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";
import type { Category, Product } from "@/types";
import { Suspense } from "react";

const STEP = 10000;
const MAX_PRICE = 500000;

function PriceRange({ min, max, onMin, onMax }: { min: number; max: number; onMin: (v: number) => void; onMax: (v: number) => void }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-xs text-gray-500">
        <span>{fmt(min)}</span>
        <span>{fmt(max)}</span>
      </div>
      <div className="space-y-2">
        <div>
          <label className="text-[10px] text-gray-400 mb-1 block">Desde</label>
          <input
            type="range" min={0} max={MAX_PRICE} step={STEP} value={min}
            onChange={(e) => { const v = Number(e.target.value); if (v <= max - STEP) onMin(v); }}
            className="w-full accent-blue-700 h-1.5"
          />
        </div>
        <div>
          <label className="text-[10px] text-gray-400 mb-1 block">Hasta</label>
          <input
            type="range" min={0} max={MAX_PRICE} step={STEP} value={max}
            onChange={(e) => { const v = Number(e.target.value); if (v >= min + STEP) onMax(v); }}
            className="w-full accent-blue-700 h-1.5"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <input
          type="number" value={min} step={STEP} min={0} max={max - STEP}
          onChange={(e) => { const v = Number(e.target.value); if (v >= 0 && v <= max - STEP) onMin(v); }}
          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-blue-400"
        />
        <input
          type="number" value={max} step={STEP} min={min + STEP} max={MAX_PRICE}
          onChange={(e) => { const v = Number(e.target.value); if (v >= min + STEP && v <= MAX_PRICE) onMax(v); }}
          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-blue-400"
        />
      </div>
    </div>
  );
}

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("categoria") ?? "all";

  const [search, setSearch] = useState("");
  const [cat, setCat] = useState(initialCat);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [showFilters, setShow] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: cats }, { data: prods }] = await Promise.all([
        supabase.from("categories").select("*").eq("visible", true).order("sort_order"),
        supabase
          .from("products")
          .select("*, images:product_images(*), category:categories(*)")
          .eq("active", true)
          .order("created_at", { ascending: false }),
      ]);
      setCategories(cats ?? []);
      setProducts(prods ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => products.filter((p) => {
    const catSlug = (p.category as Category | undefined)?.slug ?? p.category_id;
    if (cat !== "all" && catSlug !== cat && p.category_id !== cat) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.description_short?.toLowerCase().includes(search.toLowerCase())) return false;
    if (p.price !== undefined && p.price !== null) {
      if (p.price < minPrice || p.price > maxPrice) return false;
    }
    return true;
  }), [search, cat, minPrice, maxPrice, products]);

  const hasActiveFilters = cat !== "all" || search || minPrice !== 0 || maxPrice !== MAX_PRICE;
  const clearFilters = () => { setCat("all"); setSearch(""); setMinPrice(0); setMaxPrice(MAX_PRICE); };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-700 transition-colors">Inicio</Link>
        <ChevronRight size={12} />
        <span style={{ color: BRAND.BLUE }} className="font-medium">Catálogo</span>
      </div>

      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Catálogo</h1>
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
          {loading ? "Cargando…" : `${filtered.length} producto${filtered.length !== 1 ? "s" : ""}`}
        </span>
      </div>

      <div className="relative mb-5">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar sábanas, cobijas, almohadas…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400 bg-white"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => setShow(!showFilters)} className="md:hidden flex items-center gap-2 text-xs font-semibold px-4 py-2.5 border border-gray-200 rounded-xl bg-white">
          <Filter size={14} /> {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
        </button>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-medium">
            <X size={12} /> Limpiar filtros
          </button>
        )}
      </div>

      <div className="flex gap-6">
        <aside className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-56 shrink-0`}>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Categoría</p>
            <div className="space-y-2 mb-6">
              {([{ id: "all", slug: "all", name: "Todas las categorías" }, ...categories]).map((c) => (
                <label key={c.id} className="flex items-center gap-2.5 cursor-pointer text-sm">
                  <input type="radio" name="cat" checked={cat === (c.slug ?? c.id)} onChange={() => setCat(c.slug ?? c.id)} className="accent-blue-700" />
                  <span className={cat === (c.slug ?? c.id) ? "font-semibold" : "text-gray-600"}>{c.name}</span>
                </label>
              ))}
            </div>

            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Rango de precio</p>
            <PriceRange min={minPrice} max={maxPrice} onMin={setMinPrice} onMax={setMaxPrice} />

            {hasActiveFilters && (
              <button onClick={clearFilters} className="mt-5 w-full text-xs text-center py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                Limpiar filtros
              </button>
            )}
          </div>
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 aspect-[4/5] animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Package size={44} className="mx-auto mb-4 opacity-30" />
              <p className="font-medium">No se encontraron productos</p>
              <p className="text-xs mt-1">Intenta con otros filtros</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return <Suspense><CatalogContent /></Suspense>;
}

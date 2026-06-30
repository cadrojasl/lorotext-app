"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, MessageCircle, Minus, Plus, ShoppingCart, Check, Package } from "lucide-react";
import { BRAND, fmt } from "@/lib/constants";
import { useCart } from "@/components/CartProvider";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";
import type { Product, Category } from "@/types";

interface Props {
  slug: string;
  waNumber: string;
}

export default function ProductClient({ slug, waNumber }: Props) {
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("products")
        .select("*, images:product_images(*), category:categories(*)")
        .eq("slug", slug)
        .eq("active", true)
        .single();

      if (data) {
        setProduct(data);
        setSize(data.sizes?.[0] ?? "");
        setColor(data.colors?.[0] ?? "");
        const { data: rel } = await supabase
          .from("products")
          .select("*, images:product_images(*), category:categories(*)")
          .eq("category_id", data.category_id)
          .eq("active", true)
          .neq("id", data.id)
          .limit(4);
        setRelated(rel ?? []);
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
          <div className="aspect-square bg-gray-100 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 rounded-xl w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
            <div className="h-10 bg-gray-100 rounded-xl w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <Package size={48} className="mx-auto mb-4 text-gray-300" />
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Producto no encontrado</h1>
        <Link href="/catalogo" className="text-blue-600 hover:underline">← Volver al catálogo</Link>
      </div>
    );
  }

  const disc = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;
  const images = product.images ?? [];
  const catName = (product.category as Category | undefined)?.name ?? "";

  const handleAdd = () => {
    addItem(product, size, color, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(`¡Hola! Me interesa: ${product.name} (${size} / ${color}) x${qty}. Precio: ${fmt(product.price * qty)}. ¿Está disponible?`)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-700 transition-colors">Inicio</Link>
        <ChevronRight size={12} />
        <Link href="/catalogo" className="hover:text-blue-700 transition-colors">Catálogo</Link>
        <ChevronRight size={12} />
        <span className="truncate max-w-[160px] font-medium" style={{ color: BRAND.BLUE }}>{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
        {/* Gallery */}
        <div>
          <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-square mb-3">
            {images[imgIdx] && <Image src={images[imgIdx].url} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />}
            {disc > 0 && <span className="absolute top-4 left-4 text-white text-sm font-bold px-3 py-1 rounded-full" style={{ backgroundColor: BRAND.RED }}>-{disc}% OFF</span>}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2.5 flex-wrap">
              {images.map((img, i) => (
                <button key={i} onClick={() => setImgIdx(i)} className={`relative rounded-xl overflow-hidden w-20 h-20 border-2 transition-all ${i === imgIdx ? "border-blue-600 scale-95" : "border-transparent opacity-60 hover:opacity-100"}`}>
                  <Image src={img.url} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {catName && <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">{catName}</p>}
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>{product.name}</h1>
          {product.description_short && <p className="text-gray-500 text-sm mb-5 leading-relaxed">{product.description_short}</p>}

          <div className="flex items-baseline gap-3 mb-7">
            <span className="text-3xl font-black" style={{ color: BRAND.BLUE }}>{fmt(product.price)}</span>
            {product.original_price && <span className="text-gray-300 line-through text-lg">{fmt(product.original_price)}</span>}
            {disc > 0 && <span className="text-xs font-bold px-2 py-1 rounded-full text-white" style={{ backgroundColor: BRAND.RED }}>-{disc}%</span>}
          </div>

          {product.sizes.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5">Tamaño — <span className="font-semibold text-gray-700 normal-case tracking-normal">{size}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => setSize(s)} className={`px-4 py-2 rounded-xl text-sm border-2 font-medium transition-all ${size === s ? "text-white border-transparent" : "border-gray-200 text-gray-600 hover:border-gray-400"}`} style={size === s ? { backgroundColor: BRAND.BLUE } : {}}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {product.colors.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5">Color — <span className="font-semibold text-gray-700 normal-case tracking-normal">{color}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button key={c} onClick={() => setColor(c)} className={`px-3 py-2 rounded-xl text-sm border-2 font-medium transition-all ${color === c ? "border-transparent" : "border-gray-200 text-gray-600 hover:border-gray-300"}`} style={color === c ? { backgroundColor: BRAND.GOLD, color: BRAND.BLACK } : {}}>{c}</button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5">Cantidad</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"><Minus size={13} /></button>
              <span className="w-8 text-center font-bold text-lg">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-9 h-9 rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"><Plus size={13} /></button>
            </div>
          </div>

          <div className="flex gap-3 mb-3">
            <button onClick={handleAdd} className="flex-1 py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 flex items-center justify-center gap-2" style={{ backgroundColor: added ? BRAND.GREEN : BRAND.BLUE }}>
              {added ? <><Check size={16} /> Agregado</> : "Agregar al carrito"}
            </button>
            <Link href="/carrito" className="px-4 py-3.5 rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition-colors flex items-center">
              <ShoppingCart size={18} className="text-gray-600" />
            </Link>
          </div>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90" style={{ backgroundColor: "#25D366" }}>
            <MessageCircle size={18} /> Pedir directo por WhatsApp
          </a>

          {product.description_long && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-3">Descripción del producto</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{product.description_long}</p>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-7" style={{ fontFamily: "'Playfair Display', serif" }}>También te puede gustar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}

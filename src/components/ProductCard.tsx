"use client";

import Image from "next/image";
import Link from "next/link";
import { BRAND, fmt } from "@/lib/constants";
import type { Product } from "@/types";
import { useCart } from "@/components/CartProvider";

interface Props {
  product: Product;
}

function discount(p: Product) {
  if (!p.original_price) return 0;
  return Math.round(((p.original_price - p.price) / p.original_price) * 100);
}

export default function ProductCard({ product }: Props) {
  const disc = discount(product);
  const { addItem } = useCart();
  const imgUrl = product.images?.[0]?.url ?? "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop&auto=format";
  const catName = product.category?.name ?? "";

  const handleAddToCart = () => {
    addItem(product, product.sizes[0] ?? "", product.colors[0] ?? "", 1);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col">
      <Link href={`/producto/${product.slug}`} className="relative overflow-hidden bg-gray-100 aspect-[4/3] block">
        <Image
          src={imgUrl}
          alt={product.name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {disc > 0 && (
          <span className="absolute top-2.5 left-2.5 text-white text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: BRAND.RED }}>
            -{disc}%
          </span>
        )}
        {product.featured && (
          <span className="absolute top-2.5 right-2.5 text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: BRAND.GOLD, color: BRAND.BLACK }}>
            ★ Destacado
          </span>
        )}
      </Link>
      <div className="p-4 flex flex-col flex-1">
        {catName && <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{catName}</p>}
        <Link href={`/producto/${product.slug}`} className="text-left font-semibold text-gray-900 text-sm mb-1 line-clamp-2 flex-1 hover:text-blue-700 transition-colors">
          {product.name}
        </Link>
        {product.description_short && (
          <p className="text-xs text-gray-400 mb-3 line-clamp-1">{product.description_short}</p>
        )}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-bold text-lg" style={{ color: BRAND.BLUE }}>{fmt(product.price)}</span>
          {product.original_price && (
            <span className="text-gray-300 line-through text-sm">{fmt(product.original_price)}</span>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/producto/${product.slug}`}
            className="flex-1 border border-gray-200 text-gray-600 text-xs py-2 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-colors font-medium text-center"
          >
            Ver detalle
          </Link>
          <button
            onClick={handleAddToCart}
            className="flex-1 text-white text-xs py-2 rounded-xl font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: BRAND.GREEN }}
          >
            + Carrito
          </button>
        </div>
      </div>
    </div>
  );
}

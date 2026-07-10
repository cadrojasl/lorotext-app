"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BRAND } from "@/lib/constants";
import type { Category } from "@/types";

interface Props {
  categories: Category[];
  catImageMap: Record<string, string>;
}

export default function CategoryCarousel({ categories, catImageMap }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const check = () => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    check();
    el.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => { el.removeEventListener("scroll", check); window.removeEventListener("resize", check); };
  }, [categories]);

  const scroll = (dir: "left" | "right") => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 600 : -600, behavior: "smooth" });
  };

  return (
    <div className="relative group max-w-7xl mx-auto px-4">
      {/* Flecha izquierda */}
      <button
        onClick={() => scroll("left")}
        aria-label="Anterior"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-gray-700 hover:bg-white transition-all"
        style={{ opacity: canLeft ? 1 : 0, pointerEvents: canLeft ? "auto" : "none", transition: "opacity 0.2s" }}
      >
        <ChevronLeft size={20} />
      </button>

      {/* Flecha derecha */}
      <button
        onClick={() => scroll("right")}
        aria-label="Siguiente"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 shadow-lg flex items-center justify-center text-gray-700 hover:bg-white transition-all"
        style={{ opacity: canRight ? 1 : 0, pointerEvents: canRight ? "auto" : "none", transition: "opacity 0.2s" }}
      >
        <ChevronRight size={20} />
      </button>

      {/* Fade lateral izquierdo */}
      {canLeft && (
        <div className="absolute left-0 top-0 bottom-4 w-16 z-[5] pointer-events-none"
          style={{ background: "linear-gradient(to right, rgba(255,255,255,0.9) 0%, transparent 100%)" }} />
      )}
      {/* Fade lateral derecho */}
      {canRight && (
        <div className="absolute right-0 top-0 bottom-4 w-16 z-[5] pointer-events-none"
          style={{ background: "linear-gradient(to left, rgba(255,255,255,0.9) 0%, transparent 100%)" }} />
      )}

      {/* Track */}
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((cat) => {
          const imgSrc = cat.image_url || catImageMap[cat.id] || null;
          return (
            <Link
              key={cat.id}
              href={`/catalogo?categoria=${cat.slug}`}
              className="group/card relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all shrink-0 snap-start"
              style={{ width: 220, height: 290 }}
            >
              {imgSrc ? (
                <Image
                  src={imgSrc}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                  sizes="220px"
                />
              ) : (
                <div className="w-full h-full" style={{ background: `linear-gradient(160deg, ${BRAND.BLUE} 0%, #0D5C5C 100%)` }} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div className="font-bold text-base leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {cat.name}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, ChevronLeft, Minus, Plus, Trash2, MessageCircle } from "lucide-react";
import { BRAND, buildWAMsg, fmt } from "@/lib/constants";
import { useCart } from "@/components/CartProvider";

export default function CartClient({ waNumber }: { waNumber: string }) {
  const { items, totalPrice, updateQty, removeItem } = useCart();

  const waUrl = buildWAMsg(
    items.map((i) => ({ name: i.product.name, size: i.size, color: i.color, qty: i.qty, price: i.product.price })),
    waNumber
  );

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <ShoppingCart size={64} className="mx-auto mb-5 text-gray-200" />
        <h2 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Tu carrito está vacío
        </h2>
        <p className="text-gray-400 text-sm mb-8">Agrega productos para comenzar tu pedido</p>
        <Link href="/catalogo" className="px-8 py-3.5 rounded-xl text-white font-bold text-sm inline-block" style={{ backgroundColor: BRAND.BLUE }}>
          Explorar catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-7">
        <Link href="/catalogo" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ChevronLeft size={20} className="text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          Mi carrito · {items.length} ítem{items.length !== 1 ? "s" : ""}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item, idx) => {
            const imgUrl = item.product.images?.[0]?.url ?? "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=400&fit=crop&auto=format";
            return (
              <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 items-start">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <Image src={imgUrl} alt={item.product.name} fill className="object-cover" sizes="80px" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-gray-900 truncate">{item.product.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5 mb-3">{item.size} · {item.color}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 border border-gray-200 rounded-xl px-2 py-1">
                      <button onClick={() => updateQty(idx, item.qty - 1)} className="text-gray-400 hover:text-gray-700 transition-colors"><Minus size={12} /></button>
                      <span className="text-sm font-bold w-5 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(idx, item.qty + 1)} className="text-gray-400 hover:text-gray-700 transition-colors"><Plus size={12} /></button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-sm" style={{ color: BRAND.BLUE }}>{fmt(item.product.price * item.qty)}</span>
                      <button onClick={() => removeItem(idx)} className="text-gray-300 hover:text-red-500 transition-colors p-1"><Trash2 size={15} /></button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20">
            <h2 className="font-bold text-base text-gray-900 mb-4">Resumen del pedido</h2>
            <div className="space-y-2 mb-4">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between text-xs text-gray-500">
                  <span className="truncate max-w-[150px]">{item.product.name} ×{item.qty}</span>
                  <span className="shrink-0 ml-2">{fmt(item.product.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 mb-5">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-gray-900">Total estimado</span>
                <span className="font-black text-xl" style={{ color: BRAND.BLUE }}>{fmt(totalPrice)}</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Envío y pago coordinados por WhatsApp</p>
            </div>
            <a
              href={waUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 w-full py-4 rounded-xl font-black text-white text-sm transition-all hover:opacity-90 shadow-md"
              style={{ backgroundColor: "#25D366" }}
            >
              <MessageCircle size={20} />
              Finalizar pedido por WhatsApp
            </a>
            <p className="text-[10px] text-center text-gray-400 mt-3 leading-relaxed">
              Un asesor confirmará disponibilidad,<br />forma de pago y datos de envío.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

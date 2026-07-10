import Link from "next/link";
import { ChevronRight, ShoppingCart, MessageCircle, Package, Check } from "lucide-react";
import { BRAND } from "@/lib/constants";

const steps = [
  { icon: ShoppingCart, title: "1. Elige tus productos", text: "Explora nuestro catálogo y selecciona los productos que deseas. Puedes elegir la talla, color y cantidad." },
  { icon: ShoppingCart, title: "2. Agrégalos al carrito", text: 'Haz clic en "Agregar al carrito" en cada producto. Tu carrito se guarda automáticamente mientras navegas.' },
  { icon: MessageCircle, title: "3. Finaliza tu pedido por WhatsApp", text: 'Ve al carrito y haz clic en "Finalizar pedido". Te redirigirá a WhatsApp con el resumen de tu compra ya escrito.' },
  { icon: Check, title: "4. Confirmamos y coordinamos", text: "Un asesor confirmará disponibilidad, te indicará el valor del envío y acordará el método de pago y entrega." },
];

export default function ComoComprarPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
        <Link href="/" className="hover:text-blue-700">Inicio</Link>
        <ChevronRight size={12} />
        <span style={{ color: BRAND.BLUE }} className="font-medium">¿Cómo comprar?</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>¿Cómo comprar?</h1>
      <p className="text-gray-500 mb-10">Comprar en Lorotext SYM es fácil y seguro. Solo necesitas WhatsApp.</p>

      <div className="space-y-6 mb-12">
        {steps.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex gap-5 bg-white rounded-2xl border border-gray-100 p-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${BRAND.BLUE}15` }}>
              <Icon size={22} style={{ color: BRAND.BLUE }} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-2xl p-6 mb-8">
        <h2 className="font-bold text-gray-900 mb-3">Métodos de pago aceptados</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          {["Transferencia bancaria (Nequi, Daviplata, PSE)", "Tarjeta de crédito o débito", "Pago contra entrega (ciudad de Medellín)", "Efectivo en punto de venta"].map((m) => (
            <li key={m} className="flex items-center gap-2"><Check size={14} style={{ color: BRAND.GREEN }} /> {m}</li>
          ))}
        </ul>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500 mb-4">¿Tienes dudas? Contáctanos directamente.</p>
        <Link href="/catalogo" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm" style={{ backgroundColor: BRAND.BLUE }}>
          <ShoppingCart size={16} /> Ir al catálogo
        </Link>
      </div>
    </div>
  );
}

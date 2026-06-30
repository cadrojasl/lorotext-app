import Link from "next/link";
import { ChevronRight, RefreshCw, X, Check, Clock } from "lucide-react";
import { BRAND } from "@/lib/constants";

export default function CambiosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
        <Link href="/" className="hover:text-blue-700">Inicio</Link>
        <ChevronRight size={12} />
        <span style={{ color: BRAND.BLUE }} className="font-medium">Política de cambios</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Política de cambios</h1>
      <p className="text-gray-500 mb-10">Tu satisfacción es lo más importante para nosotros. Si algo no está bien, lo solucionamos.</p>

      <div className="space-y-6 mb-10">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock size={20} style={{ color: BRAND.BLUE }} />
            <h2 className="font-bold text-gray-900">Plazo para cambios</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Tienes <strong>5 días calendario</strong> desde la fecha de recibo del producto para solicitar un cambio o devolución.
            Pasado este plazo no podremos gestionar la solicitud.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Check size={20} style={{ color: BRAND.GREEN }} />
            <h2 className="font-bold text-gray-900">Casos en que aplica el cambio</h2>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            {[
              "El producto llegó defectuoso o dañado.",
              "El producto recibido no corresponde al pedido.",
              "El producto tiene falla de fabricación.",
              "La talla o medida no coincide con la indicada en la descripción.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check size={14} className="mt-0.5 shrink-0" style={{ color: BRAND.GREEN }} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <X size={20} style={{ color: BRAND.RED }} />
            <h2 className="font-bold text-gray-900">Casos en que NO aplica el cambio</h2>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            {[
              "El producto ya fue lavado o usado.",
              "El empaque original fue abierto sin reportar el problema.",
              "El deterioro es por mal uso o cuidado inadecuado del cliente.",
              "La solicitud se realizó fuera del plazo de 5 días.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <X size={14} className="mt-0.5 shrink-0" style={{ color: BRAND.RED }} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <RefreshCw size={20} style={{ color: BRAND.GOLD }} />
            <h2 className="font-bold text-gray-900">¿Cómo solicitar el cambio?</h2>
          </div>
          <ol className="space-y-3 text-sm text-gray-600">
            {[
              "Contáctanos por WhatsApp dentro de los 5 días siguientes a la entrega.",
              "Envía fotos del producto mostrando el defecto o error.",
              "Te indicaremos cómo proceder con el envío de devolución.",
              "Una vez recibamos el producto, haremos el cambio o reembolso según corresponda.",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: BRAND.GOLD }}>
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="bg-blue-50 rounded-2xl p-5 text-center">
        <p className="text-sm text-gray-600 mb-3">¿Necesitas hacer un cambio? Escríbenos ahora.</p>
        <Link href="/catalogo" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm" style={{ backgroundColor: BRAND.BLUE }}>
          Contactar por WhatsApp
        </Link>
      </div>
    </div>
  );
}

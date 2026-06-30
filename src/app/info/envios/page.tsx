import Link from "next/link";
import { ChevronRight, Package, Clock, MapPin, AlertCircle } from "lucide-react";
import { BRAND } from "@/lib/constants";

export default function EnviosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
        <Link href="/" className="hover:text-blue-700">Inicio</Link>
        <ChevronRight size={12} />
        <span style={{ color: BRAND.BLUE }} className="font-medium">Envíos y tiempos</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Envíos y tiempos</h1>
      <p className="text-gray-500 mb-10">Hacemos despachos a todo Colombia a través de empresas de transporte confiables.</p>

      <div className="grid md:grid-cols-2 gap-5 mb-10">
        {[
          { icon: MapPin, title: "Medellín y área metropolitana", detail: "Entrega en 1–2 días hábiles. Pago contra entrega disponible.", color: BRAND.GREEN },
          { icon: Package, title: "Resto de Colombia", detail: "Envíos por Servientrega o Coordinadora. 3–7 días hábiles según destino.", color: BRAND.BLUE },
          { icon: Clock, title: "Horario de despacho", detail: "Los pedidos confirmados antes del mediodía se despachan el mismo día (lunes a viernes).", color: BRAND.GOLD },
          { icon: AlertCircle, title: "Zonas de difícil acceso", detail: "Para municipios remotos consultar disponibilidad antes de confirmar el pedido.", color: BRAND.RED },
        ].map(({ icon: Icon, title, detail, color }) => (
          <div key={title} className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}18` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 mb-1">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
        <h2 className="font-bold text-gray-900 mb-4">Costo de envío</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                <th className="text-left py-2 pr-4 font-semibold">Destino</th>
                <th className="text-left py-2 font-semibold">Costo aproximado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                ["Medellín", "Gratis en pedidos sobre $200.000 · $8.000 en pedidos menores"],
                ["Antioquia (fuera de Medellín)", "$12.000 – $18.000"],
                ["Bogotá / Cali / Barranquilla", "$15.000 – $22.000"],
                ["Resto de Colombia", "$18.000 – $30.000 (varía según peso y distancia)"],
              ].map(([dest, cost]) => (
                <tr key={dest}>
                  <td className="py-3 pr-4 font-medium text-gray-700">{dest}</td>
                  <td className="py-3 text-gray-500">{cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-4">* Los valores son aproximados. El costo exacto se confirma al momento del pedido.</p>
      </div>

      <div className="text-center">
        <Link href="/catalogo" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm" style={{ backgroundColor: BRAND.BLUE }}>
          <Package size={16} /> Ver catálogo
        </Link>
      </div>
    </div>
  );
}

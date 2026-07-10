import Link from "next/link";
import { ChevronRight, MapPin, Clock, MessageCircle, CreditCard } from "lucide-react";
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
      <p className="text-gray-500 mb-10">Hacemos entrega directa en Bogotá y Soacha. Para otras ciudades escríbenos.</p>

      <div className="grid md:grid-cols-2 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${BRAND.GREEN}18` }}>
            <MapPin size={18} style={{ color: BRAND.GREEN }} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900 mb-1">Bogotá y Soacha</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Hacemos entrega directa a domicilio. Sin intermediarios, sin sorpresas.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${BRAND.BLUE}18` }}>
            <Clock size={18} style={{ color: BRAND.BLUE }} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900 mb-1">Entrega el mismo día</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Una vez confirmado el pedido, la entrega se realiza el mismo día.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${BRAND.GOLD}18` }}>
            <CreditCard size={18} style={{ color: BRAND.GOLD }} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900 mb-2">Formas de pago</h3>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Contra entrega (pago al recibir)</li>
              <li>• Pago anticipado por transferencia</li>
              <li>• Nequi · Daviplata · PSE</li>
              <li>• Tarjeta de crédito o débito</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${BRAND.RED}18` }}>
            <MessageCircle size={18} style={{ color: BRAND.RED }} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900 mb-1">Otras ciudades</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Para envíos fuera de Bogotá y Soacha escríbenos por WhatsApp y coordinamos el envío.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
        <h2 className="font-bold text-gray-900 mb-4">Costo de envío</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                <th className="text-left py-2 pr-4 font-semibold">Zona</th>
                <th className="text-left py-2 font-semibold">Costo</th>
                <th className="text-left py-2 font-semibold">Tiempo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr>
                <td className="py-3 pr-4 font-medium text-gray-700">Bogotá</td>
                <td className="py-3 text-gray-500">$15.000 – $20.000</td>
                <td className="py-3 text-gray-500">Mismo día</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-gray-700">Soacha</td>
                <td className="py-3 text-gray-500">$15.000 – $20.000</td>
                <td className="py-3 text-gray-500">Mismo día</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-gray-700">Otras ciudades</td>
                <td className="py-3 text-gray-500">A convenir</td>
                <td className="py-3 text-gray-500">Consultar</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 rounded-2xl p-5 text-center">
        <p className="text-sm text-gray-600 mb-3">¿Estás fuera de Bogotá o Soacha? Escríbenos y lo coordinamos.</p>
        <Link href="/catalogo" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm" style={{ backgroundColor: BRAND.BLUE }}>
          <MessageCircle size={16} /> Hablar con asesor
        </Link>
      </div>
    </div>
  );
}

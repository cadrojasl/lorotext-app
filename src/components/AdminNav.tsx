import Link from "next/link";
import Image from "next/image";
import { Package, Tag, Settings, ClipboardList, Home, LogOut } from "lucide-react";
import { BRAND } from "@/lib/constants";

const TABS = [
  { href: "/admin/productos",    label: "Productos",    Icon: Package },
  { href: "/admin/categorias",   label: "Categorías",   Icon: Tag },
  { href: "/admin/configuracion",label: "Configuración",Icon: Settings },
  { href: "/admin/encuestas",    label: "Encuestas",    Icon: ClipboardList },
];

export function AdminHeader({ onLogout }: { onLogout: () => void }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="rounded-full overflow-hidden bg-white shrink-0 shadow-sm" style={{ width: 28, height: 28 }}>
            <Image src="/logo.png" alt="Lorotext" width={28} height={28} className="object-contain" />
          </div>
          <span className="font-bold text-sm text-gray-900">Lorotext SYM — Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1.5">
            <Home size={13} /> Ver sitio
          </Link>
          <button onClick={onLogout} className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1.5">
            <LogOut size={13} /> Salir
          </button>
        </div>
      </div>
    </header>
  );
}

export function AdminTabs({ active }: { active: string }) {
  return (
    <div className="flex gap-1 bg-white rounded-2xl border border-gray-100 p-1.5 mb-6 w-fit flex-wrap">
      {TABS.map(({ href, label, Icon }) => (
        <Link
          key={href}
          href={href}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
          style={{
            backgroundColor: active === href ? BRAND.BLUE : undefined,
            color: active === href ? "#fff" : "#6B7280",
          }}
        >
          <Icon size={13} /> {label}
        </Link>
      ))}
    </div>
  );
}

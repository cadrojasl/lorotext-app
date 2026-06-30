"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { useCart } from "@/components/CartProvider";
import Logo from "@/components/Logo";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCart();

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/catalogo", label: "Catálogo" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/"><Logo size={42} /></Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium transition-colors"
                style={{ color: pathname === href ? BRAND.BLUE : "#4B5563" }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link href="/carrito" className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
              <ShoppingCart size={20} style={{ color: BRAND.BLUE }} />
              {totalItems > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold px-1"
                  style={{ backgroundColor: BRAND.RED }}
                >
                  {totalItems}
                </span>
              )}
            </Link>
            <button onClick={() => setOpen(!open)} className="md:hidden p-2.5 rounded-xl hover:bg-gray-100">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden py-3 border-t border-gray-100 space-y-1">
            {[...navLinks, { href: "/carrito", label: "Carrito" }].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="block w-full text-left px-3 py-2.5 text-sm rounded-xl font-medium transition-colors hover:bg-gray-50"
                style={{ color: pathname === href ? BRAND.BLUE : "#374151" }}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

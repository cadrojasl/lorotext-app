"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash, Star, Package, Tag, X, Check, Upload, Loader2 } from "lucide-react";
import { AdminHeader, AdminTabs } from "@/components/AdminNav";
import { BRAND, fmt } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import type { Product, Category, ProductImage } from "@/types";

type FormState = {
  name: string; category_id: string; description_short: string; description_long: string;
  price: string; original_price: string; sizes: string; colors: string; material: string;
  featured: boolean; active: boolean;
};

const EMPTY_FORM: FormState = {
  name: "", category_id: "", description_short: "", description_long: "",
  price: "", original_price: "", sizes: "", colors: "", material: "", featured: false, active: true,
};

export default function AdminProductosPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShow] = useState(false);
  const [editProd, setEditP] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pendingImages, setPendingImages] = useState<ProductImage[]>([]);
  const [saveError, setSaveError] = useState("");

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from("products").select("*, images:product_images(*), category:categories(*)").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").eq("visible", true).order("sort_order"),
    ]);
    setProducts(prods ?? []);
    setCategories(cats ?? []);
    if (cats && cats.length > 0) setForm((f) => ({ ...f, category_id: cats[0].id }));
    setLoading(false);
  }

  const logout = async () => { await supabase.auth.signOut(); router.push("/admin/login"); };

  const openNew = () => {
    setEditP(null);
    setForm({ ...EMPTY_FORM, category_id: categories[0]?.id ?? "" });
    setPendingImages([]);
    setSaveError("");
    setShow(true);
  };

  const openEdit = (p: Product) => {
    setEditP(p);
    setForm({
      name: p.name, category_id: p.category_id,
      description_short: p.description_short ?? "", description_long: p.description_long ?? "",
      price: String(p.price), original_price: p.original_price ? String(p.original_price) : "",
      sizes: p.sizes.join(", "), colors: p.colors.join(", "), material: p.material ?? "",
      featured: p.featured, active: p.active,
    });
    setPendingImages(p.images ?? []);
    setSaveError("");
    setShow(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const oversized = files.filter((f) => f.size > 819200);
    if (oversized.length) { setSaveError(`${oversized.length > 1 ? "Algunas imágenes superan" : "La imagen supera"} los 800 KB permitidos.`); return; }
    setUploading(true);
    for (const file of files) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file);
      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(path);
        setPendingImages((prev) => [...prev, { id: crypto.randomUUID(), product_id: "", url: publicUrl, sort_order: prev.length }]);
      }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (id: string) => setPendingImages((prev) => prev.filter((img) => img.id !== id));

  const saveForm = async () => {
    if (!form.name || !form.price) { setSaveError("Nombre y precio son obligatorios."); return; }
    setSaving(true);
    setSaveError("");

    const slug = form.name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const payload = {
      category_id: form.category_id,
      name: form.name,
      slug,
      description_short: form.description_short || null,
      description_long: form.description_long || null,
      price: Number(form.price),
      original_price: form.original_price ? Number(form.original_price) : null,
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
      material: form.material || null,
      featured: form.featured,
      active: form.active,
    };

    let productId = editProd?.id;

    if (editProd) {
      const { error } = await supabase.from("products").update(payload).eq("id", editProd.id);
      if (error) { setSaveError(error.message); setSaving(false); return; }
    } else {
      const { data, error } = await supabase.from("products").insert(payload).select().single();
      if (error) { setSaveError(error.message); setSaving(false); return; }
      productId = data.id;
    }

    // Sync images: delete old, insert new
    if (productId) {
      await supabase.from("product_images").delete().eq("product_id", productId);
      const imgRows = pendingImages.map((img, i) => ({ product_id: productId!, url: img.url, sort_order: i }));
      if (imgRows.length) await supabase.from("product_images").insert(imgRows);
    }

    await loadData();
    setShow(false);
    setSaving(false);
  };

  const toggleActive = async (p: Product) => {
    await supabase.from("products").update({ active: !p.active }).eq("id", p.id);
    setProducts((prev) => prev.map((x) => x.id === p.id ? { ...x, active: !p.active } : x));
  };

  const toggleFeatured = async (p: Product) => {
    await supabase.from("products").update({ featured: !p.featured }).eq("id", p.id);
    setProducts((prev) => prev.map((x) => x.id === p.id ? { ...x, featured: !p.featured } : x));
  };

  const deleteProd = async (p: Product) => {
    if (!confirm(`¿Eliminar "${p.name}"?`)) return;
    await supabase.from("products").delete().eq("id", p.id);
    setProducts((prev) => prev.filter((x) => x.id !== p.id));
  };

  const activeCount = products.filter((p) => p.active).length;
  const featuredCount = products.filter((p) => p.featured).length;

  return (
    <div>
      <AdminHeader onLogout={logout} />

      <div className="max-w-7xl mx-auto px-4 py-7">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
          {[
            { label: "Productos activos", value: activeCount, Icon: Package, color: BRAND.BLUE },
            { label: "Destacados en home", value: featuredCount, Icon: Star, color: BRAND.GOLD },
            { label: "Categorías", value: categories.length, Icon: Tag, color: BRAND.GREEN },
            { label: "Total productos", value: products.length, Icon: Package, color: "#9CA3AF" },
          ].map(({ label, value, Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-2"><span className="text-xs text-gray-400">{label}</span><Icon size={16} style={{ color }} /></div>
              <div className="text-2xl font-black text-gray-900">{value}</div>
            </div>
          ))}
        </div>

        <AdminTabs active="/admin/productos" />

        {/* Table */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Gestión de productos</h2>
          <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-bold" style={{ backgroundColor: BRAND.GREEN }}>
            <Plus size={14} /> Nuevo producto
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400"><Loader2 size={28} className="mx-auto animate-spin mb-2" /><p className="text-sm">Cargando productos…</p></div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center text-gray-400"><Package size={36} className="mx-auto mb-3 opacity-30" /><p className="text-sm">No hay productos aún. Crea el primero.</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr style={{ backgroundColor: "#F8F6F1" }}>
                    {["Producto", "Categoría", "Precio", "★", "Estado", "Acciones"].map((h) => (
                      <th key={h} className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 ${["★","Estado","Acciones"].includes(h) ? "text-center" : "text-left"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((p) => {
                    const imgUrl = p.images?.[0]?.url ?? null;
                    return (
                      <tr key={p.id} className={`hover:bg-gray-50/60 transition-colors ${!p.active ? "opacity-50" : ""}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                              {imgUrl && <Image src={imgUrl} alt={p.name} fill className="object-cover" sizes="40px" />}
                            </div>
                            <span className="font-semibold text-xs text-gray-900 max-w-[160px] truncate">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">{(p.category as Category | undefined)?.name ?? "—"}</td>
                        <td className="px-4 py-3 font-black text-xs" style={{ color: BRAND.BLUE }}>{fmt(p.price)}</td>
                        <td className="px-4 py-3 text-center">
                          <button onClick={() => toggleFeatured(p)}>
                            <Star size={15} fill={p.featured ? BRAND.GOLD : "none"} style={{ color: p.featured ? BRAND.GOLD : "#D1D5DB" }} />
                          </button>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button onClick={() => toggleActive(p)} className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors ${p.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                            {p.active ? "Activo" : "Inactivo"}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"><Edit size={13} /></button>
                            <button onClick={() => deleteProd(p)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><Trash size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                {editProd ? "Editar producto" : "Nuevo producto"}
              </h3>
              <button onClick={() => setShow(false)} className="p-2 rounded-xl hover:bg-gray-100"><X size={16} /></button>
            </div>

            <div className="space-y-4">
              {/* Images */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">Imágenes del producto</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {pendingImages.map((img) => (
                    <div key={img.id} className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 group">
                      <Image src={img.url} alt="" fill className="object-cover" sizes="80px" />
                      <button onClick={() => removeImage(img.id)} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <X size={14} className="text-white" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors text-xs gap-1"
                  >
                    {uploading ? <Loader2 size={16} className="animate-spin" /> : <><Upload size={16} /><span>Subir</span></>}
                  </button>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                <p className="text-[10px] text-gray-400">La primera imagen se usa como portada.</p>
              </div>

              {/* Fields */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1.5">Nombre del producto *</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Sábana King Premium…" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1.5">Categoría</label>
                <select value={form.category_id} onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none">
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1.5">Descripción corta</label>
                <input value={form.description_short} onChange={(e) => setForm((f) => ({ ...f, description_short: e.target.value }))} placeholder="Una línea descriptiva…" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1.5">Precio (COP) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1.5">Precio original</label>
                  <input type="number" value={form.original_price} onChange={(e) => setForm((f) => ({ ...f, original_price: e.target.value }))} placeholder="Opcional" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1.5">Descripción larga</label>
                <textarea rows={3} value={form.description_long} onChange={(e) => setForm((f) => ({ ...f, description_long: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none resize-none" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1.5">Tamaños (separados por coma)</label>
                <input value={form.sizes} onChange={(e) => setForm((f) => ({ ...f, sizes: e.target.value }))} placeholder="Twin, Full, Queen, King" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1.5">Colores (separados por coma)</label>
                <input value={form.colors} onChange={(e) => setForm((f) => ({ ...f, colors: e.target.value }))} placeholder="Blanco, Azul, Gris" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1.5">Material</label>
                <input value={form.material} onChange={(e) => setForm((f) => ({ ...f, material: e.target.value }))} placeholder="Algodón, microfibra…" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none" />
              </div>
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} className="accent-blue-700 w-4 h-4" />
                  Destacado en home
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="accent-blue-700 w-4 h-4" />
                  Activo / visible
                </label>
              </div>
              {saveError && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{saveError}</p>}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShow(false)} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancelar</button>
              <button onClick={saveForm} disabled={saving} className="flex-1 py-3 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60" style={{ backgroundColor: BRAND.BLUE }}>
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                {saving ? "Guardando…" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

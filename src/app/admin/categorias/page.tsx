"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Package, Tag, Settings, Home, LogOut, Loader2, Plus, Edit, Trash, X, Check, Upload } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import type { Category } from "@/types";

type FormState = { name: string; slug: string; image_url: string; sort_order: string; visible: boolean };
const EMPTY: FormState = { name: "", slug: "", image_url: "", sort_order: "0", visible: true };

function toSlug(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function AdminCategoriasPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    setCategories(data ?? []);
    setLoading(false);
  }

  const logout = async () => { await supabase.auth.signOut(); router.push("/admin/login"); };

  const openNew = () => { setEditCat(null); setForm(EMPTY); setError(""); setShowForm(true); };
  const openEdit = (c: Category) => {
    setEditCat(c);
    setForm({ name: c.name, slug: c.slug, image_url: c.image_url ?? "", sort_order: String(c.sort_order), visible: c.visible });
    setError(""); setShowForm(true);
  };

  const handleNameChange = (name: string) => {
    setForm((f) => ({ ...f, name, slug: editCat ? f.slug : toSlug(name) }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 819200) { setError("La imagen no debe superar 800 KB."); return; }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `categorias/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("product-images").upload(path, file);
    if (upErr) { setError(upErr.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(path);
    setForm((f) => ({ ...f, image_url: publicUrl }));
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const save = async () => {
    if (!form.name.trim()) { setError("El nombre es obligatorio."); return; }
    setSaving(true); setError("");
    const payload = { name: form.name.trim(), slug: form.slug || toSlug(form.name), image_url: form.image_url || null, sort_order: Number(form.sort_order) || 0, visible: form.visible };
    if (editCat) {
      const { error: e } = await supabase.from("categories").update(payload).eq("id", editCat.id);
      if (e) { setError(e.message); setSaving(false); return; }
    } else {
      const { error: e } = await supabase.from("categories").insert(payload);
      if (e) { setError(e.message); setSaving(false); return; }
    }
    await load(); setShowForm(false); setSaving(false);
  };

  const deleteCat = async (c: Category) => {
    if (!confirm(`¿Eliminar "${c.name}"? Los productos asociados quedarán sin categoría.`)) return;
    await supabase.from("categories").delete().eq("id", c.id);
    setCategories((prev) => prev.filter((x) => x.id !== c.id));
  };

  const toggleVisible = async (c: Category) => {
    await supabase.from("categories").update({ visible: !c.visible }).eq("id", c.id);
    setCategories((prev) => prev.map((x) => x.id === c.id ? { ...x, visible: !c.visible } : x));
  };

  return (
    <div>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="rounded-full overflow-hidden bg-white shrink-0 shadow-sm" style={{ width: 28, height: 28 }}>
              <Image src="/logo.png" alt="Lorotext" width={28} height={28} className="object-contain" />
            </div>
            <span className="font-bold text-sm text-gray-900">Lorotext SYM — Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1.5"><Home size={13} /> Ver sitio</Link>
            <button onClick={logout} className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1.5"><LogOut size={13} /> Salir</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-7">
        <div className="flex gap-1 bg-white rounded-2xl border border-gray-100 p-1.5 mb-6 w-fit">
          {[
            { href: "/admin/productos", label: "Productos", Icon: Package, active: false },
            { href: "/admin/categorias", label: "Categorías", Icon: Tag, active: true },
            { href: "/admin/configuracion", label: "Configuración", Icon: Settings, active: false },
          ].map(({ href, label, Icon, active }) => (
            <Link key={href} href={href} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
              style={{ backgroundColor: active ? BRAND.BLUE : undefined, color: active ? "#fff" : "#6B7280" }}>
              <Icon size={13} /> {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Categorías</h2>
          <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-bold" style={{ backgroundColor: BRAND.GREEN }}>
            <Plus size={14} /> Nueva categoría
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400"><Loader2 size={24} className="mx-auto animate-spin mb-2" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div key={c.id} className={`bg-white rounded-2xl border border-gray-100 overflow-hidden flex transition-opacity ${!c.visible ? "opacity-55" : ""}`}>
                <div className="relative w-24 h-24 shrink-0 bg-gray-100">
                  {c.image_url && <Image src={c.image_url} alt={c.name} fill className="object-cover" sizes="96px" />}
                  {!c.image_url && <div className="w-full h-full flex items-center justify-center text-gray-300"><Tag size={24} /></div>}
                </div>
                <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 truncate">{c.name}</h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">/{c.slug} · orden {c.sort_order}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.visible ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {c.visible ? "Visible" : "Oculta"}
                    </span>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"><Edit size={12} /></button>
                      <button onClick={() => toggleVisible(c)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                        {c.visible ? <EyeOff size={12} /> : <Eye size={12} />}
                      </button>
                      <button onClick={() => deleteCat(c)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><Trash size={12} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                {editCat ? "Editar categoría" : "Nueva categoría"}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-gray-100"><X size={16} /></button>
            </div>

            <div className="space-y-4">
              {/* Image */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">Imagen de portada</label>
                <div className="flex items-center gap-3">
                  {form.image_url && (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <Image src={form.image_url} alt="" fill className="object-cover" sizes="80px" />
                    </div>
                  )}
                  <button onClick={() => fileRef.current?.click()} disabled={uploading}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-300 text-xs text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors">
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    {uploading ? "Subiendo…" : "Subir imagen"}
                  </button>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <p className="text-[10px] text-gray-400 mt-1">Máx. 800 KB. Recomendado: 600×400 px.</p>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1.5">Nombre *</label>
                <input value={form.name} onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ej: Sábanas" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1.5">Slug (URL)</label>
                <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="sabanas" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 font-mono" />
                <p className="text-[10px] text-gray-400 mt-1">Se genera automáticamente. Solo letras, números y guiones.</p>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1.5">Orden de aparición</label>
                <input type="number" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none" />
              </div>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.visible} onChange={(e) => setForm((f) => ({ ...f, visible: e.target.checked }))} className="accent-blue-700 w-4 h-4" />
                Visible en el catálogo
              </label>

              {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancelar</button>
              <button onClick={save} disabled={saving} className="flex-1 py-3 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60" style={{ backgroundColor: BRAND.BLUE }}>
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

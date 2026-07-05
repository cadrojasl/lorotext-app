"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Star, Send, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { BRAND } from "@/lib/constants";

function SurveyForm() {
  const searchParams = useSearchParams();
  const orderRef = searchParams.get("ref") ?? "";

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [recommend, setRecommend] = useState<boolean | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!rating) { setError("Por favor selecciona una calificación."); return; }
    setSending(true); setError("");
    const { error: err } = await supabase.from("survey_responses").insert({
      rating,
      name: name.trim() || null,
      comment: comment.trim() || null,
      recommend: recommend,
      order_ref: orderRef || null,
    });
    if (err) { setError("No se pudo enviar. Intenta de nuevo."); setSending(false); return; }
    setDone(true);
  };

  const starLabels = ["", "Malo", "Regular", "Bueno", "Muy bueno", "¡Excelente!"];

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#F8F6F1" }}>
        <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-md text-center">
          <CheckCircle size={56} className="mx-auto mb-5" style={{ color: BRAND.GREEN }} />
          <h2 className="font-bold text-2xl text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            ¡Gracias por tu opinión!
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Tu calificación nos ayuda a mejorar y a seguir ofreciéndote la mejor ropa de cama para tu hogar.
          </p>
          <div className="flex justify-center gap-1 mt-6">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} size={28} fill={s <= rating ? BRAND.GOLD : "none"} stroke={s <= rating ? BRAND.GOLD : "#D1D5DB"} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ backgroundColor: "#F8F6F1" }}>
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 text-center" style={{ background: `linear-gradient(135deg, ${BRAND.BLUE} 0%, #0d2d6e 100%)` }}>
          <div className="w-16 h-16 rounded-full overflow-hidden bg-white mx-auto mb-4 shadow-md">
            <Image src="/logo.png" alt="Lorotext SYM" width={64} height={64} className="object-contain w-full h-full" />
          </div>
          <h1 className="font-bold text-xl text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            ¿Cómo fue tu experiencia?
          </h1>
          <p className="text-blue-200 text-xs">Tu opinión nos ayuda a mejorar · Lorotext SYM</p>
        </div>

        <div className="px-8 py-7 space-y-6">
          {/* Estrellas */}
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Calificación general *</p>
            <div className="flex justify-center gap-2 mb-2">
              {[1,2,3,4,5].map((s) => (
                <button
                  key={s}
                  onClick={() => setRating(s)}
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-transform hover:scale-110 active:scale-95"
                >
                  <Star
                    size={36}
                    fill={(hover || rating) >= s ? BRAND.GOLD : "none"}
                    stroke={(hover || rating) >= s ? BRAND.GOLD : "#D1D5DB"}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>
            {(hover || rating) > 0 && (
              <p className="text-sm font-semibold" style={{ color: BRAND.GOLD }}>
                {starLabels[hover || rating]}
              </p>
            )}
          </div>

          {/* Recomendaría */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">¿Recomendarías Lorotext SYM?</p>
            <div className="flex gap-3">
              {[{ val: true, label: "Sí, claro 👍" }, { val: false, label: "No por ahora 👎" }].map(({ val, label }) => (
                <button
                  key={String(val)}
                  onClick={() => setRecommend(val)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-all"
                  style={{
                    borderColor: recommend === val ? BRAND.BLUE : "#E5E7EB",
                    backgroundColor: recommend === val ? `${BRAND.BLUE}12` : "transparent",
                    color: recommend === val ? BRAND.BLUE : "#6B7280",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Nombre */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
              Tu nombre <span className="font-normal normal-case">(opcional)</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: María González"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Comentario */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
              Cuéntanos más <span className="font-normal normal-case">(opcional)</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="¿Qué te gustó? ¿Qué podríamos mejorar?"
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-400 resize-none"
            />
          </div>

          {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <button
            onClick={submit}
            disabled={sending || !rating}
            className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: BRAND.BLUE }}
          >
            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {sending ? "Enviando…" : "Enviar calificación"}
          </button>

          <p className="text-center text-[10px] text-gray-400">
            Tu respuesta es anónima y nos ayuda a mejorar el servicio.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function EncuestaPage() {
  return <Suspense><SurveyForm /></Suspense>;
}

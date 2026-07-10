import { createSupabaseServerClient } from "@/lib/supabase-server";

export interface SiteConfigValues {
  whatsapp_number: string;
  instagram_url: string;
  tiktok_url: string;
  promo_banner: string;
  footer_description: string;
  business_hours: string;
}

const DEFAULTS: SiteConfigValues = {
  whatsapp_number: "",
  instagram_url: "",
  tiktok_url: "",
  promo_banner: "",
  footer_description: "El placer de tu hogar. Ropa de cama premium para noches de descanso incomparables.",
  business_hours: "Lun – Sáb · 8 am – 6 pm",
};

export async function getSiteConfig(): Promise<SiteConfigValues> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.from("site_config").select("key, value");
    if (!data) return DEFAULTS;
    const map: Record<string, string> = {};
    data.forEach((row: { key: string; value: string }) => { map[row.key] = row.value ?? ""; });
    return {
      whatsapp_number: map.whatsapp_number || DEFAULTS.whatsapp_number,
      instagram_url: map.instagram_url || DEFAULTS.instagram_url,
      tiktok_url: map.tiktok_url || DEFAULTS.tiktok_url,
      promo_banner: map.promo_banner ?? "",
      footer_description: map.footer_description || DEFAULTS.footer_description,
      business_hours: map.business_hours || DEFAULTS.business_hours,
    };
  } catch {
    return DEFAULTS;
  }
}

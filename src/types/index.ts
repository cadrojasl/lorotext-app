export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  sort_order: number;
  visible: boolean;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description_short: string | null;
  description_long: string | null;
  price: number;
  original_price: number | null;
  sizes: string[];
  colors: string[];
  material: string | null;
  featured: boolean;
  active: boolean;
  created_at: string;
  category?: Category;
  images?: ProductImage[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  sort_order: number;
}

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  qty: number;
}

export interface SiteConfig {
  whatsapp_number: string;
  instagram_url: string;
  tiktok_url: string;
  promo_banner: string;
}

import { getSiteConfig } from "@/lib/site-config";
import ProductClient from "./ProductClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const config = await getSiteConfig();
  return <ProductClient slug={slug} waNumber={config.whatsapp_number} />;
}

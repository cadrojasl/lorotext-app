import { getSiteConfig } from "@/lib/site-config";
import CartClient from "./CartClient";

export default async function CartPage() {
  const config = await getSiteConfig();
  return <CartClient waNumber={config.whatsapp_number} />;
}

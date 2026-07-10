export const BRAND = {
  BLUE: "#1A8C8C",   // teal del círculo del logo
  RED: "#D63031",    // rojo del pecho del loro
  GREEN: "#3FAE49",  // verde del cuerpo del loro
  GOLD: "#F2A900",   // dorado del pico/cabeza del loro
  BLACK: "#1A1A1A",
  WHITE: "#FFFFFF",
} as const;

export const fmt = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

export function buildWAMsg(
  items: { name: string; size: string; color: string; qty: number; price: number }[],
  waNumber: string
) {
  const lines = items.map(
    (i) => `• ${i.name} (${i.size} / ${i.color}) x${i.qty} = ${fmt(i.price * i.qty)}`
  );
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const msg = `¡Hola Lorotext SYM! Quiero hacer el siguiente pedido:\n\n${lines.join("\n")}\n\n*Total: ${fmt(total)}*\n\nPor favor confirmar disponibilidad y datos de envío. ¡Gracias! 🙏`;
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
}

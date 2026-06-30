# Lorotext SYM — contexto del proyecto

## Qué es esto
Sitio web de venta de productos para el hogar (sábanas, cobijas, almohadas, ropa de cama) de la marca Lorotext SYM. Catálogo público sin login + carrito que redirige a WhatsApp (sin pasarela de pagos) + panel admin con login solo para el dueño.

## Stack (decidido, no cambiar sin avisar al usuario)
- Next.js (App Router) en Vercel — hosting y despliegue automático con cada push.
- Supabase — base de datos Postgres, autenticación, storage de imágenes. Plan Free.
- Carrito en `localStorage` del navegador (no hay checkout transaccional).
- GitHub — repo del proyecto, conectado a Vercel para CI/CD automático.

## Identidad de marca
- Logo: imagen ya provista por el usuario (loro con corona sobre almohada). Usar como imagen importada, NUNCA vectorizar/redibujar.
- Colores: azul `#1B4D9E`, rojo `#E1382B`, verde `#3FAE49`, dorado `#F2A900`, negro `#1A1A1A`, blanco `#FFFFFF`.

## Esquema de base de datos (Supabase)
Tablas: `categories`, `products`, `product_images`, `site_config`.
RLS activado en todas: lectura pública solo de `active`/`visible = true`; escritura solo `auth.role() = 'authenticated'`.
Bucket de Storage: `product-images`, lectura pública.
Admin: un solo usuario creado manualmente en el dashboard de Supabase (sin registro público).

## Estructura de páginas
Público: `/`, `/catalogo`, `/producto/[slug]`, `/carrito`.
Admin (protegido por middleware): `/admin/login`, `/admin/productos`, `/admin/categorias`, `/admin/configuracion`.
Botones flotantes siempre visibles: WhatsApp, Instagram, TikTok (URLs desde `site_config`).
El botón "Finalizar pedido" del carrito abre `wa.me` con el resumen del pedido como texto prellenado.

## Variables de entorno necesarias
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Restricciones de negocio
- No manejar información sensible (sin tarjetas, sin datos críticos) — no es necesaria seguridad de nivel bancario, solo proteger las rutas `/admin/*`.
- Tráfico esperado: hasta ~10 usuarios simultáneos (muy por debajo de los límites free de Supabase).
- Vercel Hobby es para uso no comercial según su ToS; el usuario decidió arrancar ahí y evaluar pasar a Pro ($20/mes) si crece o si Vercel lo pide.

## Guía completa
El detalle paso a paso (SQL completo, comandos, orden de implementación) está en `guia-desarrollo-lorotext-sym.md` en este mismo repo — léelo antes de empezar a programar si tienes dudas de orden o de las queries SQL exactas.

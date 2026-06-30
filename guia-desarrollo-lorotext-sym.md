# Guía de desarrollo — Lorotext SYM (stack gratuito)

## 0. Arquitectura (ver diagrama arriba)
- **GitHub**: guarda el código.
- **Vercel**: hostea y despliega el sitio (Next.js) automáticamente con cada `git push`.
- **Supabase**: base de datos (productos, categorías), autenticación (login del admin) y almacenamiento de imágenes.
- **WhatsApp**: recibe el pedido armado desde el carrito (no hay pasarela de pagos).

## 1. Cuentas a crear (todas gratis)
1. GitHub (repositorio del proyecto).
2. Vercel (conectado con tu cuenta de GitHub).
3. Supabase (un proyecto nuevo, plan Free).

## 2. Nota sobre el plan gratuito de Vercel
El plan **Hobby** de Vercel es, según sus términos, para uso **no comercial**. Una tienda real cae fuera de eso en la letra del contrato, aunque en la práctica se usa mucho para proyectos chicos sin que haya consecuencias. Dos caminos:
- **Arrancar en Hobby** ($0) y asumir ese riesgo bajo mientras el tráfico sea pequeño (10 usuarios simultáneos es muy poco).
- **Pasar a Pro** ($20/mes) si quieres estar 100% en regla desde el día uno, o si el negocio crece.
Supabase y GitHub no tienen esta restricción para este caso de uso.

## 3. Entorno de desarrollo: Claude Code + GitHub
Para el desarrollo real (escribir y mantener el código) lo correcto es **Claude Code** (terminal o app de escritorio), no Cowork. Claude Code se conecta directo a tu carpeta de proyecto y a Git: puede crear archivos, correr comandos, hacer commits y push al repo. Cowork está pensado para tareas de varios pasos que combinan herramientas (investigación, documentos, etc.), no para mantener un código base.

Flujo recomendado:
1. Crea el repo vacío en GitHub.
2. Clónalo en tu máquina (`git clone ...`).
3. Abre esa carpeta con Claude Code (terminal: `claude` dentro de la carpeta, o la app de escritorio apuntando a esa carpeta).
4. Le vas pidiendo a Claude Code que construya cada parte siguiendo los pasos de abajo, y vas haciendo commits.

## 4. Paso a paso

### 4.1 Crear el proyecto Next.js
```
npx create-next-app@latest lorotext-sym
cd lorotext-sym
npm install @supabase/supabase-js @supabase/ssr
```

### 4.2 Crear el proyecto en Supabase
En el dashboard de Supabase: "New project" → guarda la URL del proyecto y la `anon key` (Settings → API).

### 4.3 Definir las tablas (SQL editor de Supabase)
```sql
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  sort_order int default 0,
  visible boolean default true
);

create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id),
  name text not null,
  slug text unique not null,
  description_short text,
  description_long text,
  price numeric not null,
  sizes text[],
  colors text[],
  material text,
  featured boolean default false,
  active boolean default true,
  created_at timestamp default now()
);

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  url text not null,
  sort_order int default 0
);

create table site_config (
  key text primary key,
  value text
);
-- filas: whatsapp_number, instagram_url, tiktok_url, promo_banner
```

### 4.4 Seguridad con Row Level Security (RLS)
Activa RLS en las 4 tablas y agrega políticas: lectura pública de lo activo/visible, escritura solo para usuarios autenticados (tu admin).
```sql
alter table products enable row level security;
create policy "lectura publica productos activos"
  on products for select using (active = true);
create policy "admin escribe productos"
  on products for all using (auth.role() = 'authenticated');
-- repetir el mismo patrón para categories, product_images y site_config
```

### 4.5 Storage para imágenes
Crea un bucket llamado `product-images` en Supabase Storage, marcado como **público para lectura**. La subida de archivos solo la hace el admin autenticado desde el panel.

### 4.6 Crear el usuario admin
En Supabase: Authentication → Users → "Add user" (tu correo y contraseña). No habilites registro público; el login del sitio solo debe permitir iniciar sesión, no crear cuentas.

### 4.7 Conectar Next.js con Supabase
Variables de entorno en `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```
Cliente de Supabase reutilizable en `lib/supabase.ts` usando `@supabase/ssr`.

### 4.8 Construir el sitio público
- `/` (home), `/catalogo`, `/producto/[slug]`, `/carrito`.
- El carrito vive en `localStorage` (no necesita base de datos: es temporal por visitante).
- Botón del carrito: genera un texto con los productos/cantidades/total y abre `https://wa.me/<numero>?text=<mensaje codificado>`.
- Botones flotantes de WhatsApp, Instagram y TikTok leyendo sus URLs desde `site_config`.

### 4.9 Construir el panel admin
- `/admin/login`: formulario con `supabase.auth.signInWithPassword`.
- `middleware.ts`: protege todas las rutas `/admin/*`, redirige a `/admin/login` si no hay sesión.
- `/admin/productos`: tabla con buscador, botones editar/eliminar, formulario de alta con subida de imagen a Storage.
- `/admin/categorias` y `/admin/configuracion` (WhatsApp, redes, banner de promo).

### 4.10 Probar en local
```
npm run dev
```
Revisa el flujo completo: agregar al carrito, editar cantidades, finalizar por WhatsApp, login admin, crear/editar/eliminar un producto.

### 4.11 Subir a GitHub
```
git add .
git commit -m "primera version del sitio"
git push
```

### 4.12 Desplegar en Vercel
1. En Vercel: "Add New Project" → importa el repo de GitHub.
2. Agrega las mismas variables de entorno (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) en Project Settings → Environment Variables.
3. Deploy. A partir de aquí, cada `git push` a la rama principal despliega automáticamente.

## 5. ¿Aguanta 10 usuarios simultáneos?
Sí, con muchísimo margen. El plan free de Supabase incluye 500 MB de base de datos, 1 GB de almacenamiento de imágenes y 5 GB de transferencia mensual; 10 usuarios a la vez ni se nota. El único cuidado: si el sitio queda sin visitas 7 días seguidos, Supabase pausa el proyecto free automáticamente (se reactiva con un clic en el dashboard) — no es un problema si hay tráfico real.

## 6. Costos esperados
- GitHub: $0.
- Vercel: $0 en Hobby (ver nota de la sección 2) o $20/mes en Pro si prefieres estar 100% en regla.
- Supabase: $0 en el plan Free mientras no superes los límites de arriba.
- Único costo casi inevitable: el **dominio propio** (ej. lorotextsym.com), unos $10–15/año, si no quieres usar el subdominio gratuito `*.vercel.app`.

## 7. Siguientes pasos
Puedo armar ahora mismo el esqueleto inicial del proyecto (estructura de carpetas, páginas base, cliente de Supabase, esquema SQL en un archivo listo para pegar) para que lo descargues y solo le hagas `git push` a tu repo. Dime si quieres que lo prepare.

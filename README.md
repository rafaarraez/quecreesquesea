# ¿Qué crees que será? — Se Viene un Mandolese López 💛

Web app para la revelación de sexo del bebé: una experiencia mágica donde la
familia deja su predicción (🌸 niña / 💙 niño) y un mensaje de amor, ve el
marcador en vivo y los papás disparan la revelación final.

URL: **quecreesquesea.vercel.app**

## Stack

- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS 4** — paleta cielo nocturno
- **Framer Motion** — animaciones y transiciones
- **tsParticles** — cascada de fondo (estrellas, flores, corazones, huellas)
- **Supabase** — base de datos + Realtime para el marcador y el historial

## Secciones

| Ruta | Qué es |
|------|--------|
| `/` | Hero + formulario de voto + marcador en vivo + ecos del corazón |
| `/revelar` | Pantalla secreta de los papás: la revelación cinematográfica |

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # completá tus credenciales
npm run dev                  # http://localhost:3000
```

> Sin credenciales de Supabase la app igual funciona en **modo demo** (guarda
> los votos en el navegador), ideal para previsualizar.

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Clave pública (`sb_publishable_…`). También se acepta `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `BABY_GENDER` | `girl` o `boy` — define la revelación final (server-side, no se filtra) |

## Base de datos

Ejecutá [`supabase.sql`](./supabase.sql) en el **SQL Editor** de Supabase. Crea
la tabla `votes`, activa Realtime y las políticas RLS (cualquiera puede leer y
crear votos; nadie puede editar ni borrar).

## Deploy en Vercel

1. Subí el proyecto a un repo de GitHub.
2. En [vercel.com](https://vercel.com) → **New Project** → importá el repo.
3. En **Settings → Environment Variables** cargá las tres variables de arriba.
   - ⚠️ `NEXT_PUBLIC_*` se inyectan en **build time**: si las cambiás, redesplegá.
4. **Deploy**. Para el nombre lindo, en **Settings → Domains** poné
   `quecreesquesea` → te queda `quecreesquesea.vercel.app`.

## Audio de la revelación (opcional)

Colocá un archivo `reveal.mp3` en [`public/`](./public) y sonará durante la
secuencia de `/revelar`. Si no existe, la revelación funciona igual (sin música).

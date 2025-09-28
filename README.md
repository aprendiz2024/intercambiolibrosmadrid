# Intercambio Libros Madrid — Ascensión (Netlify + GitHub)

Este repositorio contiene el `index.html` con la visualización **Ascensión**, el `sw.js` seguro (solo cachea GET) y la configuración `netlify.toml` para desplegar en Netlify desde GitHub.

## Estructura
- `index.html` — Frontend estático con skin Ascensión
- `ascension-bundle.min.js` — Inyecta CSS y sobreescribe `Exchange.card()`
- `sw.js` — Service Worker (GET-only, ignora Supabase y POST)
- `manifest.json` — Manifest PWA mínimo
- `icon-192.png`, `icon-512.png` — Iconos de ejemplo
- `netlify.toml` — Publicación desde raíz y fallback SPA
- `.gitignore`, `README.md`

## Cómo usar con GitHub
1. Crea un repositorio nuevo en tu cuenta (público o privado).
2. Descarga el ZIP de este repo y súbelo entero (o haz push con git).
3. Conecta Netlify → “New site from Git” → elige tu repo.
4. Build settings:
   - **Build command**: *(déjalo vacío)*
   - **Publish directory**: `/` (o usa el `netlify.toml` que ya indica `publish = "."`)
5. Deploy. Si cambias algo, haz commit y Netlify redeployará.

## Supabase
No guardes la **service key** en el front. Solo `anon key` + RLS activo. Configura tus variables (URL y anon key) dentro de `index.html` si todavía no lo hiciste.

## Limpieza de Service Worker
Si venías de otra versión, en Chrome: DevTools → Application → Service Workers → *Unregister* y Clear storage.

# Prompt: Fix OCR imágenes + mejoras UX estado de portales

**Fecha:** 2026-04-17
**Tareas relacionadas:** T-2026-04-15-01 (fix OCR), T-2026-04-17-01 (UX portales)

---

## Contexto

Proyecto CertiDoc — portal React + Vite (client-side). El ciudadano sube un PDF, imagen o texto; el navegador extrae texto, hace matching con catálogo de certificados colombianos y muestra resultados con links a portales oficiales.

Stack relevante: Tesseract.js v5 (OCR), pdfjs-dist v4 (PDF), React 18, Vite.

---

## Fix 1: OCR de imágenes no funciona (T-2026-04-15-01 — pendiente)

### Problema

`Tesseract.createWorker('spa')` intenta cargar `spa.traineddata.gz` desde CDN
(`tessdata.projectnaptha.com` o `cdn.jsdelivr.net`). El navegador bloquea la petición
por CSP (`Content at localhost may not load data from cdn.jsdelivr.net`).

### Solución aplicada

1. **`frontend/src/services/ocr.js`** — cambiar `langPath` de CDN a ruta local:
   ```js
   langPath: '/tesseract/lang',   // antes: 'https://tessdata.projectnaptha.com/4.0.0'
   ```

2. **`frontend/scripts/setup-assets.js`** — script Node ESM que:
   - Crea `public/tesseract/lang/`
   - Copia `pdf.worker.min.mjs` → `public/pdf.worker.min.js`
   - Copia `tesseract.js/dist/worker.min.js` → `public/tesseract/worker.min.js`
   - Copia dinámicamente todos los `tesseract-core*.js` de `tesseract.js-core/` (detecta nombres reales)
   - Descarga `spa.traineddata.gz` con `curl` si no existe

3. **`frontend/package.json`** — `postinstall` simplificado:
   ```json
   "postinstall": "node scripts/setup-assets.js"
   ```

4. **`.gitignore`** — ya tenía `frontend/public/tesseract/` excluido (sin cambios).

### Notas técnicas Tesseract.js v5

- `corePath` debe apuntar a un **directorio** con los 4 archivos `.wasm.js`, no a un solo archivo
- `langPath` construye la URL como `langPath + '/' + langCode + '.traineddata.gz'`
- `workerBlobURL: false` necesario para servir el worker desde ruta same-origin

---

## Tarea 2: UX de estado de portales (T-2026-04-17-01 — planeada)

### Solicitud del usuario

- Renombrar columna "Health" a "Estado del portal"
- Reemplazar puntos de colores por texto legible: **Funcionando / Sin acceso / Verificando...**
- No agregar estados intermedios (3 es suficiente dado que `no-cors` HEAD no distingue más)
- Ejecutar el health check automáticamente cada 10 minutos
- Mostrar "Portales consultados: HH:MM" arriba del buscador

### Archivos a modificar

| Archivo | Cambio |
|---|---|
| `frontend/src/styles/styles.css` | Reemplazar `.cert-table__health` (punto) por `.cert-table__portal-status` (badge texto) + `.cert-table__last-checked` |
| `frontend/src/components/CertificateTable.jsx` | Renombrar `HealthDot` → `PortalStatus` con texto; nueva prop `lastChecked`; mostrar timestamp |
| `frontend/src/pages/Extract.jsx` | Extraer `runHealthCheck`; `setInterval` cada 10 min con cleanup; estado `lastChecked` |

### Restricciones de diseño

- Solo 3 estados: `ok` (Funcionando), `error` (Sin acceso), `pending` (Verificando...)
- "Sin acceso" y "Servicio caído" son equivalentes técnicamente con `no-cors` HEAD
- `setInterval` en componente, no en servicio — el cleanup evita memory leaks
- Sin estilos inline — todo en `styles.css`

---

## Checklist antes de implementar T-2026-04-17-01

1. ¿Cada función tiene ≤ 20 líneas?
2. ¿El `useEffect` con `setInterval` tiene su `clearInterval` en el cleanup?
3. ¿`lastChecked` se formatea en el componente, no en el servicio?
4. ¿Los estilos nuevos usan variables de `:root` (colores, fuentes, espaciado)?
5. ¿Se verificó la API de Tesseract.js v5 en context7 antes de tocar `ocr.js`?

# Evaluacion critica de resultados de IA — Entrega 4

## Casos reales de fallo o desalineacion

| Caso | Falla observada | Evidencia | Como se detecto | Como se corrigio |
|---|---|---|---|---|
| C-01 | La documentacion quedo anclada al stack AWS cuando el codigo ya estaba en FastAPI/PostgreSQL | `README.md` (antes de refactor), `tasks/T-2026-04-17-02.md` | Revision manual cruzando README contra archivos `backend/app/*` | Reescritura de secciones 4 a 6 (commits `b46b89a`, `395c2cc`) |
| C-02 | El plan de E3 dejo dependencias incompletas y alcance ambiguo | `.prompts/discusion/revision_planes_entrega_3_codex_uv.md` | Checklist de plan antes de ejecutar tareas | Ajuste de dependencias y alcance en `.prompts/correcciones/correcciones_plan_entrega_3_2026-04-12.md` |
| C-03 | Recomendaciones iniciales de dependencias no quedaron alineadas con `uv` | `.prompts/discusion/revision_planes_entrega_3_codex_uv.md` | Revision tecnica del repositorio (`pyproject.toml` + `uv.lock`) | Estandar de proyecto definido en `uv` y actualizacion de tareas |
| C-04 | OCR de imagen sugerido con recursos CDN genero bloqueos CSP | `tasks/T-2026-04-15-01.md`, `.prompts/ux-portales-y-ocr-fix.md` | Errores de navegador en ejecucion local (CSP y worker) | Assets locales para Tesseract y ajuste de rutas same-origin |
| C-05 | Flujo de revision de amenazas podia bloquear el catalogo si VT fallaba | `tasks/T-2026-04-17-03.md`, `.prompts/discusion/feature_vt_bajo_demanda_2026-04-17.md` | Pruebas manuales de UX y resiliencia | Endpoint bajo demanda con fallback `unavailable` y sin bloqueo de carga |

## Lo que aprendio el desarrollador

La IA acelera mucho, pero falla cuando no tiene contexto completo o cuando el
proyecto cambia de direccion en medio del ciclo. El riesgo mas comun no fue un
error de sintaxis, fue una recomendacion tecnicamente correcta pero desalineada
del estado real del repo.

Tambien quedo claro que un prompt bien estructurado no reemplaza la validacion
manual. La validacion cruzada (codigo, rubrica, tareas y ejecucion real) fue la
parte que evito integrar errores de diseno.

## Que se haria distinto la proxima vez

1. Congelar una fuente unica de verdad por fase (stack, rutas, tablas) y
   anexarla en cada prompt para reducir desalineaciones.
2. Forzar un paso de verificacion automatica minimo despues de cada respuesta
   de IA (por ejemplo, checks de rutas, dependencias y contratos de API).
3. Usar dos modelos en temas de arquitectura desde el inicio (propuesta y
   critica) para detectar contradicciones antes de codificar.
4. Registrar desde el dia 1 una bitacora de defectos con causa raiz para que la
   evaluacion de calidad no dependa de reconstruccion posterior.

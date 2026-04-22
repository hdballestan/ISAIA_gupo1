# Registro de defectos — Entrega 3

| ID | Fecha | Sintoma | Causa raiz | Fix (commit) |
|---|---|---|---|---|
| D-001 | 2026-04-15 | OCR de imagen fallaba por bloqueo de recursos externos | Worker y `traineddata` de Tesseract cargados desde CDN (politica CSP y origen cruzado) | `17b4c32` |
| D-002 | 2026-04-15 | Extraccion PDF fallaba con error MIME `application/octet-stream` | Carga de worker de PDF no compatible con el entorno Docker/Vite | `17b4c32` |
| D-003 | 2026-04-15 | La API de catalogo presentaba 502 intermitente en frontend | Flujo sin reintento para errores transitorios de gateway | `17b4c32` |
| D-004 | 2026-04-17 | Documentacion de arquitectura no coincidia con el codigo real | README seguia con narrativa AWS/Lambda despues de simplificacion a FastAPI/PostgreSQL | `b46b89a` |
| D-005 | 2026-04-17 | Diagrama Mermaid no renderizaba correctamente | Error de sintaxis en diagrama de contenedores | `395c2cc` |

## Observacion

El objetivo del registro es dejar trazabilidad tecnica clara (sintoma,
causa y commit) para que la evaluacion de calidad no dependa de memoria.

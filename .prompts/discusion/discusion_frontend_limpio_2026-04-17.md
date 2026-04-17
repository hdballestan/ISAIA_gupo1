# Discusion breve: ajuste visual frontend limpio

**Fecha:** 2026-04-17

## Acuerdos

- Se actualiza la interfaz con una paleta mas institucional (azul/verde sobrios + neutros) tomando solo referencia visual de `.prompts/style.png`, sin emular marca oficial.
- El header queda fijo para mantener contexto durante scroll, con ajuste de espaciado en contenido para evitar solapamiento en desktop y mobile.
- Se cambia el copy del encabezado por un mensaje mas amable orientado al ciudadano.
- En tabla de certificados se elimina la primera columna `Estado` (vacia) y se mantiene la columna final `Estado del portal` con su logica actual.
- Los cambios son solo de frontend/presentacion: no se modifican rutas, servicios, API, OCR, matcher ni comportamiento funcional.

## Evidencia de implementacion

- `frontend/src/styles/styles.css`
- `frontend/src/components/Layout.jsx`
- `frontend/src/components/CertificateTable.jsx`
- `frontend/src/pages/Extract.jsx`

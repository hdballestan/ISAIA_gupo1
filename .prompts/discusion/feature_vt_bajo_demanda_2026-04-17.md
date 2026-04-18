# Discusion breve: feature VirusTotal bajo demanda

**Fecha:** 2026-04-17

- Se migro de revision masiva a revision por fila para no bloquear carga del catalogo.
- Se agrego endpoint `POST /api/v1/certificates/{id}/threat-check` con `portal_url` opcional.
- Si VirusTotal falla o no responde, el sistema devuelve `unavailable` sin romper el flujo ciudadano.
- La tabla ahora muestra accion `Revisar amenazas` y evita recalcule cuando ya hay resultado valido.

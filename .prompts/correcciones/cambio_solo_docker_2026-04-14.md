# Corrección: Ejecución solo via Docker

**Fecha:** 2026-04-14
**Tarea afectada:** T-2026-04-12-06, docker-compose.yml, deploy.sh

## Cambio

Se consolidó toda la pila de ejecución en Docker Compose.

### Antes

- docker-compose.yml solo tenía el servicio `db` (PostgreSQL).
- Backend y frontend se ejecutaban manualmente con `uv run` y `npm run dev`.
- deploy.sh era solo un archivo de instrucciones comentadas, no ejecutable.

### Después

- docker-compose.yml incluye tres servicios: `db`, `backend`, `frontend`.
- `backend/Dockerfile`: Python 3.11-slim + uv, expone puerto 8000.
- `frontend/Dockerfile`: build Node 18 + nginx, expone puerto 80 (mapeado a 5173).
- `frontend/nginx.conf`: proxy `/api/` → `backend:8000`, SPA fallback a index.html.
- deploy.sh es ahora ejecutable (`bash deploy.sh up|down|logs|reset|test`) con:
  - `check_docker()`: verifica que Docker esté instalado y corriendo.
  - `check_compose()`: verifica docker compose v2.
  - Mensajes de error claros si Docker Desktop no está activo.

## Motivación

El usuario indicó que prefiere manejar toda la infraestructura local via Docker para garantizar paridad de entorno y simplificar el onboarding.

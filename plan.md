# Plan de Entrega 3 — CertiDoc

> **Deadline:** 15 de abril de 2026
> **Rúbrica:** Construcción y Codificación (§5) + Pruebas y Calidad (§6)
> **Cambios:** ver `.prompts/discusion/cambios_entrega_3.md`
> **Proceso IA:** Opus 4.6 + gpt-5.3-codex (planificación complementaria), ejecución asistida con Kaiku y Sonnet

## Resumen de cambios vs Entrega 2

| Aspecto | Entrega 2 | Entrega 3 (implementación) |
|---|---|---|
| Matching | OpenAI GPT-4o | Regex sobre catálogo |
| OCR prod | OpenAI Vision | Tesseract.js (client-side) |
| Backend | Lambda + API Gateway | FastAPI |
| DB | DynamoDB | SQLite / PostgreSQL |
| Auth | Cognito | JWT + bcrypt |
| Frontend | React + TypeScript | React + Vite (JS) |
| Paquetes backend | requirements.txt | `uv` (`pyproject.toml` + `uv.lock`) |
| UX | Chat conversacional | Panel drag & drop |
| Deploy | CDK → AWS | Docker → Railway + Vercel |

## Fases y tareas

### Fase 0 — Estructura del proyecto

- [x] **T-2026-04-12-01** Crear árbol de carpetas y archivos vacíos
  - Backend: FastAPI scaffolding
  - Backend paquetes: `pyproject.toml` + `uv.lock` (requirements exportable solo compatibilidad)
  - Frontend: Vite + React scaffolding
  - Data: catalog.json
  - Verificar contra `.claude/index.md`

### Fase 1 — Backend core

- [x] **T-2026-04-12-02** Modelos, base de datos y seed del catálogo
  - SQLAlchemy models (Certificate, Ticket, User, RateLimit)
  - Conexión SQLite
  - Seed con ≥10 certificados colombianos verificados
- [x] **T-2026-04-12-03** Auth y seguridad
  - JWT + bcrypt (registro, login, middleware)
  - RBAC: público, ciudadano, admin
  - Rate limiting por IP (1/24h en tickets)
  - Honeypot en formulario de tickets

### Fase 2 — Backend endpoints y matching

- [x] **T-2026-04-12-04** Endpoints de la API
  - GET /api/v1/certificates, GET /api/v1/certificates/{id}
  - POST /api/v1/extract (texto-only, no archivo)
  - POST /api/v1/tickets
  - CRUD /api/v1/admin/certificates, /api/v1/admin/tickets
  - Contrato de error común: `{ "error": { "code", "message", "details" } }`
- [x] **T-2026-04-12-05** Servicio de regex matching
  - Patrones por certificado (nombres, variantes, aliases)
  - Matching contra catálogo y respuesta con metadata + links

### Fase 3 — Frontend base

- [x] **T-2026-04-12-06** Inicialización y diseño visual
  - Vite + React setup
  - Layout (header, nav, footer)
  - styles.css centralizado con variables CSS
  - Routing (Home, Extract, Catalog, Admin, Login)
- [x] **T-2026-04-12-07** Componentes funcionales
  - DocumentUploader (drag & drop)
  - CertificateCard / CertificateList
  - AdminPanel
  - TicketForm (con honeypot)
  - Login/Register forms

### Fase 4 — Procesamiento client-side

- [x] **T-2026-04-12-08** OCR, PDF y matching en navegador
  - pdf.js para extracción de texto de PDFs
  - Tesseract.js para OCR de imágenes
  - Regex matcher client-side (mismos patrones del backend)
  - Integración en DocumentUploader

### Fase 5 — Integración y despliegue

- [x] **T-2026-04-12-09** Conectar, empaquetar y desplegar
  - Frontend consume API real
  - Docker Compose para desarrollo local
  - Deploy backend → Railway
  - Deploy frontend → Vercel
  - GitHub Actions: lint + test (PR/push) + deploy manual/tag
  - Aporte Codex (2026-04-14): `VITE_API_URL`, CORS por `FRONTEND_ORIGIN`, Dockerfiles/compose ajustados, CI (`ci.yml`) y deploy controlado (`deploy.yml`)

### Fase 6 — Calidad y documentación

- [x] **T-2026-04-12-10** Pruebas, evidencia y README
  - Documento de estrategia de pruebas
  - Pruebas unitarias clave (matcher, auth, endpoints)
  - Evidencia de ejecución (capturas/logs)
  - Actualizar README secciones 6 y 7
  - Actualizar `.prompts/entrega_3.md` con todos los prompts usados
  - Aporte Codex (2026-04-14): suite pytest/vitest, smoke tests frontend, evidencia local, correcciones `uv.lock`/`.flake8`/`seed.py`

## Reglas del plan

1. Cada tarea tiene archivo propio en `tasks/`
2. Al completar una tarea, marcar `[x]` aquí y actualizar estado en su archivo
3. Registrar prompts usados en `.prompts/entrega_3.md`
4. No ejecutar código de la aplicación — solo tests bajo permiso
5. Consultar context7 antes de usar cualquier librería
6. Todo archivo ≤ 300 líneas, toda función ≤ 20 líneas
7. Dependencia esencial: `T-2026-04-12-04` depende de `T-2026-04-12-05`
8. API versionada desde inicio bajo `/api/v1`

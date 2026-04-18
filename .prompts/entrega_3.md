# Prompt — Entrega 3: Construcción y Pruebas

**Proyecto:** CertiDoc — Portal Unificado de Gestión de Certificados (Colombia)
**Fecha inicio:** 2026-04-12
**Deadline:** 2026-04-15
**Herramienta IA:** Proceso complementario Opus 4.6 + gpt-5.3-codex (planificación), ejecución con Kaiku y Sonnet

## Objetivo

Construir el MVP funcional de CertiDoc según el diseño de Entrega 2, con las simplificaciones acordadas en `.prompts/discusion/cambios_entrega_3.md`.

## Stack definido

- Backend: FastAPI (Python 3.11+) + SQLite (dev) / PostgreSQL (prod)
- Frontend: React + Vite (JS puro)
- OCR: Tesseract.js (client-side) — OpenAI Vision solo testing
- PDF: pdf.js (client-side)
- Matching: Regex sobre catálogo finito
- Auth: JWT + bcrypt
- Deploy: Railway (backend) + Vercel (frontend)
- CI/CD: GitHub Actions

## Entregables según rúbrica (sección 5 y 6)

1. Repositorio accesible con historial de commits
2. Instrucciones de compilación y ejecución
3. Gestión de dependencias (`pyproject.toml` + `uv.lock`, y `package.json`)
4. Código con calidad (PEP 8, modular, legible, coherente con diseño)
5. Uso adecuado de control de versiones
6. Estrategia de pruebas documentada
7. Cobertura de pruebas unitarias e integración
8. Evidencia de ejecución y resultados
9. Validación de requisitos funcionales
10. Uso responsable de IA generativa en implementación

## Prompts usados durante el desarrollo

> Esta sección se actualiza con cada tarea completada.

| # | Fecha | Descripción | Modelo | Tarea |
|---|---|---|---|---|
| 1 | 2026-04-12 | Planificación: discusión de cambios arquitectónicos, simplificación de stack, definición de tareas | Opus 4.6 | Pre-plan |
| 2 | 2026-04-12 | Creación de plan.md, CLAUDE.md, estructura .claude/, tareas | Opus 4.6 | Pre-plan |
| 3 | 2026-04-12 | Creación árbol de carpetas y archivos vacíos (backend, frontend, data) | Haiku 4.5 | T-2026-04-12-01 |
| 4 | 2026-04-12 | Modelos SQLAlchemy 2.0, DB PostgreSQL+Docker, seed 10 certificados colombianos | Sonnet 4.6 | T-2026-04-12-02 |
| 5 | 2026-04-12 | Implementación Auth y seguridad: JWT, bcrypt cost 12, RBAC, rate limit 24h y honeypot | Sonnet 4.6 | T-2026-04-12-03 |
| 6 | 2026-04-12 | Servicio de regex matching dual (Python + JavaScript) con normalización NFD | Haiku 4.5 | T-2026-04-12-05 |
| 7 | 2026-04-12 | Endpoints API v1 completos: certificates, extract texto-only, tickets y admin CRUD con contrato de error | gpt-5.3-codex | T-2026-04-12-04 |
| 8 | 2026-04-14 | Frontend T-06: package.json + Vite, App router 6 rutas, Layout header/footer, styles.css con 20+ variables, páginas stub, services/api.js, deploy.sh | Sonnet 4.6 | T-2026-04-12-06 |
| 9 | 2026-04-14 | Docker Compose completo: backend/Dockerfile + frontend/Dockerfile + nginx.conf, deploy.sh ejecutable con check_docker/check_compose y fallback de error | Sonnet 4.6 | docker-compose |
| 10 | 2026-04-14 | T-07: 6 componentes React funcionales (DocumentUploader, CertificateCard, CertificateList, AdminPanel, TicketForm, Login), estilos CSS actualizados, api.js extendido | Haiku 4.5 | T-2026-04-12-07 |
| 11 | 2026-04-14 | T-08: services/pdf.js (pdfjs-dist), services/ocr.js (Tesseract.js con idioma spa), integración en DocumentUploader, barra de progreso | Haiku 4.5 | T-2026-04-12-08 |
| 12 | 2026-04-14 | T-09: integracion frontend-backend por `VITE_API_URL`, CORS por `FRONTEND_ORIGIN`, Docker Compose ajustado, CI (`ci.yml`) y deploy manual/tag (`deploy.yml`), README secciones 6-7 actualizadas | gpt-5.3-codex | T-2026-04-12-09 |
| 13 | 2026-04-14 | T-10: estrategia de pruebas, implementación de suites pytest/vitest (matcher, auth, endpoints, smoke), evidencia local de ejecución, correcciones de estabilidad (`uv.lock`, `seed.py`, `.flake8`, pin bcrypt) y actualización de README | gpt-5.3-codex | T-2026-04-12-10 |

## Notas sobre modelos

- **Opus 4.6 (planificación):** usado para diseño arquitectónico, decisiones complejas, documentación de plan
- **Haiku 4.5 (ejecución eficiente):** usado para tareas de creación de estructura, archivos scaffolding, optimizando tokens

## Decisiones de IA validadas por humano

- [x] 2026-04-12 — Regex en vez de IA para matching de certificados
- [x] 2026-04-12 — Tesseract.js client-side en vez de Vision en producción
- [x] 2026-04-12 — FastAPI+SQLite en vez de Lambda+DynamoDB
- [x] 2026-04-12 — Panel drag & drop en vez de chat conversacional
- [x] 2026-04-12 — Alcance MVP: incluir RF-01 a RF-07, RF-10-13; diferir RF-08/09/14

## Notas

- Cada prompt significativo se registra arriba con fecha y tarea asociada
- Los prompts completos quedan en el historial de Claude Code
- Las discusiones de decisiones van en `.prompts/discusion/`

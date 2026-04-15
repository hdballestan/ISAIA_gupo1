# Índice de Archivos — CertiDoc

## Raíz

| Archivo | Propósito |
|---|---|
| `CLAUDE.md` | Instrucciones del proyecto para Claude Code |
| `plan.md` | Plan paso a paso de Entrega 3 con tareas |
| `docker-compose.yml` | PostgreSQL local para desarrollo |
| `README.md` | Documentación formal (Entregas 1-4) |
| `rubrica.txt` | Rúbrica del curso |

## Backend (`backend/`)

| Ruta | Propósito |
|---|---|
| `app/main.py` | Entry point FastAPI, registro de routers |
| `app/config.py` | Variables de entorno y settings |
| `app/models/certificate.py` | Modelo Certificate (SQLAlchemy) |
| `app/models/ticket.py` | Modelo TicketRequest |
| `app/models/user.py` | Modelo User |
| `app/routes/certificates.py` | GET /certificates, GET /certificates/{id} |
| `app/routes/extract.py` | POST /extract (matching server-side fallback) |
| `app/routes/tickets.py` | POST /tickets (rate limited) |
| `app/routes/admin.py` | CRUD admin + moderación tickets |
| `app/routes/auth.py` | POST /register, POST /login |
| `app/services/matcher.py` | Regex matching contra catálogo |
| `app/services/catalog.py` | Lógica de negocio del catálogo |
| `app/middleware/auth.py` | Verificación JWT + RBAC |
| `app/middleware/rate_limit.py` | Rate limiting por IP |
| `app/db/base.py` | DeclarativeBase de SQLAlchemy |
| `app/db/database.py` | Engine, session factory, create_tables |
| `app/db/seed.py` | Seed de certificados y admin inicial |
| `pyproject.toml` | Dependencias backend (fuente de verdad con uv) |
| `uv.lock` | Lockfile de dependencias Python |
| `requirements.txt` | Exportación de compatibilidad |
| `.env.example` | Variables de entorno requeridas |

## Frontend (`frontend/`)

| Ruta | Propósito |
|---|---|
| `src/main.jsx` | Entry point React |
| `src/App.jsx` | Router principal |
| `src/styles/styles.css` | Estilos centralizados (fuentes, colores, layout) |
| `src/components/DocumentUploader.jsx` | Drag & drop de documentos |
| `src/components/CertificateCard.jsx` | Tarjeta de resultado de certificado |
| `src/components/CertificateList.jsx` | Lista de certificados del catálogo |
| `src/components/AdminPanel.jsx` | CRUD catálogo + tickets |
| `src/components/TicketForm.jsx` | Solicitud de nuevo trámite |
| `src/components/Layout.jsx` | Header, nav, footer |
| `src/pages/Home.jsx` | Landing + acceso a extracción |
| `src/pages/Extract.jsx` | Página principal: drag & drop + resultados |
| `src/pages/Catalog.jsx` | Exploración del catálogo |
| `src/pages/CertificateDetail.jsx` | Detalle de certificado por id |
| `src/pages/Admin.jsx` | Panel de administración |
| `src/pages/Login.jsx` | Autenticación |
| `src/services/api.js` | Cliente HTTP hacia backend |
| `src/services/ocr.js` | Tesseract.js wrapper |
| `src/services/pdf.js` | pdf.js wrapper |
| `src/utils/matcher.js` | Regex matching client-side (mismo patrón que backend) |
| `vite.config.js` | Configuración Vite |
| `package.json` | Dependencias JS |

## Datos

| Ruta | Propósito |
|---|---|
| `data/catalog.json` | Seed del catálogo de certificados colombianos |

## Prompts y evidencia IA

| Ruta | Propósito |
|---|---|
| `.prompts/entrega_3.md` | Prompt vivo — se actualiza durante desarrollo |
| `.prompts/discusion/cambios_entrega_3.md` | Resumen de cambios arquitectónicos |
| `.prompts/entrega_1.md` | Prompt original Entrega 1 |
| `.prompts/entrega_2.md` | Prompt Entrega 2 |

## Tareas

| Ruta | Propósito |
|---|---|
| `tasks/T-2026-04-12-XX.md` | Tareas individuales del plan |

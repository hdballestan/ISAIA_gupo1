# CertiDoc — Instrucciones del Proyecto

## Qué es

Portal unificado de gestión de certificados colombianos. El ciudadano sube un documento (PDF, imagen, texto), el sistema extrae texto en el navegador, identifica certificados mediante regex y devuelve enlaces a portales oficiales.

## Reglas de ejecución

- **NUNCA ejecutar código de la aplicación directamente** — solo se ejecutan tests y bajo permiso explícito del usuario
- **NUNCA crear archivos de test** salvo que el usuario lo pida explícitamente
- Antes de usar cualquier librería, consultar context7 para documentarse
- Cada cambio debe mantener el proyecto en estado ejecutable

## Stack

| Capa | Tecnología |
|---|---|
| Backend | FastAPI (Python 3.11+) |
| Paquetes Python | `uv` — `pyproject.toml` + `uv.lock` (fuente de verdad) |
| DB local | PostgreSQL via Docker Compose |
| DB prod | PostgreSQL (Railway) |
| Frontend | React + Vite (JavaScript, sin TypeScript) |
| OCR | Tesseract.js (client-side) — OpenAI Vision solo para testing |
| PDF | pdf.js (client-side) |
| Matching | Regex sobre catálogo finito |
| Auth | JWT + bcrypt |
| Deploy | Railway (backend) + Vercel (frontend) |
| CI/CD | GitHub Actions |

## Convenciones obligatorias

### Python (backend) — PEP 8 estricto

- Linter: flake8 (max-line-length=88)
- Imports: stdlib > third-party > local, separados por línea en blanco
- Nombres: snake_case funciones/variables, PascalCase clases
- Type hints en funciones públicas
- Validación de entrada con Pydantic
- Excepciones específicas, nunca bare except
- **Máximo 300 líneas por archivo**
- **Máximo 20 líneas por función**
- Sin comentarios obvios; solo lógica no evidente

### React / Vite (JavaScript)

- Un componente por archivo, nombre PascalCase
- Props destructuradas en firma del componente
- Estilos en `styles.css` centralizado (no inline, no CSS modules)
- Fetch/API calls en `services/`, nunca en componentes
- **Máximo 300 líneas por archivo**
- **Máximo 20 líneas por función**
- Sin comentarios innecesarios

### CSS centralizado

- Variables CSS en `:root` para colores, fuentes y tamaños
- Mobile-first responsive
- Clases descriptivas estilo BEM
- Un solo `styles.css` como fuente de verdad de diseño

## Decisiones arquitectónicas clave

1. **Regex en vez de IA** para identificar certificados — catálogo finito y predecible
2. **Tesseract.js client-side** en producción — sin costo de tokens
3. **Todo el procesamiento pesado en el cliente** — OCR, extracción PDF, regex matching suceden en el navegador
4. **Backend delgado** — sirve catálogo, auth, tickets, admin
5. **No hay chat conversacional** — UX es panel de drag & drop
6. **Documentos nunca salen del cliente** — privacidad, Ley 1581/2012

## Navegación rápida

- `plan.md` — Plan paso a paso con tareas
- `.claude/index.md` — Mapa completo de archivos
- `.claude/commands/best-practices.md` — Skill de buenas prácticas
- `.prompts/entrega_3.md` — Prompt vivo de la entrega actual
- `.prompts/discusion/` — Resúmenes de decisiones
- `tasks/` — Tareas individuales (T-2026-MM-DD-XX)
- `README.md` — Documentación formal del proyecto

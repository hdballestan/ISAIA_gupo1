# Discusión: Cambios para Entrega 3

**Fecha:** 2026-04-12
**Participantes:** Hever Ballesta + proceso IA complementario (Opus 4.6 + gpt-5.3-codex)

## Contexto

Preparación de Entrega 3 (Construcción y Pruebas, deadline 15 abril 2026). Se revisó la rúbrica completa y el README con Entregas 1 y 2 aprobadas. El proyecto es individual tras escisión autorizada del equipo original.

## Decisiones tomadas

### 1. Regex en vez de IA para identificar certificados

| | Antes | Ahora |
|---|---|---|
| Método | OpenAI GPT-4o clasifica certificados | Regex sobre catálogo finito |
| Razón | Certificados colombianos tienen nombres estandarizados. Regex es predecible, gratis y más rápido |
| Riesgo | Nombres no contemplados no matchean — mitigado con catálogo actualizable |

### 2. OCR client-side en producción

| | Antes | Ahora |
|---|---|---|
| Método | OpenAI Vision (server-side) | Tesseract.js en el navegador |
| Testing | — | OpenAI Vision disponible para pruebas con API key |
| Razón | Evitar costos de tokens en producción. OCR básico alcanza para documentos legibles |

### 3. Simplificación del stack completo

| Capa | Antes | Ahora | Razón |
|---|---|---|---|
| Backend | AWS Lambda (Python) | FastAPI | Un proceso, sin cold starts, debugging simple |
| API | API Gateway | FastAPI routes | Incluido en FastAPI |
| DB | DynamoDB | SQLite (dev) / PostgreSQL (prod) | SQL estándar, migraciones, joins si se necesitan |
| Auth | Cognito | JWT + bcrypt | Sin dependencia AWS, control total |
| Frontend | React + TypeScript + S3 + CloudFront | React + Vite (JS) + Vercel | Menos fricción, deploy gratis |
| IaC | CDK TypeScript | Docker + Railway | Un solo desarrollador, deadline corto |
| CI/CD | GitHub Actions + CDK deploy | GitHub Actions + deploy directo | Sin CDK synth/deploy |

### 4. UX: panel drag & drop en vez de chat

| | Antes | Ahora |
|---|---|---|
| Interfaz | Chat conversacional en lenguaje natural | Panel de drag & drop de documentos |
| Razón | El valor está en extraer info de documentos, no en conversar. UX más directa y sin costo de tokens |
| Futuro | El flujo LLM queda como extensión posible |

### 5. Procesamiento máximo en cliente

Todo el OCR (Tesseract.js), extracción de texto PDF (pdf.js) y regex matching sucede en el navegador. El backend solo sirve datos del catálogo y gestiona auth/tickets/admin.

**Razón:** Privacidad (Ley 1581/2012) — documentos nunca salen del dispositivo. Menor carga en servidor. Menor latencia percibida.

### 6. Alcance MVP para Entrega 3

**Incluidos:** RF-01 (catálogo), RF-02/03 (consulta por propósito via filtros), RF-04-07 (extracción), RF-10/11 (tickets + rate limit), RF-12/13 (admin + RBAC)

**Diferidos:** RF-08/09 (tablero personal + alertas vencimiento), RF-14 (export PDF)

## Impacto en arquitectura documentada (README sección 4)

- Diagramas C4 se simplifican: menos contenedores AWS
- Pipeline CI/CD se simplifica: sin CDK synth/deploy
- Flujo de extracción: client-side completo
- Se actualiza la sección al completar Entrega 3

## Validación

- [x] Cambio regex vs IA: revisado y aprobado por desarrollador
- [x] Stack simplificado: revisado y aprobado
- [x] Tesseract.js: revisado y aprobado
- [x] Panel drag & drop: revisado y aprobado
- [x] Alcance MVP: revisado y aprobado

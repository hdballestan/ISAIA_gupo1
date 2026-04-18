# Refactorización README: Arquitectura simplificada

**Fecha:** 2026-04-17
**Tarea:** T-2026-04-17-02
**Archivos modificados:** README.md (secciones 4-5-6)

## Cambios realizados

### Sección 4 — Arquitectura y Diseño (completamente reescrita)

**Antes:** Diagramas C4 y flujos basados en AWS (Lambda, DynamoDB, CloudFront, CDK, Cognito)

**Después:** Arquitectura simplificada real

#### 4.1 Vista de contexto
- Diagrama Mermaid nuevo: Ciudadano/Admin → CertiDoc → Portales + PostgreSQL
- Simplificado: solo 5 nodos vs 9 anteriores

#### 4.2 Vista de contenedores
- Diagrama nuevo: React+Vite → FastAPI → PostgreSQL (sin CDK, sin Lambda, sin Cognito)
- Tabla actualizada: sin CloudFront, sin DynamoDB, sin Cognito

#### 4.3-4.4 Flujos (nuevo contenido)
- Flujo de extracción: PDF/imagen en navegador → FE envía texto → BE hace regex matching
- **Flujo de health check explicado:**
  ```bash
  curl -I https://portal-oficial.gov.co
  # Cada 10 minutos en el cliente
  # Resultado: "Funcionando" / "Sin acceso"
  # Timestamp visible: "Última consulta: HH:MM"
  ```

#### 4.5 Decisiones arquitectónicas (tabla nueva)
| Decisión | Anterior | Actual |
|:---|:---|:---|
| Backend | Lambda + API Gateway | FastAPI |
| DB | DynamoDB | PostgreSQL |
| Auth | Cognito | JWT + bcrypt |
| OCR | OpenAI Vision | Tesseract.js client-side |
| Identificación certs | OpenAI RAG | Regex |
| Hosting frontend | S3 + CloudFront | Vercel |
| IaC | CDK TypeScript | Docker Compose |

#### Secciones 4.6-4.9 (ELIMINADAS)
Principios y patrones antiguos (Serverless, RAG, CDK) fueron eliminados.

### Sección 5 — Diseño Detallado (DIFERIDA)

**Antes:** Contenido completo con DynamoDB, Lambda, OpenAI prompts, 5 subsecciones

**Después:** Marcador de posición explícito

```markdown
> **Estado:** Pendiente refactorización. El stack simplificado en Entrega 3 cambió significativamente...
> Esta sección será reescrita en Entrega 4 con:
> - Modelo PostgreSQL actualizado
> - API REST real implementada
> - Componentes frontend reales
> - Ausencia de OpenAI (solo regex)
```

**Razón:** Refactorización prematura sería imprecisa. El código simplificado es significativamente diferente de lo documentado. Mejor esperar a Entrega 4.

### Sección 6 — Construcción (actualizada)

#### 6.6 Contrato de API (ampliado)

Agregado:
- Descripción breve de cada endpoint
- Sección **"Health check de portales (client-side)"** explicando:
  - Comando curl para pruebas manuales
  - Cada 10 minutos en el cliente
  - Estados: "Funcionando" / "Sin acceso"
  - Timestamp visible en UI

## Línea de trazabilidad

- Cambios motivados por `.prompts/discusion/cambios_entrega_3.md` (decisiones de stack)
- Cambios motivados por `.prompts/correcciones/cambio_solo_docker_2026-04-14.md` (Docker Compose)
- Cambios motivados por T-2026-04-17-01 (health checks con curl, UI estado de portales)

## Verificación

- [x] No hay referencias a AWS en sección 4
- [x] Diagramas Mermaid reflejan FastAPI + PostgreSQL
- [x] Health check explicado con curl
- [x] Sección 5 clara como "diferida"
- [x] Sección 6 actualizada y coherente

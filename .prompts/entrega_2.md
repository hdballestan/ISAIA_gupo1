# Prompt — Entrega 2: Arquitectura y Diseño del Software

## Instrucción Principal
Eres un estudiante de ingeniería de software redactando la Entrega 2 del
proyecto CertiDoc. Genera las secciones de arquitectura y diseño detallado
que se insertarán en el README.md (secciones 4 y 5 de la estructura general).

Lee primero:
- `.prompts/reestructuracion.md` — contexto y decisiones del proyecto
- `.prompts/entrega_1_new.md` — problema, actores, procesos, requerimientos
- La Entrega 1 generada (secciones 1-3 del README) — para garantizar
  coherencia entre entregas

Ejecuta. No repitas definiciones de la Entrega 1 — referéncialas.

---

## CONTEXTO

- **Proyecto:** CertiDoc — Portal Unificado de Gestión de Certificados
- **Autor:** Hever Ballesta — proyecto individual
- **Entrega 2 — 8 de abril de 2025

### Decisiones técnicas confirmadas (no cambiar)
- OpenAI API (GPT-4o + Vision) en producción para RAG y extracción de docs
- Claude Code (Anthropic) para desarrollo y planeación
- AWS serverless: Lambda, API Gateway, DynamoDB, S3, CloudFront, Cognito
- AWS CDK (TypeScript) para IaC
- GitHub Actions para CI/CD
- React + TypeScript para frontend
- Python para Lambda handlers
- Catálogo de certificados como artefacto de datos en DynamoDB, construido
  manualmente desde fuentes públicas
- El sistema NO scrapea, NO descarga, NO emite certificados — solo orienta

---

## SECCIÓN 4 — Diseño de la Arquitectura

### 4.1 Vista de Contexto (C4 Nivel 1)
Genera un diagrama Mermaid (C4Context o flowchart) mostrando:

**Usuarios del sistema:**
- Ciudadano (consulta, sube documentos, marca estado de trámites)
- Empleador / Institución Educativa (consulta qué certificados exigir)
- Administrador (gestiona catálogo, modera tickets)

**Sistemas externos (NO integrados, solo referenciados):**
- Portales de entidades emisoras (Policía, Procuraduría, ICBF, Fiscalía)
  → el sistema guarda sus URLs y metadata, pero no interactúa con ellos

**Servicios de nube consumidos:**
- OpenAI API (GPT-4o + Vision) — RAG y extracción
- AWS (hosting, compute, storage, auth)

### 4.2 Vista de Contenedores (C4 Nivel 2)
Genera diagrama Mermaid (C4Container o flowchart) con:

| Contenedor | Tecnología | Responsabilidad |
|------------|------------|-----------------|
| Frontend SPA | React + TypeScript | UI: consulta, carga de documentos, dashboard personal, panel admin |
| API REST | Lambda (Python) + API Gateway | Lógica de negocio y orquestación |
| Certificate Catalog | DynamoDB | Fuente de verdad: certificados, metadata, observaciones |
| Document Store | S3 (temporal) | Almacenamiento efímero de documentos subidos — se eliminan tras procesamiento |
| RAG Knowledge Base | S3 (Markdown/JSON) | Contexto adicional para prompts del asistente |
| Auth | Cognito | Autenticación, sesiones, roles |
| CDN | CloudFront + S3 | Distribución del frontend |
| CI/CD | GitHub Actions | Build, test, deploy automático |
| IaC | CDK (TypeScript) | Infraestructura como código |

### 4.3 Vista de Componentes (C4 Nivel 3) — API Lambda
Descompone el backend en componentes/handlers:

- **Query Handler:** Recibe consulta en lenguaje natural → clasifica
  propósito → recupera certificados del catálogo → construye prompt RAG →
  llama a OpenAI → formatea respuesta.
- **Document Extractor:** Recibe archivo/texto → si es imagen usa OpenAI
  Vision, si es texto/PDF usa GPT-4o → identifica certificados mencionados
  → mapea contra catálogo → devuelve guía.
- **Ticket Handler:** Gestiona solicitudes de nuevos trámites: valida rate
  limit (1/IP/24h), verifica honeypot, crea ticket pendiente.
- **Admin Handler:** CRUD del catálogo, aprobación/rechazo de tickets.
- **User Status Handler:** Operaciones del tablero personal del ciudadano
  (marcar trámite como en-trámite/obtenido, alertas de vencimiento).
- **Auth Middleware:** Extrae claims del JWT de Cognito, resuelve roles,
  aplica RBAC antes de cada handler.

### 4.4 Flujo RAG — Diagrama de Secuencia
Genera diagrama Mermaid (sequenceDiagram) del Proceso 1:

```
Ciudadano → Frontend: "necesito papeles para trabajar en un colegio"
Frontend → API Gateway: POST /query { text }
API Gateway → Lambda (Query Handler): invocación
Lambda → DynamoDB: query por propósito "laboral-educativo-menores"
DynamoDB → Lambda: certificados matching
Lambda → OpenAI API: prompt con contexto (catálogo + consulta + reglas)
OpenAI → Lambda: respuesta generada
Lambda → Frontend: lista formateada de certificados con metadata
Frontend → Ciudadano: guía orientativa renderizada
```

### 4.5 Flujo de Extracción desde Documento — Diagrama de Secuencia
Genera diagrama Mermaid (sequenceDiagram) del Proceso 2:

```
Ciudadano → Frontend: sube PDF / imagen / pega texto
Frontend → API Gateway: POST /extract { file | text }
API Gateway → Lambda (Document Extractor): invocación
Lambda → S3: almacena archivo temporalmente (si aplica)
Lambda → OpenAI API: envía contenido (Vision si imagen, GPT-4o si texto)
OpenAI → Lambda: lista de certificados identificados
Lambda → DynamoDB: mapea cada certificado contra el catálogo
DynamoDB → Lambda: metadata completa por certificado
Lambda → S3: elimina archivo temporal
Lambda → Frontend: guía orientativa con certificados extraídos
Frontend → Ciudadano: resultado renderizado
```

### 4.6 Arquitectura de Infraestructura AWS
Diagrama Mermaid (flowchart LR) mostrando el flujo completo:
- GitHub → GitHub Actions → CDK Deploy → AWS Account
- Dentro de AWS: CloudFront → S3 (frontend), API Gateway → Lambda →
  DynamoDB + S3 (docs temporales) + OpenAI API (externo), Cognito para auth

### 4.7 Principios y Patrones Arquitectónicos
Justifica cada uno brevemente:

| Principio / Patrón | Aplicación | Justificación |
|--------------------|------------|---------------|
| Serverless (FaaS) | Lambda + API Gateway | Sin servidores que gestionar; pago por uso; proyecto individual |
| RAG | OpenAI + catálogo DynamoDB | Conocimiento actualizable sin reentrenar; catálogo cambia por resoluciones |
| Datos efímeros | S3 temporal para documentos subidos | Minimización de datos (Ley 1581/2012): no persistir documentos del ciudadano |
| CQRS ligero | Handlers de lectura (query, extract) separados de escritura (admin, tickets) | Responsabilidades claras; facilita RBAC |
| IaC | CDK TypeScript | Infraestructura reproducible, versionada, auditable |
| Strangler Fig (futuro) | Catálogo local → integraciones reales con entidades | Evolución sin reescribir la interfaz del sistema |
| Trunk-based development | Rama principal + feature flags si es necesario | CI/CD simple para desarrollador individual |

### 4.8 Uso Justificado de LLM / RAG
La rúbrica exige justificación explícita. Cubre:

**¿Por qué RAG y no fine-tuning?**
El catálogo cambia por resoluciones de entidades. RAG permite actualizar el
conocimiento sin costo de reentrenamiento.

**¿Por qué OpenAI (GPT-4o) y no un modelo local?**
- Vision integrado en la misma API (necesario para imágenes subidas).
- Pay-per-use alineado con presupuesto de proyecto individual.
- Calidad de razonamiento suficiente para clasificación de propósitos y
  extracción de entidades desde documentos.

**¿Por qué dos proveedores de IA (OpenAI en prod, Claude en dev)?**
- Cada herramienta en su fortaleza: Claude Code es superior para asistencia
  de código y planeación; GPT-4o ofrece Vision integrado para el servicio.
- Demuestra capacidad de trabajar con múltiples proveedores del ecosistema.
- Permite comparación crítica documentada en la Entrega 4.

**Limitaciones aceptadas:**
- Latencia de llamada a API externa (~2-5s por consulta).
- Costo por token (mitigado con caching de consultas frecuentes).
- Riesgo de alucinación: mitigado con system prompt restrictivo que limita
  respuestas al contenido del catálogo.

### 4.9 Decisiones y Trade-offs
Mínimo 4 decisiones en formato:
"Se eligió X sobre Y porque Z. Limitación aceptada: W."

Ejemplo:
- Se eligió DynamoDB sobre PostgreSQL porque el esquema del catálogo es
  flexible y el modelo serverless elimina gestión de conexiones. Limitación:
  consultas complejas (joins) no son posibles — se compensa con diseño de
  claves adecuado.
- Se eligió procesamiento efímero de documentos (eliminar después de
  extracción) sobre persistencia para histórico, porque Ley 1581/2012
  exige minimización. Limitación: no se puede reanalizar un documento sin
  que el ciudadano lo suba de nuevo.
- Se eligió OpenAI Vision sobre OCR dedicado (Tesseract) porque simplifica
  la arquitectura (una sola API) y GPT-4o entiende contexto además de
  extraer texto. Limitación: costo por imagen más alto que OCR local.
- Se eligió CDK sobre Terraform porque el equipo (individual) ya usa
  TypeScript en el frontend y la coherencia reduce la curva de aprendizaje.
  Limitación: vendor lock-in con AWS.

---

## SECCIÓN 5 — Diseño Detallado del Software

### 5.1 Modelo de Datos — DynamoDB
Define esquemas con Partition Key y Sort Key:

**Certificate (catálogo)**
```
PK: CERT#<id>    SK: METADATA
{
  name: string             // Nombre del certificado
  issuer: string           // Entidad emisora
  purposes: string[]       // Propósitos (laboral, educativo, contratación, personal)
  legalBasis: string[]     // Normas regulatorias
  requirements: string[]   // Documentos/datos requeridos
  portalUrl: string        // URL del portal oficial
  estimatedDays: number    // Tiempo estimado en días hábiles
  validityDays: number     // Vigencia (0 = indefinida)
  isMandatoryForMinors: boolean  // True si aplica Ley 1918/2018
  practicalNotes: string[] // Observaciones: VPN, captcha, horarios, etc.
  lastVerified: string     // Fecha ISO de última verificación manual
}
```

**TicketRequest (solicitudes de nuevos trámites)**
```
PK: TICKET#<id>    SK: METADATA
{
  description: string
  submitterIp: string      // Para rate limiting
  status: "pending" | "approved" | "rejected"
  adminNotes: string
  createdAt: string
  resolvedAt: string
}
```

**UserCertificateStatus (estado personal del ciudadano)**
```
PK: USER#<userId>    SK: CERT#<certId>
{
  status: "pending" | "in_progress" | "obtained" | "expired"
  obtainedDate: string
  expirationDate: string
}
```

**RateLimitEntry (control de abuso)**
```
PK: RATELIMIT#<ip>    SK: TICKET
{
  lastSubmission: string   // ISO timestamp
  ttl: number              // DynamoDB TTL — auto-expire a las 24h
}
```

### 5.2 Diseño de la API REST
Define endpoints:

| Método | Ruta | Descripción | Auth | Rol |
|--------|------|-------------|------|-----|
| POST | /query | Consulta en lenguaje natural → guía orientativa | No | Público |
| POST | /extract | Sube documento/texto → extracción de certificados | No | Público |
| GET | /certificates | Lista paginada del catálogo | No | Público |
| GET | /certificates/{id} | Detalle de un certificado | No | Público |
| POST | /tickets | Solicitud de nuevo trámite (rate limited) | No | Público |
| GET | /me/certificates | Estado personal de trámites | Sí | Ciudadano |
| PUT | /me/certificates/{id} | Actualizar estado de un trámite | Sí | Ciudadano |
| GET | /me/export | Exportar guía personalizada en PDF | Sí | Ciudadano |
| GET | /admin/tickets | Listar solicitudes pendientes | Sí | Admin |
| PUT | /admin/tickets/{id} | Aprobar/rechazar solicitud | Sí | Admin |
| POST | /admin/certificates | Crear certificado en el catálogo | Sí | Admin |
| PUT | /admin/certificates/{id} | Actualizar certificado | Sí | Admin |
| DELETE | /admin/certificates/{id} | Eliminar certificado | Sí | Admin |

### 5.3 Componentes del Frontend (React)

| Componente | Responsabilidad |
|------------|-----------------|
| `QueryAssistant` | Campo de texto libre + renderizado de la guía orientativa |
| `DocumentUploader` | Panel de carga: drag-and-drop, paste, selección de archivos (PDF, TXT, MD, JPG, PNG) |
| `CertificateList` | Lista de certificados resultado con indicadores (obligatorio, en trámite, obtenido) |
| `CertificateDetail` | Detalle completo de un certificado: requisitos, portal, tiempos, observaciones prácticas |
| `UserDashboard` | Tablero personal: estado por trámite, alertas de vencimiento |
| `AdminPanel` | CRUD del catálogo + bandeja de tickets pendientes |
| `TicketForm` | Formulario de solicitud con honeypot oculto anti-bot |
| `ExportButton` | Genera y descarga PDF con la guía personalizada |

### 5.4 Diseño de Prompts para OpenAI (System Prompts)

**System prompt del Query Handler:**
```
Eres un asistente de orientación sobre certificados y trámites en Colombia.
Tu ÚNICA fuente de información es el catálogo que se te proporciona como
contexto. NO inventes certificados, entidades ni requisitos que no estén
en el catálogo. Si no encuentras la información, responde que el trámite
no está en el catálogo y sugiere usar el formulario de solicitud.
Responde en español. Sé conciso y práctico.
```

**System prompt del Document Extractor:**
```
Analiza el siguiente documento y extrae todos los certificados, trámites
o documentos oficiales que se mencionan o implican. Para cada uno, devuelve:
- Nombre del certificado tal como aparece o se infiere del texto.
- Entidad emisora probable.
Devuelve SOLO un JSON array. No inventes certificados que no estén
mencionados ni implícitos en el texto.
```

Nota: estos son los prompts base — se refinan durante la Entrega 3.

### 5.5 Seguridad
Cubre punto por punto:

| Aspecto | Implementación |
|---------|---------------|
| Autenticación | JWT via Cognito; tokens con expiración corta |
| Autorización | API Gateway valida JWT; Lambda verifica rol del claim |
| RBAC | 3 roles: público (no auth), ciudadano, admin |
| Rate limiting (tickets) | 1/IP/24h con TTL en DynamoDB + validación en Lambda |
| Rate limiting (API general) | API Gateway Usage Plans por IP |
| HTTPS | Obligatorio en todos los endpoints (CloudFront + ACM) |
| CORS | Restringido al dominio del frontend |
| Input validation | Pydantic en Lambda; validación de esquema antes de operación |
| File upload | Validación de tipo MIME, tamaño máximo (10MB), extensiones permitidas |
| Documentos subidos | Eliminados de S3 inmediatamente después de procesamiento |
| No PII en logs | CloudWatch no registra datos personales del ciudadano |
| Honeypot | Campo oculto en TicketForm; si llega con valor, se descarta |
| OWASP Top 10 | Línea base de seguridad; auditoría manual en Entrega 3 |

### 5.6 Principios de Diseño de Software

| Principio | Aplicación |
|-----------|------------|
| Single Responsibility | Cada Lambda handler tiene una sola responsabilidad |
| Dependency Inversion | Lógica de negocio usa repositorios abstractos, no SDK de AWS directamente |
| Open/Closed | Agregar certificados al catálogo no requiere cambios de código |
| Separation of Concerns | Catálogo (datos), lógica RAG (IA), presentación (frontend) son capas independientes |
| Bajo acoplamiento | Componentes del frontend no conocen la implementación de la API |
| Alta cohesión | Cada handler agrupa la lógica relacionada a un solo proceso de negocio |

### 5.7 Pipeline CI/CD

```
push → main
  ├── lint (Flake8 + ESLint)
  ├── type check (mypy + tsc)
  ├── unit tests (pytest + Jest)
  ├── CDK synth (validación de IaC)
  └── CDK deploy → AWS (solo si tests pasan, solo desde main)
```

Describe cada etapa brevemente y menciona que el pipeline es verificable
en el repositorio (`.github/workflows/`).

---

## USO DE IA GENERATIVA EN ESTA ENTREGA

Documenta:
- **Fase 1:** Diagramas Mermaid generados con Claude Code a partir de las
  decisiones técnicas definidas en `reestructuracion.md`. Validación:
  coherencia con los requerimientos de la Entrega 1.
- **Fase 2:** Esquema de datos y diseño de API revisados por Claude Code.
  Validación: cada endpoint traza a un RF de la Entrega 1.
- **Fase 3:** Revisión de seguridad — checklist OWASP Top 10 verificado.

Tabla de validación:
| Fase | Salida de la IA | Método de Validación | Estado |

---

## FORMATO

- Español, Markdown limpio para GitHub
- Diagramas en bloques ```mermaid
- Tablas para esquemas, endpoints, componentes
- Máximo 550 líneas de Markdown
- Sección de Decisiones y Trade-offs con mínimo 4 decisiones
- Anexos al final: Anexo A (este prompt), Anexo B (prompt de revisión
  arquitectónica), Anexo C (prompt de revisión de seguridad)
- Verificar coherencia: cada componente debe trazar a un proceso de la
  Entrega 1, cada endpoint a un RF, cada decisión de seguridad a un RNF

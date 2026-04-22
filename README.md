# CertiDoc — Portal Unificado de Gestion de Certificados (Colombia)

Proyecto: https://github.com/hdballestan/ISAIA_gupo1

**Nota de autoria individual:** Este proyecto es individual tras la escision formal del equipo original, autorizada por el docente. El historial de commits es verificable.

**Nota de reestructuracion:** El tema original (Sistema de Alerta Temprana de Desercion Universitaria) fue reemplazado. Motivos: (a) el feedback de la Entrega 1 senalo que el proceso no era claro y la fuente de datos era ambigua; (b) la escision del equipo requeria un proyecto viable para un solo desarrollador. El nuevo tema mantiene complejidad de actores, regulacion y procesos, y corrige el feedback con una fuente de datos publica y procesos explicitamente definidos.

## Datos del proyecto

- **Nombre:** CertiDoc - Portal Unificado de Gestion de Certificados (Colombia)
- **Autor:** Hever Ballesta - hdnallestan@unal.edu.co
- **Repositorio:** `ISAIA_gupo1` - Rama: `entrega_1`
- **Fecha de entrega original:** 28 de marzo de 2025
- **Refactorizacion:** 8 de abril de 2025

## Tabla de Contenidos

1. [Definicion del Problema y Contexto de Negocio](#1-definicion-del-problema-y-contexto-de-negocio)
2. [Diferenciador Clave](#2-diferenciador-clave)
3. [Analisis de Requerimientos](#3-analisis-de-requerimientos)
4. [Arquitectura y Diseno (Entrega 2 - 8 abr)](#4-arquitectura-y-diseno-entrega-2---8-abr)
5. [Diseno Detallado del Software (Entrega 2 - 8 abr)](#5-diseno-detallado-del-software-entrega-2---8-abr)
6. [Construccion y Codigo (Entrega 3 - 15 abr)](#6-construccion-y-codigo-entrega-3---15-abr)
7. [Pruebas y Calidad (Entrega 3 - 15 abr)](#7-pruebas-y-calidad-entrega-3---15-abr)
8. [Uso de IA Generativa (Entrega 4 - 22 abr)](#8-uso-de-ia-generativa-entrega-4---22-abr)
9. [Consideraciones Eticas (Entrega 4 - 22 abr)](#9-consideraciones-eticas-entrega-4---22-abr)
10. [Producto Final (25 abr)](#10-producto-final-25-abr)

---

## 1. Definicion del Problema y Contexto de Negocio

### El problema

Obtener certificados en Colombia es un proceso fragmentado. Cada entidad emisora opera con su propio portal, requisitos, horarios y particularidades tecnicas:

- Antecedentes judiciales: Policia Nacional (`policia.gov.co`) - tramite en linea con captcha.
- Antecedentes disciplinarios: Procuraduria (`procuraduria.gov.co`) - portal independiente.
- Registro de inhabilitados para trabajo con menores: ICBF (Ley 1918/2018) - en algunos escenarios requiere VPN institucional.
- Antecedentes penales: Fiscalia - canal y flujo separados.
- Certificados de Registraduria, Contraloria y otras entidades: cada uno con logica propia.

**Problema central:** no existe un punto unificado donde la ciudadania pueda identificar que certificados necesita segun su objetivo (empleo, educacion, contratacion publica), en que entidad se tramita cada uno, que requisitos exige cada proceso y que particularidades tecnicas tiene. Esta fragmentacion genera perdida de tiempo, errores de gestion y desplazamientos innecesarios. El Decreto 19/2012 (Anti-tramites) reconoce la necesidad de simplificacion, pero en la practica el flujo sigue distribuido.

### Alcance explicito

**Que hace el sistema:**

- Consolida informacion de certificados de multiples entidades en un dashboard de orientacion.
- Recomienda certificados segun el proposito del ciudadano.
- Muestra entidad emisora, portal oficial, requisitos, tiempos estimados y observaciones practicas (VPN, captcha, horarios, restricciones).
- Permite subir documento o pegar texto para extraer certificados requeridos con apoyo de IA y mapearlos al catalogo.

**Que NO hace el sistema:**

- No descarga ni emite certificados.
- No realiza scraping de portales gubernamentales.
- No interactua directamente con sistemas transaccionales de entidades emisoras.
- El ciudadano siempre completa el tramite en el portal oficial correspondiente.

### Tabla de actores

| Actor | Rol |
|---|---|
| Ciudadano | Consulta orientacion, sube documentos para extraccion, marca estado de tramites y solicita nuevas entradas al catalogo |
| Empleador | Consulta certificados a exigir para un cargo especifico |
| Institucion educativa | Verifica obligaciones relacionadas con trabajo con menores (Ley 1918/2018) |
| Policia Nacional | Entidad emisora referenciada para antecedentes judiciales |
| ICBF | Entidad emisora referenciada para registro de inhabilitados |
| Fiscalia / Procuraduria | Entidades emisoras referenciadas para antecedentes penales y disciplinarios |
| Administrador del sistema | Gestiona catalogo y modera solicitudes de nuevos tramites |

### Procesos de negocio

**Proceso 1 - Consulta orientada por proposito**

| Paso | Accion | Actor |
|---|---|---|
| 1 | El ciudadano describe su situacion en lenguaje natural | Ciudadano |
| 2 | La IA clasifica el proposito y consulta el catalogo | Sistema (OpenAI) |
| 3 | El sistema responde lista de certificados con entidad, portal, requisitos, tiempo y observaciones | Sistema |
| 4 | El ciudadano revisa la guia y realiza cada tramite en su portal oficial | Ciudadano |
| 5 | Opcional: marca estado de avance en tablero personal | Ciudadano |

**Proceso 2 - Extraccion desde documento**

| Paso | Accion | Actor |
|---|---|---|
| 1 | El ciudadano sube PDF/TXT/MD/imagen o pega texto | Ciudadano |
| 2 | La IA analiza el contenido (GPT-4o y Vision para imagenes) | Sistema (OpenAI) |
| 3 | Se identifican certificados mencionados o implicitos | Sistema |
| 4 | Se mapean resultados contra el catalogo y se genera guia orientativa | Sistema |
| 5 | El ciudadano continua con el flujo de consulta orientada | Ciudadano |

**Proceso 3 - Solicitud de adicion de tramite**

| Paso | Accion | Actor |
|---|---|---|
| 1 | El ciudadano envia formulario cuando no encuentra un tramite | Ciudadano |
| 2 | Se valida rate limit (1/IP/24h) y campo honeypot | Sistema |
| 3 | Se crea ticket con estado pendiente | Sistema |
| 4 | El administrador revisa la solicitud | Administrador |
| 5 | Si procede, se agrega al catalogo; si no, se rechaza con motivo | Administrador |

### Reglas de negocio

| # | Regla |
|---|---|
| 1 | El catalogo de certificados es la fuente central y unica para orientar consultas |
| 2 | Toda consulta en lenguaje natural se clasifica por proposito antes de filtrar el catalogo |
| 3 | Certificados asociados a Ley 1918/2018 se marcan como obligatorios en contextos de trabajo con menores |
| 4 | El sistema solo orienta: no descarga, no emite y no reemplaza certificados oficiales |
| 5 | Se senalan casos compatibles con principio anti-tramites del Decreto 19/2012 |
| 6 | Se aplica consentimiento, minimizacion y finalidad para datos personales (Ley 1581/2012) |
| 7 | Solicitudes de adicion: maximo 1 por IP cada 24 horas, con moderacion manual obligatoria |
| 8 | Cada entrada del catalogo debe incluir observaciones practicas verificadas |

### Marco regulatorio

| Regulacion | Relevancia |
|---|---|
| Ley 1918/2018 | Registro de inhabilitados para trabajo con menores y obligaciones asociadas |
| Decreto 19/2012 | Simplificacion de tramites y no exigencia de documentos ya disponibles en el Estado |
| Ley 1581/2012 | Proteccion de datos personales: consentimiento, minimizacion y finalidad |
| Ley 1273/2009 | Base legal para controles de seguridad frente a delitos informaticos |

### Restricciones del problema

- **Fuente de datos:** catalogo manual construido desde informacion publica, sin depender de APIs gubernamentales para el MVP.
- **Mantenimiento:** requisitos de entidades cambian periodicamente y requieren proceso continuo de actualizacion.
- **Cobertura inicial:** prioriza certificados frecuentes para escenarios laborales y educativos.
- **Presupuesto:** implementacion individual con arquitectura serverless en AWS para reducir costos operativos.
- **Variabilidad tecnica:** portales con VPN, captcha, horarios y restricciones; esta variabilidad es parte del valor del sistema.

---

## 2. Diferenciador Clave

### Comparativo: portales actuales vs CertiDoc

| Aspecto | Portales actuales (por entidad) | CertiDoc |
|---|---|---|
| Alcance | Un tipo de certificado por portal | Catalogo unificado de certificados relevantes |
| Orientacion | Asume que el ciudadano ya sabe que necesita | El ciudadano describe su objetivo y el sistema deduce certificados |
| Requisitos | Informacion heterogenea y dispersa | Guia estructurada con requisitos, tiempos y observaciones verificadas |
| Extraccion desde documento | No disponible | Analisis de texto/archivo/imagen para identificar certificados solicitados |
| Seguimiento personal | No existe entre entidades | Tablero para estado por tramite |
| Observaciones practicas | Generalmente no estandarizadas | Incluye VPN, captcha, horarios y restricciones reales |
| IA | Sin componente de IA | Asistente conversacional + extraccion asistida por IA |
| Actualizacion | Aislada por entidad | Catalogo centralizado con solicitudes ciudadanas moderadas |

Los portales existentes responden principalmente "como tramito este certificado". CertiDoc responde primero "que certificados necesito para este proposito" y "que me estan pidiendo en este documento". La propuesta opera en una capa de orientacion y consolidacion que actualmente no esta integrada de forma publica en un unico flujo.

### Resumen de la solucion (detalle tecnico en Entrega 2)

- Catalogo de certificados en DynamoDB, estructurado desde fuentes publicas.
- Asistente conversacional con OpenAI GPT-4o sobre el catalogo.
- Extraccion de documentos con GPT-4o (texto) y Vision (imagenes).
- API REST sobre AWS Lambda (Python) y API Gateway.
- Frontend en React + TypeScript desplegado en S3 + CloudFront.
- Autenticacion con Amazon Cognito.
- Infraestructura como codigo con AWS CDK (TypeScript).
- CI/CD con GitHub Actions hacia AWS.
- IA para desarrollo: Claude Code para planeacion, prompts y soporte de implementacion.

---

## 3. Analisis de Requerimientos

> Los requerimientos aplican criterios SMART: cada uno es especifico (capacidad concreta), medible (criterio de aceptacion verificable), alcanzable (tecnologia seleccionada lo soporta), relevante (trazado a actor, proceso o regulacion) y acotado en tiempo (entrega objetivo).

### 3.1 Requerimientos Funcionales

| ID | Requerimiento | Prioridad | Actor | Criterio de aceptacion |
|---|---|---|---|---|
| RF-01 | Mantener catalogo de certificados con: nombre, entidad, propositos, base legal, requisitos, URL portal, tiempo estimado, vigencia, obligatoriedad Ley 1918 y observaciones practicas | Indispensable | Admin | Catalogo consultable con ≥10 certificados verificados en MVP |
| RF-02 | Recibir consultas en lenguaje natural y clasificarlas por proposito (laboral, educativo, contratacion publica, personal) | Indispensable | Ciudadano | Clasificacion correcta ≥80% en set de pruebas de 20 consultas |
| RF-03 | Generar lista orientativa de certificados segun proposito, con entidad, portal, requisitos, tiempo y observaciones | Indispensable | Ciudadano | Respuesta incluye todos los campos del catalogo por certificado |
| RF-04 | Permitir subida de archivos PDF, TXT y MD (≤10MB) para extraccion de certificados | Indispensable | Ciudadano | Extraccion exitosa de ≥1 certificado en documento de prueba |
| RF-05 | Permitir subida de imagenes JPG y PNG (≤10MB) para extraccion mediante vision artificial | Indispensable | Ciudadano | Extraccion de ≥1 certificado en imagen legible de prueba |
| RF-06 | Permitir pegar texto en panel para extraccion sin subir archivo | Indispensable | Ciudadano | Textarea funcional con misma logica de extraccion que RF-04 |
| RF-07 | Mapear certificados extraidos contra catalogo y devolver guia orientativa. Menciones no catalogadas aparecen como lista "no verificable" sin link | Indispensable | Sistema | Certificados del catalogo se muestran con ficha completa; menciones no catalogadas se listan en seccion separada sin portal ni amenazas |
| RF-08 | Checklist personal por certificado (catalogado y no catalogado) con persistencia en localStorage. Trade-off: persiste en el dispositivo pero no entre dispositivos | Deseable | Ciudadano | Checkbox por fila; estado persiste tras recargar; contador N/M completados visible; boton de limpieza disponible |
| RF-09 | Alertas cuando un certificado obtenido se acerque a vencimiento | Deseable | Ciudadano | Alerta visible ≥7 dias antes de vencimiento |
| RF-10 | Formulario publico para solicitar adicion de nuevos tramites al catalogo | Indispensable | Ciudadano | Ticket creado con estado pendiente verificable en base de datos |
| RF-11 | Rate limiting de solicitudes de adicion: 1 por IP cada 24 horas, con honeypot anti-bot | Indispensable | Sistema | Segunda solicitud desde misma IP en <24h rechazada con HTTP 429 |
| RF-12 | Panel de administracion para CRUD del catalogo y aprobacion/rechazo de tickets | Indispensable | Admin | Operaciones crear, editar, eliminar y moderar verificables en panel |
| RF-13 | Control de acceso basado en roles: publico, ciudadano y administrador | Indispensable | Todos | Endpoint protegido rechaza acceso sin rol adecuado con HTTP 403 |
| RF-14 | Exportacion de guia personalizada en PDF | Deseable | Ciudadano | PDF descargable con certificados y estados del usuario |

### 3.2 Requerimientos No Funcionales

| ID | Requerimiento | Categoria |
|---|---|---|
| RNF-01 | Tratamiento de datos personales conforme a Ley 1581/2012: consentimiento explicito, minimizacion y finalidad | Legal |
| RNF-02 | Disponibilidad ≥ 99.5% en horario habil (lun-vie 7am-7pm COT) | Disponibilidad |
| RNF-03 | Respuesta del asistente conversacional < 5s en percentil 95 | Rendimiento |
| RNF-04 | Extraccion de documentos < 10s en percentil 95 | Rendimiento |
| RNF-05 | Infraestructura reproducible con AWS CDK sin pasos manuales de aprovisionamiento | Operacion |
| RNF-06 | Cambios al catalogo registrados con fecha, autor y valores anteriores | Auditoria |
| RNF-07 | Cumplimiento de OWASP Top 10 como linea base de seguridad | Seguridad |
| RNF-08 | Certificados agregables al catalogo sin modificar ni redesplegar codigo | Mantenibilidad |
| RNF-09 | Formularios publicos con honeypot y rate limiting activos | Seguridad |
| RNF-10 | Documentos del ciudadano procesados exclusivamente en el navegador (client-side); ningun archivo es transmitido ni almacenado en servidor | Privacidad |

### 3.3 Uso de IA Generativa en el Analisis

Se utilizo IA Generativa (Claude Code, Anthropic) en tres fases. Todos los resultados fueron validados manualmente.

**Fase 1 — Reestructuracion del tema.**
Prompt `.prompts/reestructuracion.md` usado para que Claude analizara las propuestas originales, evaluara viabilidad y produjera la propuesta formal de cambio de tema. Resultado contrastado con la rubrica y el feedback del docente.

**Fase 2 — Generacion del documento.**
Prompt `.prompts/entrega_1_new.md` usado para generar estructura y contenido. Actores, procesos y reglas verificados contra fuentes regulatorias citadas.

**Fase 3 — Revision y correccion.**
Prompts de revision aplicados para verificar coherencia interna, cobertura de rubrica y trazabilidad. Documentados en `.prompts/correcciones/`.

| Fase | Salida de la IA | Metodo de validacion | Estado |
|---|---|---|---|
| Reestructuracion | Propuesta de cambio de tema con actores y procesos | Contraste con rubrica y feedback docente | Validado |
| Generacion | Documento estructurado de Entrega 1 | Verificacion de fuentes regulatorias y coherencia | Validado |
| Revision | Lista de problemas y correcciones | Revision manual punto a punto | Validado |

### 3.4 Trazabilidad de Requerimientos

| ID Req | Trazado a | Tipo |
|---|---|---|
| RF-01 | Admin (Actor); RN-1, RN-8 | Actor / Regla de negocio |
| RF-02 | Ciudadano (Actor); Proceso 1 paso 2; RN-2 | Actor / Proceso / RN |
| RF-03 | Ciudadano (Actor); Proceso 1 paso 3 | Actor / Proceso |
| RF-04 | Ciudadano (Actor); Proceso 2 paso 1 | Actor / Proceso |
| RF-05 | Ciudadano (Actor); Proceso 2 paso 2 | Actor / Proceso |
| RF-06 | Ciudadano (Actor); Proceso 2 paso 1 (variante texto) | Actor / Proceso |
| RF-07 | Proceso 2 pasos 3-4; RN-1 | Proceso / RN |
| RF-08 | Ciudadano (Actor); Proceso 1 paso 5 | Actor / Proceso |
| RF-09 | RN-8 (vigencia como parte de observaciones practicas) | Regla de negocio |
| RF-10 | Ciudadano (Actor); Proceso 3 paso 1 | Actor / Proceso |
| RF-11 | Proceso 3 paso 2; RN-7 | Proceso / RN |
| RF-12 | Admin (Actor); Proceso 3 pasos 4-5 | Actor / Proceso |
| RF-13 | RN-6; Ley 1581/2012; RNF-01 | RN / Regulacion / RNF |
| RF-14 | Ciudadano (Actor) | Actor |
| RNF-01 | Ley 1581/2012 | Regulacion |
| RNF-02 | Restriccion de presupuesto (serverless) | Restriccion |
| RNF-03 | Proceso 1 (experiencia de consulta) | Proceso |
| RNF-04 | Proceso 2 (experiencia de extraccion) | Proceso |
| RNF-05 | Restriccion de presupuesto (reproducibilidad) | Restriccion |
| RNF-06 | RN-1 (catalogo como fuente de verdad) | Regla de negocio |
| RNF-07 | Ley 1273/2009 | Regulacion |
| RNF-08 | RN-1 (catalogo actualizable sin redeploy) | Regla de negocio |
| RNF-09 | RN-7 (control de abuso) | Regla de negocio |
| RNF-10 | Ley 1581/2012 (minimizacion) | Regulacion |

---

## 4. Arquitectura y Diseño (Entrega 3 - 17 abr)

> Arquitectura simplificada implementada en Entrega 3. El stack original de Entrega 2 (AWS Lambda, DynamoDB, CDK, Cognito) fue reemplazado por FastAPI + PostgreSQL + Docker Compose para acelerar desarrollo individual. Consultar `.prompts/discusion/cambios_entrega_3.md` para decisiones.

### 4.1 Vista de contexto simplificada

```mermaid
flowchart LR
  C[Ciudadano]
  A[Administrador]
  S[CertiDoc\nPortal Unificado]
  P[Portales oficiales\nPolicia / Procuraduria / ICBF / Fiscalia]
  DB[(PostgreSQL\nCatálogo + Tickets)]

  C -->|Extrae certificados<br/>Consulta catálogo| S
  A -->|Gestiona catálogo<br/>Modera tickets| S
  S -->|Entrega URLs| P
  S -->|Lee/escribe| DB
```

### 4.2 Vista de contenedores

```mermaid
flowchart LR
  U[Usuario]
  FE[React + Vite<br/>Vercel / localhost:5173]
  BE[FastAPI<br/>Railway / uvicorn:8000]
  DB[(PostgreSQL<br/>Railway / localhost:5432)]

  U -->|Browser| FE
  FE -->|HTTP REST| BE
  BE -->|SQL| DB
```

**Nota:** pdf.js + Tesseract.js se ejecutan en el navegador. OCR client-side, sin enviar documentos al servidor.

| Componente | Tecnología | Responsabilidad |
|---|---|---|
| Frontend | React + Vite | Extracción PDF/imagen, formularios, tabla certificados, panel admin |
| Backend | FastAPI (Python) | API REST, CRUD catálogo, rate limit, auth JWT |
| Base de datos | PostgreSQL | Certificados, usuarios, tickets, rate limits |
| Despliegue | Docker Compose (dev), Railway + Vercel (prod) | Reproducibilidad y escalabilidad sin overhead |

### 4.3 Flujos principales

**Extracción de certificados:**
1. Usuario sube PDF/imagen o pega texto → FE extrae con pdf.js/Tesseract.js
2. FE envía texto/base64 a `POST /api/v1/extract`
3. BE hace regex matching contra catálogo PostgreSQL
4. FE renderiza matches en tabla, resaltando certificados encontrados

**Health check de portales:**
```bash
# En el navegador, cada 10 minutos
curl -I https://portal-oficial.gov.co
# HEAD no-cors → respuesta opaca = "Funcionando"
#              → network error = "Sin acceso"
```

Resultado guardado en tabla con timestamp "Última consulta: HH:MM".

### 4.4 Decisiones arquitectónicas

| Decisión | Anterior | Actual | Razón |
|---|---|---|---|
| Backend | AWS Lambda + API Gateway | FastAPI | Debugging simple, sin cold starts |
| Base de datos | DynamoDB | PostgreSQL | SQL estándar, joins, migraciones |
| Auth | Cognito | JWT + bcrypt | Control total, sin deps AWS |
| Frontend hosting | S3 + CloudFront | Vercel | Deploy automático |
| OCR | OpenAI Vision | Tesseract.js client-side | Sin costo de tokens, privacidad |
| Identificación certs | OpenAI RAG | Regex sobre catálogo | Costo 0, predecible, actualizablo sin redeploy |
| IaC | CDK TypeScript | Docker Compose | Ligero, reproducible |

### 4.5 Principios de diseño aplicados

| Principio | Aplicación |
|---|---|
| Procesamiento en cliente | PDF, OCR e imagen se extraen en el navegador (pdf.js + Tesseract.js). Documentos nunca salen del dispositivo → cumplimiento Ley 1581/2012 |
| Catálogo centralizado | PostgreSQL es fuente única de verdad. Regex matching es predecible y no requiere reentrenamiento |
| Simplicidad operativa | FastAPI + PostgreSQL = menos dependencias, debugging directo, escalabilidad lineal |
| Seguridad por defecto | Rate limiting, JWT con expiracion, CORS restrictivo, validacion entrada con Pydantic |
| Health checks periódicos | Cliente ejecuta HEAD requests cada 10 minutos a portales; timestamp visible → usuario sabe cuándo fue la última consulta |
| Trazabilidad local del ciudadano | Checklist en localStorage (`certidoc.checklist`): cero backend, cero autenticación requerida. Trade-off: no sincroniza entre dispositivos, satisface el 80% del valor del RF-08 |

---

## 5. Diseño Detallado del Software (Entrega 2 - 8 abr)

Esta seccion cierra el diseno detallado con el estado real del codigo.
La fuente tecnica usada fue la API FastAPI actual (misma estructura visible en
`/docs`) y los componentes reales del frontend.

### 5.1 Modelo de datos PostgreSQL real

Mapa logico a tablas reales:

| Modelo logico | Tabla real en BD |
|---|---|
| certificates | `certificates` |
| users | `users` |
| tickets | `ticket_requests` |
| rate_limits | `rate_limit_entries` |

Campos principales por tabla:

| Tabla | Campos clave |
|---|---|
| `certificates` | `id`, `name`, `issuer`, `purposes`(JSON), `legal_basis`(JSON), `requirements`(JSON), `portal_url`, `estimated_days`, `validity_days`, `is_mandatory_for_minors`, `practical_notes`(JSON), `regex_patterns`(JSON), `last_verified`, `created_at`, `updated_at` |
| `users` | `id`, `email`(unique), `hashed_password`, `role`, `created_at` |
| `ticket_requests` | `id`, `description`, `submitter_ip`, `status`, `admin_notes`, `created_at`, `resolved_at` |
| `rate_limit_entries` | `id`, `ip_address`, `endpoint`, `last_request`, `created_at` |

Relaciones de uso:

- `users` define autenticacion y roles.
- `certificates` es la fuente de verdad del catalogo y del matcher.
- `ticket_requests` gestiona moderacion ciudadana.
- `rate_limit_entries` protege el endpoint de tickets (1 IP por 24h).

### 5.2 Diagrama de componentes frontend actual

```mermaid
flowchart TD
  U[Ciudadano]
  L[Layout]
  E[Extract page]
  DU[DocumentUploader]
  CT[CertificateTable]
  TF[TicketForm]
  AP[AdminPanel]
  API[services/api.js]
  OCR[services/ocr.js]
  PDF[services/pdf.js]
  HM[services/health.js]
  MX[utils/matcher.js]

  U --> L
  L --> E
  E --> DU
  E --> CT
  E --> TF
  L --> AP

  DU --> OCR
  DU --> PDF
  DU --> MX
  E --> API
  E --> HM
  AP --> API
  TF --> API
  CT --> API
```

Responsabilidad de componentes solicitados:

| Componente | Rol en el flujo |
|---|---|
| `DocumentUploader` | Recibe PDF/imagen/texto, extrae texto en cliente y ejecuta matching |
| `CertificateTable` | Muestra catalogo, resultados encontrados, estado de portales y threat-check |
| `AdminPanel` | Vista operativa para revisar tickets y administrar catalogo |
| `TicketForm` | Captura solicitudes ciudadanas con honeypot y feedback |
| `Layout` | Estructura global, contexto legal y contenedor de rutas |

### 5.3 API REST completa (request/response)

Base path: `/api/v1`

| Endpoint | Request schema | Response schema |
|---|---|---|
| `GET /certificates` | Query opcional `purpose: str(3..50)` | `{ items: CertificateResponse[], total: int }` |
| `GET /certificates/{certificate_id}` | Path `certificate_id: int` | `CertificateResponse` |
| `POST /certificates/{certificate_id}/threat-check` | Body opcional `{ portal_url?: string }` | `{ threat_level: string, note: string\|null, last_scan: datetime\|null }` |
| `POST /extract` | `{ text: string(1..300000) }` | `{ matches: object[], total: int }` |
| `POST /tickets` | `{ description: string(10..5000), honeypot: string }` | `201: { id: int, status: string, message: string }` (si honeypot tiene valor, responde `200` con estado recibido) |
| `POST /auth/register` | `{ email: string(5..255), password: string(8..128) }` | `{ access_token: string, token_type: string, role: string }` |
| `POST /auth/login` | `{ email: string(5..255), password: string(8..128) }` | `{ access_token: string, token_type: string, role: string }` |
| `GET /admin/tickets` | Header `Authorization: Bearer <token>` (rol admin) | `AdminTicketResponse[]` |
| `PUT /admin/tickets/{ticket_id}` | `{ status: "pending\|approved\|rejected", admin_notes: string<=2000 }` | `AdminTicketResponse` |
| `POST /admin/certificates` | `CertificateCreateRequest` | `CertificateResponse` |
| `PUT /admin/certificates/{certificate_id}` | `CertificateCreateRequest` | `CertificateResponse` |
| `DELETE /admin/certificates/{certificate_id}` | Path `certificate_id: int` | `{ status: "deleted" }` |

`CertificateResponse` incluye los campos de catalogo: `id`, `name`, `issuer`,
`purposes`, `legal_basis`, `requirements`, `portal_url`, `estimated_days`,
`validity_days`, `is_mandatory_for_minors`, `practical_notes`,
`regex_patterns`, `last_verified`.

Contrato comun de error:

```json
{
  "error": {
    "code": "<status_code>",
    "message": "mensaje",
    "details": []
  }
}
```

### 5.4 Flujos principales con diagramas de secuencia

Extraccion desde documento:

```mermaid
sequenceDiagram
  participant C as Ciudadano
  participant DU as DocumentUploader
  participant S as OCR/PDF/Matcher cliente
  participant BE as FastAPI
  participant DB as PostgreSQL

  C->>DU: Sube PDF, imagen o pega texto
  DU->>S: Extraer texto y aplicar regex local
  DU->>BE: GET /api/v1/certificates
  BE->>DB: Consulta catalogo
  DB-->>BE: Registros
  BE-->>DU: items + total
  S-->>DU: IDs encontrados
  DU-->>C: Tabla con certificados encontrados
```

Threat-check bajo demanda:

```mermaid
sequenceDiagram
  participant C as Ciudadano
  participant CT as CertificateTable
  participant BE as FastAPI
  participant DB as PostgreSQL
  participant VT as VirusTotal

  C->>CT: Click en Revisar amenazas
  CT->>BE: POST /api/v1/certificates/{id}/threat-check
  BE->>DB: Lee portal_url si hace falta
  DB-->>BE: URL objetivo
  BE->>VT: Consulta de reputacion
  VT-->>BE: Resultado o fallo
  BE-->>CT: threat_level (safe, suspicious, malicious, unavailable)
  CT-->>C: Estado visible en la fila
```

Creacion de ticket ciudadano:

```mermaid
sequenceDiagram
  participant C as Ciudadano
  participant TF as TicketForm
  participant BE as FastAPI
  participant RL as RateLimit
  participant DB as PostgreSQL

  C->>TF: Envia descripcion del tramite
  TF->>BE: POST /api/v1/tickets
  BE->>BE: Valida honeypot
  BE->>RL: Verifica 1 IP por 24h
  RL-->>BE: Permitido o 429
  BE->>DB: Inserta ticket en ticket_requests
  DB-->>BE: id y estado
  BE-->>TF: Ticket creado
  TF-->>C: Confirmacion en pantalla
```

---

## 6. Construccion y Codigo (Entrega 3 - 15 abr)

### 6.1 Estado actual de implementacion

- Backend FastAPI con API versionada en `/api/v1`.
- Frontend React + Vite con integracion a API real via `VITE_API_URL`.
- Extraccion client-side de PDF e imagenes (pdf.js + Tesseract.js), sin enviar documentos originales al backend.
- Seguridad base activa: JWT con expiracion de 60 minutos, CORS restringido por variable `FRONTEND_ORIGIN`, honeypot y rate limit en tickets.
- Revision de amenazas con VirusTotal bajo demanda por fila (no bloquea carga de catalogo).
- Extraccion dual: certificados del catalogo identificados por regex (ficha completa con portal y amenazas) + menciones no catalogadas listadas como "no verificable" (sin link ni verificacion de portal).

### 6.2 Dependencias y fuentes de verdad

- Backend: `backend/pyproject.toml` + `backend/uv.lock` (gestion con `uv`).
- Frontend: `frontend/package.json` (gestion con `npm`).
- Variables de entorno documentadas en:
  - `backend/.env.example`
  - `frontend/.env.example`

### 6.3 Ejecucion local con Docker Compose

Requisito: Docker Desktop con `docker compose` habilitado.

```bash
docker compose up --build
```

Servicios:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- Swagger: `http://localhost:8000/docs`
- PostgreSQL: `localhost:5432`

### 6.4 Ejecucion local sin Docker

Backend:

```bash
cd backend
uv sync --frozen --dev
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

### 6.5 Despliegue

- Backend objetivo: Railway.
- Frontend objetivo: Vercel.
- Flujo de deploy automatizado configurado en `.github/workflows/deploy.yml`.
- Trigger de deploy: manual (`workflow_dispatch`) o por tag `v*`.

### 6.6 Contrato de API

- Base path: `/api/v1`
- Endpoints públicos clave:
  - `GET /api/v1/certificates` — lista catálogo completo
  - `GET /api/v1/certificates/{id}` — detalle de certificado
  - `POST /api/v1/certificates/{id}/threat-check` — revision de amenaza por certificado (bajo demanda)
  - `POST /api/v1/extract` — extracción de texto/base64 y matching
  - `POST /api/v1/tickets` — crear solicitud de nuevo trámite (rate-limited 1/IP/24h)
  - `POST /api/v1/auth/register` — registrar usuario
  - `POST /api/v1/auth/login` — obtener JWT
- Endpoints admin (requieren rol `admin`):
  - `GET /api/v1/admin/tickets` — listar tickets pendientes
  - `PUT /api/v1/admin/tickets/{id}` — aprobar/rechazar ticket
  - `POST /api/v1/admin/certificates` — agregar certificado
  - `PUT /api/v1/admin/certificates/{id}` — actualizar certificado
  - `DELETE /api/v1/admin/certificates/{id}` — eliminar certificado

**Health check de portales (client-side):**

Cada 10 minutos, el frontend ejecuta:

```bash
curl -I https://portal-oficial.gov.co
# HEAD no-cors: respuesta opaca = "Funcionando"
#            network error = "Sin acceso"
# Timestamp visible: "Última consulta: HH:MM"
```

Esquema de error común:

```json
{
  "error": {
    "code": "<status_code>",
    "message": "mensaje",
    "details": []
  }
}
```

**Contrato de `threat-check`:**

```json
POST /api/v1/certificates/{id}/threat-check
{
  "portal_url": "https://portal-opcional.gov.co"
}
```

- `portal_url` es opcional. Si llega en el body, se usa como prioridad; si no, se usa `portal_url` del certificado en BD.
- Respuesta:

```json
{
  "threat_level": "safe|suspicious|malicious|unavailable",
  "note": "detalle",
  "last_scan": "2026-04-17T18:01:26.403539Z"
}
```

- `GET /api/v1/certificates` no consulta VirusTotal. La revision se hace solo por click en tabla (`Revisar amenazas`).

---

## 7. Pruebas y Calidad (Entrega 3 - 15 abr)

### 7.1 Pipeline de CI

Archivo: `.github/workflows/ci.yml`.

Se ejecuta en cada `push` y `pull_request` con dos jobs:

1. Backend
   - `uv sync --frozen --dev`
   - `uv run flake8`
   - `uv run pytest`
2. Frontend
   - `npm install`
   - `npm run lint` (eslint)
   - `npm run test` (vitest)

### 7.2 Estrategia de pruebas

- Unitarias backend: servicio de matching (`app/services/matcher.py`).
- Integracion backend: flujo de auth, permisos admin, rate limit y CRUD de certificados via API.
- Unitarias frontend: `matchCertificates` en `frontend/src/utils/matcher.js`.
- Funcionales frontend (smoke): render basico de componentes principales sin errores.
- Cobertura objetivo: funciones criticas y validacion de requisitos funcionales; no se exige 100%.

### 7.3 Criterios de calidad aplicados

- Lint backend con flake8 (`max-line-length = 88`).
- Lint frontend con eslint.
- Pruebas backend con pytest.
- Pruebas frontend con vitest.
- Contrato de error uniforme en backend: `{ "error": { "code", "message", "details" } }`.

### 7.4 Evidencia de ejecucion

Comandos usados para evidencia local:

```bash
cd backend
uv run pytest

cd ../frontend
npm run test
```

Resultados obtenidos (ejecución local 2026-04-14):

- `pytest`: 6 tests aprobados.
- `vitest`: 4 tests aprobados en 2 archivos.
- `flake8`: sin errores tras configurar `backend/.flake8`.
- `eslint`: sin errores (`npm run lint`).

### 7.5 Notas de verificacion

- El pipeline de deploy no se ejecuta por cada push a `main`.
- El deploy solo se dispara manualmente o por versionado con tags.

### 7.6 Cobertura de rubrica Entrega 3

| Criterio rubrica | Evidencia en repo | Estado |
|---|---|---|
| Calidad de codigo y estructura | `backend/app`, `frontend/src`, convenciones PEP8 + componentes por archivo | Cubierto |
| Coherencia con diseno implementado | Secciones 4 y 6 del README + endpoints reales en FastAPI | Cubierto |
| Control de versiones | Historial Git de rama activa + tareas en `tasks/` | Cubierto |
| Gestion de dependencias y config | `backend/pyproject.toml`, `backend/uv.lock`, `frontend/package.json`, `docker-compose.yml`, `.env.example` | Cubierto |
| Uso responsable de GenAI en implementacion | Evidencia en `.prompts/` y `.prompts/discusion/` | Cubierto |
| Estrategia de pruebas | Seccion 7.2 | Cubierto |
| Cobertura unitaria/integracion | `backend/tests`, `frontend` (vitest) documentado en 7.4 | Parcial |
| Evidencia de ejecucion y resultados | Seccion 7.4 (pytest, vitest, flake8, eslint) | Cubierto |
| Validacion de requisitos funcionales | Matriz de RF en seccion 3 + pruebas y checks manuales de flujo | Parcial |
| Gestion de defectos | Ajustes registrados por tareas (`tasks/`) y discusiones (`.prompts/discusion/`) | Parcial |

**Faltantes puntuales recomendados para cerrar Entrega 3 al 100%:**

1. Adjuntar reporte de cobertura (pytest + vitest) en archivo versionado.
2. Consolidar un documento corto de trazabilidad "RF -> prueba/chequeo" con evidencia de resultado.
3. Registrar defectos corregidos en formato simple (id, causa, fix, fecha) para fortalecer criterio de QA.

---

## 8. Uso de IA Generativa (Entrega 4 - 22 abr)

La IA se uso como herramienta de productividad con control humano estricto.
Cada salida se valido con checklist manual por tarea (coherencia con rubrica,
coherencia con codigo real y evidencia verificable antes de integrar).

Este enfoque permitio acelerar documentacion, revision tecnica y deteccion de
inconsistencias, sin delegar decisiones finales. Tambien confirmo que para
pedir bien a la IA se necesita conocimiento del tema y del contexto del repo.

Detalle completo en:

- `docs/entrega_4/informe_genai.md`
- `docs/entrega_4/prompts_catalogo.md`
- `docs/entrega_4/evaluacion_critica.md`

---

## 9. Consideraciones Eticas (Entrega 4 - 22 abr)

El proyecto asume una postura etica practica: usar IA donde aporta valor, con
limites claros de privacidad, seguridad y trazabilidad. Se priorizo
procesamiento client-side para proteger documentos (Ley 1581/2012), controles
de seguridad base para reducir abuso (Ley 1273/2009) y mitigaciones explicitas
de sesgo en el catalogo y en las reglas regex.

Detalle completo en:

- `docs/entrega_4/riesgos_y_etica.md`

---

## 10. Producto Final (25 abr)

> Marcador de posicion. Se entregara el 25 de abril con: software funcional desplegable, documentacion tecnica y funcional completa, y presentacion de 10 minutos.

---

## Fuentes verificadas

1. [Ley 1918 de 2018 - Registro de inhabilitados](http://www.secretariasenado.gov.co/senado/basedoc/ley_1918_2018.html)
2. [Decreto 19 de 2012 - Anti-tramites](http://www.secretariasenado.gov.co/senado/basedoc/decreto_0019_2012.html)
3. Ley 1581 de 2012 - Habeas Data
4. Ley 1273 de 2009 - Delitos informaticos
5. [Policia Nacional - Antecedentes](https://antecedentes.policia.gov.co:7005/WebJudicial/)
6. [Procuraduria - Antecedentes disciplinarios](https://www.procuraduria.gov.co/portal/Consulta-de-Procesos.page)

## Anexos

- **Anexo A:** Prompt de reestructuracion (`.prompts/reestructuracion.md`).
- **Anexo B:** Prompt de Entrega 1 (`.prompts/entrega_1_new.md`).
- **Anexo C:** Prompt de Entrega 2 — arquitectura y diseno (`.prompts/entrega_2.md`).

### Correcciones y Revision

- **Anexo C.1:** Revision de completitud del README (`.prompts/correcciones/revision_completitud_v1.md`) — checklist de secciones vacias, cobertura de rubrica, coherencia cruzada, notas pendientes y formato.
- **Anexo C.2:** Revision contra rubrica (`.prompts/correcciones/revision_rubrica_v1.md`) — evaluacion criterio a criterio de Entregas 1 y 2 con estado CUBIERTO/PARCIAL/AUSENTE.
- **Anexo C.3:** Decision de no almacenar documentos del usuario (`.prompts/correcciones/decision_no_almacenar_docs.md`) — procesamiento client-side con pdf.js; sin S3 temporal; fundamento en Ley 1581/2012.

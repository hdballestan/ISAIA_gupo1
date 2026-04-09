# Prompt — Reestructuración del Proyecto de Curso

## Instrucción Principal
Eres un asistente de ingeniería de software. Necesito que analices mi
situación y **produzcas una propuesta formal de reestructuración del
proyecto** que incluya: nuevo alcance, actores, procesos, reglas de negocio,
restricciones regulatorias y decisiones técnicas. El resultado debe ser un
documento estructurado que yo pueda usar como base para reescribir la
Entrega 1 y construir la Entrega 2.

---

## Situación Actual

### Proyecto Original (ya entregado — Entrega 1, 28 de marzo de 2025)
- **Tema:** Sistema de Alerta Temprana de Deserción Universitaria
- **Equipo original:** 4 integrantes (William, Hever, Cristhian, Andrés)
- **Resultado:** Entregué la Entrega 1 solo. El único aporte del grupo fue
  votar el tema del proyecto. El docente calificó bien con esta observación:
  > "Actores: cumple, proceso no está incluido y no es claro cómo se va a
  > obtener la información del SIA o si se va a simular."

### Escisión Formal del Grupo
Solicité al docente escisión individual con este correo:

> "Solicito formalmente autorización para continuar el proyecto de forma
> individual. Creé el repositorio en GitHub, configuré GitHub Projects con
> tareas y establecí un canal de WhatsApp. La participación del grupo se
> limitó a votar por el tema. Al momento de la entrega, ningún integrante
> había contribuido. Realicé y entregué la Entrega 1 de forma individual.
>
> Me comprometo a:
> - Asumir el proyecto en su totalidad bajo mi responsabilidad.
> - Ajustar el tiempo de exposición a lo correspondiente a un estudiante
>   individual.
> - Redefinir el tema si así se requiere, dado que la selección del mismo
>   fue la única acción colectiva del grupo."

**Respuesta del docente:**
> "Lamento lo ocurrido, me hubiera gustado que todos trabajaran en grupo pero
> se acepta el compromiso."

---

## Tu Tarea — Análisis y Propuesta

### Paso 1: Evalúa mis dos propuestas originales

De `problem-ideation.md`, mis propuestas fueron:

**Propuesta A — Verificador de autenticidad de portales de pago:**
Herramienta para que ciudadanos verifiquen si un portal de pago de servicios
públicos es legítimo antes de ingresar datos sensibles.

**Propuesta B — Portal unificado de gestión de certificados:**
Plataforma de orientación donde el ciudadano describe su propósito (laboral,
educativo, contratación pública) y el sistema le indica qué certificados
necesita, en qué entidad se tramita cada uno, qué requisitos tiene, tiempos
estimados y observaciones relevantes (por ejemplo, si el portal requiere VPN,
si tiene validación anti-robot, si solo está disponible en horarios
específicos, etc.). El sistema NO descarga ni emite certificados — es un
dashboard de consolidación y orientación.

Evalúa cuál es más viable como proyecto individual, considerando:
- Complejidad comparable al proyecto original (6+ actores, reglas de negocio,
  marco regulatorio denso)
- Que no voy a entrenar modelos ML propios — compenso con DevOps real en AWS
- Que la fuente de datos debe ser clara (el feedback señaló la ambigüedad del
  SIA universitario)
- Que GenAI debe ser núcleo del sistema, no adorno

### Paso 2: Define el nuevo alcance con estas precisiones

**Qué hace el sistema:**
- Consolida en un solo lugar la información dispersa de múltiples entidades
  emisoras de certificados en Colombia (Policía Nacional, Procuraduría, ICBF,
  Fiscalía, Registraduría, etc.)
- Orienta al ciudadano: qué certificados necesita según su propósito, dónde
  tramitarlos, requisitos, tiempos estimados, observaciones prácticas
- Señala particularidades reales de cada trámite (ej: "requiere VPN
  institucional", "tiene captcha que bloquea automatización", "solo disponible
  entre 6am y 10pm")

**Qué NO hace el sistema:**
- NO descarga certificados
- NO scrappea portales gubernamentales
- NO emite ni reemplaza certificados oficiales
- NO interactúa directamente con los sistemas de las entidades emisoras
- El ciudadano siempre va por su cuenta al portal correspondiente

**Feature de extracción desde documentos:**
El ciudadano puede subir un archivo (PDF, TXT, MD) o una imagen (JPG, PNG),
o pegar texto directamente (ej: una oferta laboral, un requisito
institucional, una circular). La IA analiza el contenido, identifica qué
certificados le están pidiendo y los mapea contra el catálogo del sistema.
El resultado es una lista orientativa con: nombre del certificado, entidad
emisora, URL del portal oficial, requisitos y observaciones.

Ejemplo: el ciudadano pega una oferta laboral que dice "se requiere
certificado de antecedentes judiciales y verificación de inhabilidades para
trabajo con menores". El sistema responde:
1. Antecedentes judiciales → Policía Nacional → portal: policia.gov.co →
   requisito: cédula → observación: tiene captcha, se genera en línea
2. Registro de inhabilitados → ICBF (Ley 1918/2018) → portal: icbf.gov.co →
   requisito: número de documento → observación: requiere VPN en algunos
   casos

El ciudadano va al portal por su cuenta; el sistema solo consolida y orienta.

### Paso 3: Definir las reglas de control de abuso

Las solicitudes de adición de nuevos trámites al catálogo (cuando el
ciudadano no encuentra uno) deben estar protegidas:
- Rate limiting: 1 solicitud por IP cada 24 horas
- Campo honeypot anti-bot en el formulario
- Moderación manual por administrador antes de incorporar al catálogo

Evalúa la viabilidad de este esquema y señala limitaciones conocidas (IPs
compartidas por NAT, eludibilidad), pero recomienda la solución pragmática
para un MVP individual.

### Paso 4: Define las decisiones técnicas

| Decisión | Elección |
|----------|----------|
| IA para desarrollo y planeación | Claude Code (Anthropic) — asistente de código, análisis de requerimientos, prompt engineering |
| IA en el servicio en producción | OpenAI API (GPT-4o) — RAG sobre catálogo, extracción de documentos, procesamiento de imágenes (Vision) |
| Backend | AWS Lambda (Python) + API Gateway |
| Base de datos | DynamoDB |
| Frontend | React + TypeScript |
| Autenticación | Amazon Cognito |
| Hosting | S3 + CloudFront |
| IaC | AWS CDK (TypeScript) |
| CI/CD | GitHub Actions → AWS |

Justifica por qué se usan dos proveedores de IA distintos:
- **OpenAI en producción:** GPT-4o integra capacidades de visión (imágenes
  subidas) en la misma API, ideal para la feature de extracción desde
  documentos. Pay-per-use alineado con presupuesto individual.
- **Claude Code en desarrollo:** herramienta de desarrollo superior para
  análisis de código, prompt engineering, planeación y generación de
  artefactos del SDLC.
- Usar dos proveedores distintos demuestra conocimiento del ecosistema de
  GenAI y permite comparación crítica en la Entrega 4.

### Paso 5: Asegúrate de cubrir lo que le faltó a la Entrega 1

El feedback fue "proceso no está incluido". En tu propuesta define tres
procesos explícitos, cada uno con entrada, pasos, actores y salida:

**Proceso 1 — Consulta orientada por propósito:**
Entrada: ciudadano describe su situación. Pasos: clasificación del propósito
→ consulta al catálogo → generación de guía orientativa. Salida: lista de
certificados con entidad, portal, requisitos, tiempos, observaciones.

**Proceso 2 — Extracción desde documento:**
Entrada: ciudadano sube PDF/TXT/MD/imagen o pega texto. Pasos: IA analiza
el contenido → identifica certificados mencionados/implícitos → mapea
contra el catálogo. Salida: lista orientativa de certificados requeridos.

**Proceso 3 — Solicitud de adición de trámite:**
Entrada: ciudadano no encuentra un trámite, envía formulario. Pasos: rate
limit por IP → validación honeypot → ticket creado → admin revisa → aprueba
o rechaza → si aprobado, se incorpora al catálogo. Salida: nuevo registro
en el catálogo o rechazo con motivo.

---

## Formato de Salida Esperado

Devuelve un documento Markdown con:
1. **Justificación del cambio de tema** (2 párrafos máximo)
2. **Definición del nuevo problema** (contexto colombiano, qué hace y qué NO
   hace el sistema)
3. **Tabla de actores** con roles
4. **Procesos de negocio** (3 procesos, cada uno con flujo de pasos)
5. **Reglas de negocio** (6-8 reglas)
6. **Marco regulatorio** (tabla)
7. **Restricciones del problema**
8. **Decisiones técnicas** (tabla con justificación)
9. **Feature diferenciadora** (extracción desde documentos — qué hace, qué
   no hace, ejemplo concreto)
10. **Control de abuso** (rate limiting — viabilidad y limitaciones)

No inventes estadísticas. No agregues fuentes no verificadas. Si necesitas un
dato numérico que no está en este prompt, usa "[pendiente de verificación]".

# Prompt — Entrega 1: Portal Unificado de Gestión de Certificados

## Instrucción Principal
Eres un estudiante de ingeniería de software redactando la Entrega 1
refactorizada de un proyecto de curso. Este documento **es** el README.md
del repositorio — crece con cada entrega. Genera SOLO las secciones 1 y 2
con contenido. Las demás secciones van como marcadores de posición.
Añade el link del proyecto https://github.com/hdballestan/ISAIA_gupo1 al inicio. 

Lee `.prompts/reestructuracion.md` como contexto de las decisiones ya
tomadas. No repitas el análisis — ejecuta.

---

## PROYECTO

- **Nombre:** CertiDoc — Portal Unificado de Gestión de Certificados
  (Colombia)
- **Autor:** Hever Ballesta — hdnallestan@unal.edu.co (proyecto individual
  tras escisión formal del equipo)
- **Repositorio:** `ISAIA_gupo1` · Rama: `entrega_1`
- **Fecha de entrega original:** 28 de marzo de 2025
- **Refactorización:** 8 de abril de 2025

---

## ESTRUCTURA DEL README

1. Definición del Problema y Contexto de Negocio ← GENERA ESTO
2. Diferenciador Clave ← GENERA ESTO
3. Análisis de Requerimientos ← GENERA ESTO
4. Arquitectura y Diseño (Entrega 2 — 8 abr)
5. Construcción y Código (Entrega 3 — 15 abr)
6. Pruebas y Calidad (Entrega 3 — 15 abr)
7. Uso de IA Generativa (Entrega 4 — 22 abr)
8. Consideraciones Éticas (Entrega 4 — 22 abr)
9. Producto Final (25 abr)

---

## NOTAS OBLIGATORIAS AL INICIO DEL DOCUMENTO

1. **Nota de autoría individual:** Este proyecto es individual tras la
   escisión formal del equipo original, autorizada por el docente. El
   historial de commits es verificable.

2. **Nota de reestructuración:** El tema original (Sistema de Alerta
   Temprana de Deserción Universitaria) fue reemplazado. Motivos: (a) el
   feedback de la Entrega 1 señaló que el proceso no era claro y la fuente
   de datos era ambigua; (b) la escisión del equipo requería un proyecto
   viable para un solo desarrollador. El nuevo tema mantiene la misma
   complejidad de actores, regulación y procesos, y resuelve directamente
   los puntos del feedback: la fuente de datos es pública y los procesos
   están definidos explícitamente.

---

## SECCIÓN 1 — Definición del Problema y Contexto de Negocio

### El Problema
Obtener certificados en Colombia es fragmentado. Cada entidad emisora tiene
su propio portal, requisitos, horarios y particularidades técnicas:
- Antecedentes judiciales: Policía Nacional (policia.gov.co) — en línea,
  tiene captcha.
- Antecedentes disciplinarios: Procuraduría (procuraduria.gov.co) — portal
  propio.
- Registro de inhabilitados para trabajo con menores: ICBF (Ley 1918/2018)
  — algunos reportes requieren VPN institucional.
- Antecedentes penales: Fiscalía — otro canal, otro proceso.
- Certificados de Registraduría, Contraloría, etc.: cada uno con su propio
  flujo.

**Problema central:** no existe un lugar donde el ciudadano pueda saber qué
certificados necesita para un propósito específico (empleo, educación,
contratación pública), dónde ir a tramitar cada uno, qué requisitos pide
cada entidad ni qué particularidades tiene el trámite. La fragmentación
genera pérdida de tiempo, visitas innecesarias y errores por desconocimiento.
El Decreto 19/2012 (Anti-trámites) reconoció este problema a nivel normativo
pero la implementación sigue dispersa.

**Qué hace el sistema (alcance explícito):**
- Dashboard de orientación: consolida información de certificados dispersa
  en múltiples entidades.
- Indica qué certificados necesita el ciudadano según su propósito.
- Muestra: entidad emisora, URL del portal oficial, requisitos, tiempos
  estimados, observaciones prácticas (VPN, captcha, horarios).
- Permite subir un documento o pegar texto → la IA extrae qué certificados
  le están pidiendo y los mapea al catálogo.

**Qué NO hace el sistema:**
- NO descarga ni emite certificados.
- NO scrapea portales gubernamentales.
- NO interactúa con los sistemas de las entidades emisoras.
- El ciudadano siempre va al portal oficial por su cuenta.

### Tabla de Actores

| Actor | Rol |
|-------|-----|
| Ciudadano | Consulta orientación; sube documentos para extracción; marca estado personal de trámites; solicita nuevos trámites al catálogo |
| Empleador | Consulta qué certificados debe exigir para un cargo específico |
| Institución Educativa | Verifica obligaciones bajo Ley 1918/2018 para su personal |
| Policía Nacional | Entidad emisora referenciada: antecedentes judiciales |
| ICBF | Entidad emisora referenciada: registro de inhabilitados (Ley 1918/2018) |
| Fiscalía / Procuraduría | Entidades emisoras referenciadas: antecedentes penales y disciplinarios |
| Administrador del sistema | Gestiona el catálogo; modera solicitudes de nuevos trámites |

### Procesos de Negocio

**Proceso 1 — Consulta orientada por propósito**
| Paso | Acción | Actor |
|------|--------|-------|
| 1 | El ciudadano describe su situación en lenguaje natural (ej: "necesito los papeles para trabajar como docente en un colegio público") | Ciudadano |
| 2 | La IA clasifica el propósito (laboral-educativo-menores) y consulta el catálogo | Sistema (OpenAI) |
| 3 | El sistema devuelve la lista de certificados requeridos con: entidad, portal, requisitos, tiempo estimado, observaciones (VPN, captcha, horarios) | Sistema |
| 4 | El ciudadano revisa la guía y va al portal de cada entidad por su cuenta | Ciudadano |
| 5 | Opcionalmente, el ciudadano marca cada certificado como "en trámite" u "obtenido" en su tablero personal | Ciudadano |

**Proceso 2 — Extracción desde documento**
| Paso | Acción | Actor |
|------|--------|-------|
| 1 | El ciudadano sube un archivo (PDF, TXT, MD, imagen) o pega texto en el panel de carga | Ciudadano |
| 2 | La IA (OpenAI Vision para imágenes, GPT-4o para texto) analiza el contenido | Sistema (OpenAI) |
| 3 | El sistema identifica los certificados mencionados o implícitos en el documento | Sistema |
| 4 | Los certificados se mapean contra el catálogo y se devuelve la guía orientativa | Sistema |
| 5 | El ciudadano revisa y procede como en el Proceso 1 | Ciudadano |

**Proceso 3 — Solicitud de adición de trámite al catálogo**
| Paso | Acción | Actor |
|------|--------|-------|
| 1 | El ciudadano no encuentra un trámite; llena el formulario de solicitud | Ciudadano |
| 2 | Se valida rate limit (1/IP/24h) y honeypot anti-bot | Sistema |
| 3 | Se crea un ticket de solicitud con estado "pendiente" | Sistema |
| 4 | El administrador revisa la solicitud | Administrador |
| 5 | Si es válida, el admin crea el registro en el catálogo. Si no, rechaza con motivo | Administrador |

### Reglas de Negocio

| # | Regla |
|---|-------|
| 1 | El catálogo de certificados es la fuente de verdad central del sistema; toda orientación se genera exclusivamente desde él |
| 2 | Cada consulta en lenguaje natural se clasifica por propósito (laboral, educativo, contratación pública, personal) antes de filtrar el catálogo |
| 3 | Los certificados bajo Ley 1918/2018 son obligatorios y no omisibles para cualquier persona que trabaje con menores; el sistema los marca explícitamente |
| 4 | El sistema referencia los portales oficiales pero nunca descarga, emite ni reemplaza certificados; el ciudadano siempre va al portal por su cuenta |
| 5 | El Decreto 19/2012 prohíbe exigir documentos que el Estado ya posee; el sistema señala cuáles certificados pueden ser verificados directamente entre entidades |
| 6 | Datos del ciudadano bajo Ley 1581/2012: consentimiento explícito, minimización y finalidad definida |
| 7 | Las solicitudes de adición de trámites: máximo 1 por IP cada 24 horas, con moderación manual obligatoria antes de incorporar |
| 8 | Cada registro del catálogo debe incluir observaciones prácticas verificadas (VPN, captcha, horarios, restricciones de acceso) |

### Marco Regulatorio

| Regulación | Relevancia |
|------------|------------|
| Ley 1918/2018 | Registro de inhabilitados para trabajar con menores; define certificados obligatorios |
| Decreto 19/2012 | Anti-trámites: prohíbe exigir documentos que el Estado ya posee; evidencia normativa del problema de fragmentación |
| Ley 1581/2012 | Habeas Data: consentimiento, minimización, finalidad |
| Ley 1273/2009 | Delitos informáticos: base para requisitos de seguridad del portal |

### Restricciones del Problema
- **Fuente de datos:** catálogo construido manualmente desde información
  pública; no requiere APIs gubernamentales para el MVP.
- **Mantenimiento del catálogo:** los requisitos cambian por resoluciones
  periódicas — se necesita un proceso de actualización (Proceso 3 +
  administración directa).
- **Cobertura MVP:** certificados más comunes en contextos laborales y
  educativos; expansión progresiva.
- **Presupuesto:** proyecto individual, arquitectura serverless AWS para
  minimizar costos.
- **Particularidades técnicas:** algunos portales requieren VPN, tienen
  horarios restringidos o captchas agresivos — esta información es parte
  del valor del catálogo.

---

## SECCIÓN 2 — Diferenciador Clave

### Tabla comparativa: portales existentes vs. este proyecto

| Aspecto | Portales actuales (uno por entidad) | CertiDoc |
|---------|-------------------------------------|----------|
| Alcance | Un tipo de certificado por portal | Todos los certificados relevantes consolidados |
| Orientación | El ciudadano ya sabe qué necesita y dónde ir | El ciudadano describe su propósito; el sistema deduce qué necesita |
| Requisitos | Información estática, a veces desactualizada | Guía por certificado con requisitos, tiempos y observaciones prácticas verificadas |
| Extracción de documentos | Inexistente | Sube un documento o pega texto → la IA extrae los certificados que te piden |
| Seguimiento personal | Ninguno entre portales | Tablero donde el ciudadano marca el estado de cada trámite |
| Observaciones prácticas | No documentadas | VPN requerida, captchas, horarios, restricciones — información real que no está en ningún sitio |
| IA | Ninguna | Asistente conversacional (OpenAI GPT-4o) + extracción con Vision |
| Actualización | Independiente por entidad | Centralizada + solicitudes ciudadanas moderadas |

**Párrafo diferenciador:** Los portales actuales responden "¿cómo solicito
este certificado?" — asumen que el ciudadano ya sabe qué necesita y dónde
ir. Este sistema responde "¿qué certificados necesito para este propósito?"
y "este documento me pide unos papeles, ¿cuáles son y dónde los saco?".
Opera en una capa de orientación y consolidación que no existe públicamente
en Colombia.

### Resumen de la Solución (detalle en Entrega 2)
Listar los componentes sin detallar diseño:
- Catálogo de certificados: base de conocimiento estructurada en DynamoDB,
  construida desde fuentes públicas.
- Asistente conversacional: OpenAI GPT-4o con RAG sobre el catálogo.
- Extracción de documentos: OpenAI GPT-4o (texto) + Vision (imágenes).
- API REST: AWS Lambda (Python) + API Gateway.
- Frontend: React + TypeScript en S3 + CloudFront.
- Autenticación: Amazon Cognito.
- IaC: AWS CDK (TypeScript).
- CI/CD: GitHub Actions → AWS.
- IA en desarrollo: Claude Code (Anthropic) para planeación, código y prompts.

---

## SECCIÓN 3 — Análisis de Requerimientos

### 3.1 Requerimientos Funcionales
Genera tabla con columnas: ID | Requerimiento | Prioridad | Actor | Criterio
SMART. Mínimo 12 requerimientos cubriendo:

- RF-01: Carga y mantenimiento del catálogo (entidad, requisitos, canal,
  tiempo, observaciones prácticas, norma)
- RF-02: Consulta en lenguaje natural por propósito
- RF-03: Clasificación del propósito (laboral, educativo, contratación,
  personal)
- RF-04: Generación de lista orientativa de certificados con toda la
  metadata del catálogo
- RF-05: Subida de documentos (PDF, TXT, MD) para extracción
- RF-06: Subida de imágenes (JPG, PNG) para extracción con Vision
- RF-07: Pegado de texto libre para extracción
- RF-08: Tablero personal de estado por trámite (en trámite / obtenido /
  vencido)
- RF-09: Alertas de vencimiento de certificados
- RF-10: Formulario de solicitud de adición de nuevos trámites
- RF-11: Rate limiting: 1 solicitud de adición / IP / 24h
- RF-12: Panel de administración para CRUD del catálogo y gestión de tickets
- RF-13: RBAC con al menos tres roles: ciudadano, administrador, público
  (no autenticado)
- RF-14: Exportación de la guía personalizada en PDF

**IMPORTANTE:** Cada requerimiento debe incluir un criterio SMART
(Específico, Medible, Alcanzable, Relevante, con Tiempo). La rúbrica lo
exige explícitamente.

### 3.2 Requerimientos No Funcionales
Genera tabla con columnas: ID | Requerimiento | Categoría. Mínimo 10
cubriendo:

- Cumplimiento Ley 1581/2012 (legal)
- Disponibilidad ≥ 99.5% en horario hábil (disponibilidad)
- Tiempo de respuesta del asistente < 5s p95 (rendimiento)
- Tiempo de extracción de documentos < 10s p95 (rendimiento)
- Despliegue serverless reproducible con CDK (operación)
- Trazabilidad de cambios al catálogo (auditoría)
- OWASP Top 10 como línea base de seguridad (seguridad)
- Catálogo actualizable sin redeploy (mantenibilidad)
- Honeypot + rate limit en formularios públicos (seguridad)
- Documentos subidos eliminados después del procesamiento — no persistidos
  (privacidad)

### 3.3 Uso de IA Generativa en el Análisis
Documenta tres fases:
- **Fase 1 — Reestructuración:** Prompt `.prompts/reestructuracion.md` usado
  para que Claude analizara las propuestas y produjera la propuesta formal de
  cambio de tema. Resultado validado manualmente.
- **Fase 2 — Generación del documento:** Este prompt
  (`.prompts/entrega_1_new.md`) usado para generar el entregable. Estadísticas
  verificadas contra fuentes públicas.
- **Fase 3 — Revisión de calidad:** Prompts de verificación de rúbrica y
  coherencia (a documentar en anexos).

Incluye tabla de validación:
| Fase | Salida de la IA | Método de Validación | Estado |

### 3.4 Trazabilidad de Requerimientos
Tabla que conecta cada RF y RNF con: actor, regla de negocio, regulación o
restricción que lo origina. Misma estructura que la Entrega 1 original.

---

## FUENTES — Solo estas, verificadas

1. [Ley 1918 de 2018 — Registro de inhabilitados](http://www.secretariasenado.gov.co/senado/basedoc/ley_1918_2018.html)
2. [Decreto 19 de 2012 — Anti-trámites](http://www.secretariasenado.gov.co/senado/basedoc/decreto_0019_2012.html)
3. Ley 1581 de 2012 — Habeas Data (referencia por nombre)
4. Ley 1273 de 2009 — Delitos informáticos (referencia por nombre)
5. [Policía Nacional — Antecedentes](https://antecedentes.policia.gov.co:7005/WebJudicial/)
6. [Procuraduría — Antecedentes disciplinarios](https://www.procuraduria.gov.co/portal/Consulta-de-Procesos.page)

NO agregues fuentes. NO inventes estadísticas. Si falta un dato, usa
"[pendiente de verificación — fuente sugerida: X]".

---

## FORMATO

- Español, Markdown limpio para GitHub
- Tabla de Contenidos completa (9 secciones, contenido + marcadores)
- Notas de autoría y reestructuración visibles al inicio
- Tablas concisas, sin muros de texto
- Máximo 500 líneas de Markdown
- Criterios SMART explícitos en cada RF (la rúbrica lo exige)
- Anexos al final: Anexo A (prompt de reestructuración), Anexo B (este
  prompt), Anexo C (proceso de pensamiento), Anexo D (prompt de revisión)

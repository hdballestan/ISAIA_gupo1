# Libreto de sustentación — CertiDoc

**Duración:** 10 minutos de exposición + hasta 10 de preguntas
**Autor:** Hever Ballesta
**Fecha:** 25 de abril de 2026

> El libreto está cronometrado. Los marcadores `[m:ss]` son guía; ajustar en
> ensayo. Cada bloque cierra cubriendo un criterio concreto de la rúbrica
> final. Ensayar mínimo 3 veces completo con cronómetro.

---

## [0:00 — 0:45] Apertura y problema

> "Buenos días. Soy Hever Ballesta, estudiante de ISAIA. Voy a presentar
> **CertiDoc**, un portal unificado de gestión de certificados en Colombia."

- Obtener certificados en Colombia está fragmentado: Policía, Procuraduría,
  ICBF, Fiscalía, Registraduría — cada entidad con portal propio, requisitos
  heterogéneos, particularidades técnicas (VPN, captcha, horarios).
- No existe un punto único donde el ciudadano pueda saber **qué certificados
  necesita** para un propósito (empleo, contratación pública, trabajo con
  menores), dónde tramitarlos y qué obstáculos esperar.
- El Decreto 19/2012 reconoce la necesidad de simplificación, pero el flujo
  sigue distribuido por entidad.

**Frase de cierre:** "El problema no es tramitar; es **saber qué tramitar**."

---

## [0:45 — 1:30] Valor, actores y contexto regulatorio

- **Actores atendidos:** ciudadano, empleador, institución educativa,
  administrador del catálogo.
- **Regulación relevante:** Ley 1918/2018 (trabajo con menores), Decreto
  19/2012 (anti-trámites), Ley 1581/2012 (habeas data), Ley 1273/2009
  (delitos informáticos).
- **Propuesta de valor:**
  1. Catálogo unificado con observaciones prácticas verificadas.
  2. Extracción desde documento: el usuario sube un PDF, imagen o texto y el
     sistema **identifica qué certificados le están pidiendo**.
  3. Trazabilidad personal: checklist para llevar el avance de cada trámite.
  4. Revisión de amenazas bajo demanda sobre portales oficiales.

---

## [1:30 — 2:15] Alineación problema → requerimientos → arquitectura

- 14 requerimientos funcionales + 10 no funcionales, todos **SMART** y
  **trazados** en matriz del README §3.4.
- Cada RF apunta a un actor, proceso o regulación. Cada RNF cubre un atributo
  de calidad explícito (seguridad, rendimiento, privacidad).
- La arquitectura se deriva de 3 restricciones fuertes:
  1. **Presupuesto individual** → stack simple y serverless-friendly.
  2. **Ley 1581/2012** → documentos del usuario nunca salen del navegador.
  3. **Catálogo actualizable sin redeploy** → datos en BD, no en código.

**Frase:** "Nada en la arquitectura está porque sí. Cada pieza responde a un
requerimiento o una restricción explícita."

---

## [2:15 — 3:45] Arquitectura, decisiones y trade-offs

> Mostrar diagrama de contenedores del README §4.2.

- **Frontend:** React + Vite. Contiene **toda** la lógica pesada: extracción
  PDF con pdf.js, OCR con Tesseract.js, regex matching contra el catálogo.
- **Backend:** FastAPI delgado. Sirve catálogo, autenticación JWT, tickets
  con rate limit y panel admin. No procesa documentos.
- **Base de datos:** PostgreSQL. Migrable, SQL estándar, joins para admin.
- **Threat check:** integración VirusTotal bajo demanda por fila, no en carga.

**Tres decisiones con trade-off explícito:**

| Decisión | Alternativa descartada | Razón |
|---|---|---|
| Regex sobre catálogo | LLM (OpenAI RAG) | Costo cero, predecible, auditable, se actualiza sin re-entrenar |
| Tesseract.js en cliente | OpenAI Vision | Documentos nunca salen del dispositivo — cumplimiento Ley 1581 |
| PostgreSQL | DynamoDB/Serverless | Debug directo, SQL estándar, sin cold starts en entrega individual |

**Patrones aplicados:** separación cliente/servidor, capa de servicios en
frontend (`services/`), validación de entrada con Pydantic, error envelope
uniforme, rate-limit middleware, RBAC por rol.

---

## [3:45 — 6:45] Demo en vivo — 3 flujos de negocio

> Si internet falla, usar capturas en `docs/evidencia_final/`. Tener ventana
> lista con URL de EC2 y un PDF de prueba en escritorio.

### Flujo 1 — Consulta del catálogo [3:45 — 4:15]

- Abrir home.
- Mostrar tabla de certificados con estado de portal en vivo ("Portales
  consultados hoy a las HH:MM").
- Click en un certificado → abre portal oficial en nueva pestaña.

### Flujo 2 — Extracción desde documento [4:15 — 5:30]

- Arrastrar un PDF de requisitos laborales.
- Mostrar barra de progreso (OCR si aplica) — **"todo corriendo en el
  navegador"**.
- Resultado: tabla con certificados del catálogo resaltados como
  "Encontrado" y lista de certificados **mencionados pero no catalogados**.
- Enfatizar: "ningún archivo salió del navegador."

### Flujo 3 — Checklist y threat-check [5:30 — 6:45]

- Marcar 2-3 checkboxes → contador "3/12 completados" actualiza.
- Recargar → estado persiste (localStorage).
- Click "Revisar amenazas" en un certificado → consulta VirusTotal,
  resultado aparece inline.
- Abrir panel admin (ya logueado) → mostrar aprobación de ticket pendiente.

---

## [6:45 — 7:30] Atributos de calidad y buenas prácticas

- **Seguridad:** JWT con expiración de 60 min, bcrypt para hash de password,
  CORS restringido por env, honeypot + rate limit en formularios públicos,
  validación Pydantic en todas las entradas, RBAC por rol.
- **Mantenibilidad:** máximo 300 LOC por archivo y 20 por función,
  PEP 8 + ESLint, estilos centralizados en `styles.css`, un componente por
  archivo, servicios aislados de componentes.
- **Rendimiento:** health checks del cliente cada 10 min (no por request),
  matching regex en O(n·m) sobre catálogo acotado, OCR asíncrono con worker.
- **Reproducibilidad:** `uv.lock` + `package-lock.json`, `docker-compose`
  para dev, workflow de CI que corre en cada PR.

---

## [7:30 — 8:30] Uso de IA generativa

- **Herramientas:** Claude Code (Opus 4.7 / Haiku 4.5), gpt-5.3-codex para
  segundo par de ojos.
- **Workflow documentado en `.prompts/`:** cada entrega tiene un prompt vivo
  + carpeta de correcciones + discusiones de decisiones.
- **Roles donde la IA aportó valor medible:**
  1. Reestructuración del tema tras feedback del docente.
  2. Análisis y traducción de regulación colombiana a reglas de negocio.
  3. Redacción de documentación técnica consistente.
  4. Revisión cruzada contra la rúbrica antes de cada entrega.
- **Impacto:** aceleró redacción y revisión, permitió que un desarrollador
  individual mantuviera calidad equivalente a trabajo en equipo.
- **Criterio humano preservado:** toda salida de IA se contrastó con fuentes
  regulatorias, rúbrica y ejecución real del sistema antes de integrar.

> Detalle completo en `docs/entrega_4/informe_genai.md`.

---

## [8:30 — 9:00] Limitaciones, riesgos y mitigaciones

| Limitación / riesgo | Mitigación |
|---|---|
| Catálogo manual — puede quedar desactualizado | Formulario público moderado para que ciudadanos propongan nuevas entradas |
| Regex falla con redacciones atípicas | Feature 1 lista "mencionados no catalogados" para no perder información |
| OCR en cliente depende de calidad de imagen | Validación de tipos + mensajes claros de error |
| IA puede alucinar regulación | Toda cita regulatoria se verifica contra fuente oficial |
| Dependencia de VirusTotal | Fallback `unavailable` visible; no bloquea el flujo |
| Presupuesto individual en EC2 | Arquitectura simple y observabilidad mínima, con plan de migrar a managed si escala |

---

## [9:00 — 9:30] Pruebas y validación de requisitos

- **Pirámide aplicada:** unitarias (matcher backend y frontend), integración
  (auth, RBAC, rate limit, CRUD), smoke (render de componentes clave).
- **Evidencia versionada** en `docs/entrega_3/`: cobertura pytest + vitest,
  matriz RF ↔ test, registro de defectos.
- **CI en GitHub Actions:** flake8 + pytest + eslint + vitest en cada push y
  PR. Deploy separado por tag `v*` o ejecución manual.

---

## [9:30 — 10:00] Cierre

- CertiDoc convierte un proceso fragmentado en un punto único de orientación,
  respetando la privacidad del ciudadano por diseño.
- La arquitectura simple permitió entrega individual sin sacrificar calidad,
  seguridad ni trazabilidad.
- El uso responsable de IA generativa fue un multiplicador de productividad,
  no un reemplazo del criterio técnico.
- **Gracias. Quedo atento a preguntas.**

---

## Preguntas probables del jurado — respuestas preparadas

**P1. ¿Por qué no usaste LLM para identificar certificados?**
Regex sobre un catálogo finito es determinista, gratis, auditable y no tiene
riesgo de alucinación. El LLM aportaría flexibilidad marginal a un costo de
predictibilidad y presupuesto que no se justifica para este dominio cerrado.

**P2. ¿Cómo escalarías si el catálogo crece a miles de entradas?**
Migrar matching a índice invertido o trie; mover el catálogo a caché
CloudFront/Redis; mantener la BD como fuente de verdad. El frontend ya está
preparado para paginación.

**P3. ¿Qué pasa con documentos en otros idiomas?**
Tesseract.js soporta múltiples lenguajes bajo demanda. El catálogo y las
reglas están en español; una extensión multilingüe requeriría traducción del
catálogo o matching semántico, fuera del alcance del MVP.

**P4. ¿Cómo auditas el uso de IA en el proyecto?**
Todos los prompts quedan en `.prompts/` con fecha, propósito, resultado y
validación humana. `docs/entrega_4/evaluacion_critica.md` documenta los
fallos detectados y cómo se corrigieron.

**P5. ¿Por qué Railway/Vercel en docs y EC2 ahora?**
Railway/Vercel fue la vía más rápida para tener el pipeline CI/CD funcional.
EC2 es la migración final para tener control operativo completo, TLS propio
y control de logs — decisión tomada una vez estabilizada la aplicación.

**P6. ¿Qué harías diferente si empezaras de cero?**
Abrir con el stack simplificado desde E2 (FastAPI + PostgreSQL). La
arquitectura serverless de E2 fue sobre-ingeniería para un desarrollador
individual y generó deuda que hubo que refactorizar en E3.

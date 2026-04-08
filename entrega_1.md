# Entrega 1 — Sistema de Alerta Temprana de Deserción Universitaria
### Para Universidades Públicas Colombianas

**Autor:** Hever Ballesta — hdnallestan@unal.edu.co
**Repositorio:** `ISAIA_gupo1` · Rama: `entrega_1`
**Fecha de entrega:** 28 de marzo de 2025

---

> **⚠️ Nota de Entrega Individual**
>
> Este entregable fue elaborado exclusivamente por **Hever Ballesta**. El repositorio compartido en GitHub, el tablero de GitHub Projects y los canales de coordinación del equipo fueron configurados por este autor para facilitar la colaboración. A pesar de que estos recursos estaban disponibles para todos los integrantes, ningún otro miembro realizó aportes de investigación, redacción ni commits a este entregable. Toda la evidencia de contribución individual es verificable en el historial de commits de Git. Se enviará un correo formal al docente del curso solicitando el reconocimiento de autoría individual y, de ser pertinente, la escisión formal del equipo. Esta nota es informativa — la evidencia completa está disponible a solicitud.

---

## Tabla de Contenidos

1. [Definición del Problema y Contexto de Negocio](#1-definición-del-problema-y-contexto-de-negocio)
2. [Diferenciador Clave: Por Qué Esto No Es SPADIES](#2-diferenciador-clave-por-qué-esto-no-es-spadies)
3. [Análisis de Requerimientos](#3-análisis-de-requerimientos)
   - [3.1 Requerimientos Funcionales](#31-requerimientos-funcionales)
   - [3.2 Requerimientos No Funcionales](#32-requerimientos-no-funcionales)
   - [3.3 Uso de IA Generativa en el Análisis](#33-uso-de-ia-generativa-en-el-análisis)
   - [3.4 Trazabilidad de Requerimientos](#34-trazabilidad-de-requerimientos)
4. [Referencias](#referencias)
5. [Anexos](#anexos)
   - [Anexo A: Prompt de Generación del README](#anexo-a-prompt-de-generación-del-readme)
   - [Anexo B: Proceso de Pensamiento del Prompt](#anexo-b-proceso-de-pensamiento-del-prompt)
   - [Anexo C: Prompt de Pulimiento y Revisión de Calidad](#anexo-c-prompt-de-pulimiento-y-revisión-de-calidad)
   - [Anexo D: Prompt de Verificación Bibliográfica](#anexo-d-prompt-de-verificación-bibliográfica)

---

## 1. Definición del Problema y Contexto de Negocio

### El Problema

La deserción universitaria en Colombia es una crisis estructural. Aproximadamente **1 de cada 3 estudiantes nunca se gradúa**. Según [SPADIES (MEN, 2024)][1], la tasa de deserción anual llegó al **8,08% en 2022**, mientras que la deserción por cohorte se ubica en **23,15%** para universidades y **33,52%** para instituciones técnicas (2023) ([LEE Informe N°74, U. Javeriana, 2023][6]). La desigualdad regional es marcada: **La Guajira** registra tasas del **21,6%**, mientras **Cundinamarca** se sitúa en **4,2%** ([SPADIES][1]).

El problema central: **las universidades reaccionan después de que la deserción ya ocurrió**, en lugar de predecirla y prevenirla. La política de *Gratuidad* (Ley 2307/2023) amplió el acceso a la educación superior, pero sin herramientas de retención, **el financiamiento público se desperdicia** en estudiantes que abandonan sin concluir su carrera.

### Actores

| Actor | Rol |
|-------|-----|
| **Estudiantes** | Reciben alertas de riesgo; se conectan con los servicios de apoyo institucional |
| **Tutores Académicos** | Consultan dashboards de riesgo por estudiante; registran intervenciones |
| **Bienestar y Apoyo Financiero** | Asignan recursos limitados según el nivel de riesgo |
| **Registro Académico** | Provee datos de matrícula, calificaciones y asistencia |
| **Liderazgo Institucional** | Dashboards estratégicos con KPIs alineados con SPADIES |
| **MEN / SPADIES** | Regulador externo; define las métricas oficiales de deserción |

### Reglas de Negocio

| # | Regla |
|---|-------|
| 1 | **Definición de deserción:** no matrícula en ninguna IES durante 2+ periodos académicos consecutivos ([definición SPADIES][1]) |
| 2 | Los puntajes de riesgo se recalculan **al menos una vez por semestre**, idealmente a mitad de periodo |
| 3 | Los niveles de riesgo (**bajo / medio / alto / crítico**) activan intervenciones escalonadas |
| 4 | Cada puntaje de riesgo debe mostrar sus **principales factores contribuyentes** (explicabilidad) |
| 5 | **Minimización de datos** en cumplimiento de la Ley 1581/2012 (Habeas Data) |

### Restricciones Regulatorias

| Regulación | Relevancia |
|------------|------------|
| [Ley 30/1992][2] | Marco de educación superior; exige reportes de retención |
| Ley 1581/2012 | Protección de datos (Habeas Data); requiere consentimiento para el tratamiento de datos personales |
| Ley 2307/2023 | *Gratuidad* — financiación pública vinculada a KPIs de retención |

### Restricciones Específicas del Problema

- **Presupuesto:** Las universidades públicas operan con presupuestos ajustados — la solución debe ser liviana y compatible con la nube.
- **Variabilidad de calendarios:** Los calendarios académicos difieren entre instituciones (semestral vs. trimestral).
- **Calidad de datos:** Los registros históricos frecuentemente están incompletos o no digitalizados.
- **Estrategia de datos del MVP:** El MVP usará **datos sintéticos** generados a partir de las [distribuciones públicas de SPADIES][1] para entrenar y validar el modelo.

---

## 2. Diferenciador Clave: Por Qué Esto No Es SPADIES

### Comparación

| Aspecto | SPADIES | Este Proyecto |
|---------|---------|---------------|
| **Alcance** | Estadísticas nacionales agregadas | Por estudiante, por institución |
| **Temporalidad** | Retrospectivo (después de la deserción) | Predictivo (antes de la deserción) |
| **Granularidad** | Tasas a nivel de cohorte | Puntajes de riesgo individuales |
| **Accionabilidad** | Dashboard de medición | Flujos de intervención + alertas |
| **Integración** | Sin API institucional | Ingesta de datos del SIA universitario |
| **IA** | Ninguna | Modelo de clasificación ML + asistente de IA generativa |

SPADIES le dice al país **cuántos** estudiantes desertaron. Este sistema le dice a una universidad **cuáles** estudiantes están a punto de desertar y **qué** hacer al respecto. SPADIES es un instrumento de medición nacional — esencial para la política pública, pero no diseñado para la intervención. Este proyecto opera en una capa completamente diferente: **institucional, predictiva y accionable**. Como documenta [EconStor (2021)][5], SPADIES mejoró la visibilidad nacional sobre las tendencias de deserción, pero persiste una brecha a nivel institucional donde se toman las decisiones sobre estudiantes individuales.

### Resumen de la Solución

El sistema está compuesto por los siguientes componentes (detalles de arquitectura en la Entrega 2, 8 de abril):

- **Motor de Predicción ML** — Modelo de clasificación (XGBoost / Random Forest) entrenado sobre características tabulares: promedio académico, créditos completados, puntaje Saber 11, estado de apoyo financiero, estrato socioeconómico e historial de ausencia intersemestral.
- **Datos Sintéticos de Entrenamiento** — Generados a partir de las distribuciones públicas de SPADIES para inicializar el modelo antes de contar con datos institucionales reales.
- **Dashboard para Tutores** — Interfaz basada en roles con explicabilidad por estudiante (principales factores de riesgo).
- **Sistema de Alertas y Notificaciones** — Alertas automáticas activadas por umbrales de nivel de riesgo.
- **Componente de IA Generativa** — Claude integrado como asistente de IA: los tutores pueden consultarlo sobre perfiles de riesgo estudiantil y recibir sugerencias de intervención.
- **Pipeline CI/CD** — Despliegue continuo para entregas iterativas.
- **Reportes Compatibles con SPADIES** — Salida alineada con los requisitos de reporte del MEN.

---

## 3. Análisis de Requerimientos

### 3.1 Requerimientos Funcionales

| ID | Requerimiento | Prioridad | Actor |
|----|---------------|-----------|-------|
| RF-01 | El sistema debe ingestar datos del SIA universitario: registros de matrícula, calificaciones académicas, asistencia, puntaje Saber 11, estrato socioeconómico y estado de apoyo financiero | Indispensable | Registro Académico |
| RF-02 | El sistema debe calcular un puntaje de riesgo de deserción para cada estudiante activo al menos una vez por semestre académico | Indispensable | Todos |
| RF-03 | El sistema debe clasificar a cada estudiante en uno de cuatro niveles de riesgo: bajo, medio, alto o crítico | Indispensable | Tutores, Bienestar |
| RF-04 | Cada puntaje de riesgo debe mostrar sus principales factores contribuyentes (explicabilidad del modelo mediante SHAP o equivalente) | Indispensable | Tutores |
| RF-05 | El sistema debe generar alertas y notificaciones automáticas cuando un estudiante alcance nivel de riesgo alto o crítico | Indispensable | Estudiantes, Tutores |
| RF-06 | Los tutores académicos deben acceder a un dashboard por estudiante que muestre el puntaje actual, la tendencia histórica y los factores de riesgo | Indispensable | Tutores |
| RF-07 | Los tutores académicos deben poder registrar intervenciones (tipo, fecha, resultado) vinculadas al perfil de un estudiante | Indispensable | Tutores |
| RF-08 | El asistente de IA generativa debe responder consultas en lenguaje natural sobre el perfil de riesgo de un estudiante y sugerir estrategias de intervención | Indispensable | Tutores |
| RF-09 | Las áreas de Bienestar y Apoyo Financiero deben poder filtrar el listado de estudiantes por nivel de riesgo para priorizar la asignación de recursos | Deseable | Bienestar |
| RF-10 | El liderazgo institucional debe acceder a dashboards agregados con KPIs de deserción alineados con SPADIES | Deseable | Liderazgo |
| RF-11 | El sistema debe generar reportes de deserción compatibles con SPADIES exportables en CSV/PDF | Deseable | Liderazgo, MEN |
| RF-12 | El sistema debe implementar control de acceso basado en roles (RBAC) con al menos cinco roles: estudiante, tutor, bienestar, registro académico y liderazgo | Indispensable | Todos |

### 3.2 Requerimientos No Funcionales

| ID | Requerimiento | Categoría |
|----|---------------|-----------|
| RNF-01 | Todo tratamiento de datos personales debe cumplir la Ley 1581/2012: consentimiento explícito, minimización de datos y limitación de finalidad | Legal / Cumplimiento |
| RNF-02 | Las explicaciones del puntaje de riesgo (principales factores contribuyentes) deben ser visibles junto a cada resultado | Transparencia |
| RNF-03 | La plataforma debe poder desplegarse en una VM de nube de gama media (≤ 4 vCPU, ≤ 8 GB RAM) para ajustarse a los presupuestos de universidades públicas | Costo / Rendimiento |
| RNF-04 | La configuración del periodo académico debe soportar calendarios semestrales (2/año) y trimestrales (3/año) | Flexibilidad |
| RNF-05 | El tiempo de respuesta de las consultas al dashboard debe ser inferior a 3 segundos en el percentil 95 bajo carga operativa normal | Rendimiento |
| RNF-06 | El clasificador ML debe alcanzar una precisión ≥ 0,80 en las clases de riesgo alto + crítico (minimizar falsos positivos) | Calidad del Modelo |
| RNF-07 | El clasificador ML debe alcanzar una exhaustividad ≥ 0,75 en las clases de riesgo alto + crítico (minimizar estudiantes en riesgo no detectados) | Calidad del Modelo |
| RNF-08 | Los datos sintéticos de entrenamiento deben generarse a partir de las distribuciones públicas de SPADIES y ser revisados por un experto de dominio antes de su uso | Calidad de Datos |
| RNF-09 | Todos los registros de intervención deben conservarse durante un mínimo de 5 años académicos | Cumplimiento |
| RNF-10 | La disponibilidad del sistema debe ser ≥ 99,5% durante los periodos académicos activos (semanas de matrícula, parciales y finales) | Disponibilidad |

### 3.3 Uso de IA Generativa en el Análisis

Se utilizó IA Generativa (Claude Sonnet) en tres fases para apoyar este análisis. Todos los resultados fueron validados manualmente antes de su inclusión.

#### Fase 1 — Ideación del Problema

Cada integrante del equipo propuso de forma independiente entre 2 y 3 problemas candidatos usando un documento compartido de lluvia de ideas asíncrona (`problem-ideation.md`). La estructura implícita del prompt fue: *problema colombiano real, sin solución pública equivalente, actores y reglas de negocio claros, viable antes del 25 de abril*. Se seleccionó el **Sistema de Alerta Temprana de Deserción Universitaria** porque combina de forma única una brecha de política medible (SPADIES cubre el reporte nacional, no la intervención institucional), un marco regulatorio claro y un alcance de solución ML viable dentro del proyecto.

> **Rol de la IA:** Claude apoyó a los integrantes en la estructuración de las propuestas de problema y en la identificación del contexto regulatorio de cada candidato.

#### Fase 2 — Generación del Documento Estructurado

Se diseñó un prompt estructurado detallado (ver **Anexo A**) para generar el `README.md` inicial. El prompt incorpora estadísticas exactas y fuentes preaprobadas para evitar alucinaciones, y usa restricciones negativas explícitas para prevenir la desviación del alcance.

> **Rol de la IA:** Claude generó la estructura y la narrativa iniciales del documento. Todas las estadísticas citadas fueron contrastadas con las URLs de sus fuentes antes de ser incluidas.

#### Fase 3 — Revisión y Refinamiento

Tras la generación inicial se aplicaron dos prompts de verificación estructurada (ver **Anexos C y D**): uno para verificar la coherencia interna y el cumplimiento de la rúbrica, y otro para verificar la exactitud bibliográfica. Este proceso replica un ciclo de revisión por pares delegado al modelo.

> **Rol de la IA:** Actuó como revisor estructurado. Todos los problemas señalados fueron resueltos manualmente.

**Registro de validación:**

| Fase | Salida de la IA | Método de Validación | Estado |
|------|-----------------|----------------------|--------|
| Definición del problema | Narrativa de definición | Comparación manual con estadísticas del portal SPADIES | Validado |
| Tabla de actores | 6 actores con roles | Contraste con documentación del MEN | Validado |
| Reglas de negocio | 5 reglas | Revisión contra el documento de definición de SPADIES | Validado |
| Estadísticas | 5 afirmaciones numéricas | Trazadas hasta los documentos fuente citados | Validado |
| Requerimientos | RF-01 a RF-12, RNF-01 a RNF-10 | Revisados para completitud frente al alcance de la solución | Validado |

### 3.4 Trazabilidad de Requerimientos

| ID Req. | Trazado a | Tipo |
|---------|-----------|------|
| RF-01 | Registro Académico (Actor); RNF-08 (restricción de calidad de datos) | Actor / RNF |
| RF-02 | Regla de Negocio 2 (recálculo ≥ 1 vez/semestre) | Regla de Negocio |
| RF-03 | Regla de Negocio 3 (4 niveles de riesgo activan intervenciones) | Regla de Negocio |
| RF-04 | Regla de Negocio 4 (explicabilidad); RNF-02 | Regla de Negocio / RNF |
| RF-05 | Regla de Negocio 3 (intervenciones escalonadas); Estudiantes, Tutores (Actores) | Regla de Negocio / Actor |
| RF-06 | Tutores Académicos (Actor) | Actor |
| RF-07 | Tutores Académicos (Actor); RNF-09 (retención de registros) | Actor / RNF |
| RF-08 | Componente GenAI (alcance de la solución); Tutores Académicos (Actor) | Solución / Actor |
| RF-09 | Bienestar y Apoyo Financiero (Actor) | Actor |
| RF-10 | Liderazgo Institucional (Actor); MEN/SPADIES (Actor) | Actor |
| RF-11 | MEN/SPADIES (Actor); Ley 2307/2023 (requisito de reporte de KPIs) | Actor / Regulación |
| RF-12 | Ley 1581/2012 (RBAC implementa minimización de datos); RNF-01 | Regulación / RNF |
| RNF-01 | Ley 1581/2012 (Habeas Data) | Regulación |
| RNF-02 | Regla de Negocio 4 (requisito de explicabilidad) | Regla de Negocio |
| RNF-03 | Restricción del problema (presupuestos ajustados en universidades públicas) | Restricción |
| RNF-04 | Restricción del problema (variabilidad de calendarios entre instituciones) | Restricción |
| RNF-06, RNF-07 | Regla de Negocio 3 (los niveles de riesgo deben ser fiables para activar intervenciones) | Regla de Negocio |
| RNF-08 | Restricción del problema (datos históricos incompletos → estrategia de datos sintéticos) | Restricción |
| RNF-10 | Restricción del problema (periodos académicos críticos requieren alta disponibilidad) | Restricción |

---

## Referencias

1. [SPADIES — Estadísticas de Deserción (MEN, 2024)](https://www.mineducacion.gov.co/sistemasinfo/spadies/secciones/Estadisticas-de-desercion/)
2. [Ley 30/1992 — Educación Superior](http://www.secretariasenado.gov.co/senado/basedoc/ley_0030_1992.html)
3. Ley 1581/2012 — Habeas Data
4. Ley 2307/2023 — Gratuidad en Educación Superior
5. [Cómo SPADIES mejoró los resultados en Colombia (EconStor, 2021)](https://www.econstor.eu/handle/10419/233065)
6. [LEE Informe N°74 — Deserción en Educación Superior (U. Javeriana, 2023, PDF)](https://www.javeriana.edu.co/recursosdb/5581483/8102914/INFORME-74-DESERCIO%CC%81N-EDU-SUPERIOR2023.pdf)

[1]: https://www.mineducacion.gov.co/sistemasinfo/spadies/secciones/Estadisticas-de-desercion/
[2]: http://www.secretariasenado.gov.co/senado/basedoc/ley_0030_1992.html
[5]: https://www.econstor.eu/handle/10419/233065
[6]: https://www.javeriana.edu.co/recursosdb/5581483/8102914/INFORME-74-DESERCIO%CC%81N-EDU-SUPERIOR2023.pdf

---

## Anexos

---

### Anexo A: Prompt de Generación del README

El siguiente prompt fue utilizado para generar el `README.md` inicial. Está almacenado en `.prompts/entrega_1.md` en el repositorio.

````
Eres un estudiante de ingeniería de software redactando el README.md inicial
para un proyecto de curso universitario. Este README refleja la estructura del
documento final del proyecto y crecerá con cada entrega. Escribe SOLO el
contenido de la Entrega 1. Sé conciso — esto es un proyecto de curso, no una
tesis.

## PROYECTO

- **Nombre:** (pendiente de aprobación) — Sistema de Alerta Temprana de
  Deserción Universitaria para universidades públicas colombianas
- **Equipo:** William, Hever, Cristhian, Andrés
- **Documento de trabajo:**
  https://docs.google.com/document/d/1EhfuCNT7FTHISwdVtMusnq5gW1kcwQ8M6SCS3SApwjY/edit?tab=t.0

## ESTRUCTURA DEL README

El README debe seguir esta estructura que refleja el ciclo de vida completo
del proyecto. Por ahora, solo las secciones 1 y 2 tienen contenido. El resto
se lista como marcadores de posición con "Se entregará en la Entrega N":

1. Definición del Problema y Contexto de Negocio ← ESCRIBE ESTO AHORA
2. Diferenciador Clave: Por Qué Esto No Es SPADIES ← ESCRIBE ESTO AHORA
3. Arquitectura y Diseño (Entrega 2 — Abr 8)
4. Construcción y Código (Entrega 3 — Abr 15)
5. Pruebas y Calidad (Entrega 3 — Abr 15)
6. Uso de IA Generativa (Entrega 4 — Abr 22)
7. Consideraciones Éticas (Entrega 4 — Abr 22)
8. Producto Final (Abr 25)

## QUÉ ESCRIBIR — Alcance de la Entrega 1

[Estadísticas exactas, tabla de actores, reglas de negocio, restricciones
regulatorias, diferenciador SPADIES — ver archivo completo en el repositorio]

## FUENTES — Solo estas 6, todas verificadas y de acceso abierto

[Lista de 6 fuentes con URLs verificadas]

NO agregues otras fuentes. NO inventes estadísticas.

## FORMATO

- Inglés, Markdown limpio para GitHub
- Mantener todo el documento por debajo de 400 líneas de markdown
````

> El archivo completo del prompt se encuentra en `.prompts/entrega_1.md`.

**Decisiones clave de diseño del prompt:**

| Decisión | Técnica | Justificación |
|----------|---------|---------------|
| Asignación de rol ("estudiante de ingeniería de software") | Prompting de persona / rol | Ancla la salida en el registro y alcance apropiados para un proyecto de curso |
| Estadísticas exactas embebidas en el prompt | Inyección de datos | Evita que el modelo alucine cifras de educación nacional no verificadas |
| Lista de fuentes preaprobadas con URLs | Anclaje de fuentes | Impide citas fabricadas — falla crítica en documentos académicos |
| Restricciones negativas explícitas ("NO inventes estadísticas") | Guardarraíles | Reduce la deriva del modelo hacia datos inventados o plausibles pero no verificados |
| Descomposición sección por sección | Descomposición estructurada | Reproduce el razonamiento en cadena; garantiza que todas las secciones de la rúbrica sean abordadas |
| Especificación de formato (tablas, límite de 400 líneas) | Formato de salida | Produce una salida legible por máquina, compatible con GitHub, inmediatamente utilizable |

---

### Anexo B: Proceso de Pensamiento del Prompt

Los prompts de este entregable siguieron un patrón de **salida estructurada anclada**. El desafío central al usar IA Generativa en un entregable académico es prevenir la **alucinación de estadísticas y citas** — una falla crítica para un documento que cita datos nacionales de educación colombiana.

**Principios de diseño aplicados:**

**1. Inyectar estadísticas; no generarlas.**
Todas las cifras (8,08% de deserción anual, 23,15% por cohorte, desgloses regionales) se obtuvieron de SPADIES y del informe de la Javeriana *antes* de escribir el prompt y se embebieron directamente. Se instruyó al modelo para no producir números que no estuvieran en el prompt.

**2. Preaprobación de la bibliografía.**
Las seis fuentes verificadas se listaron en el prompt con sus URLs exactas. La instrucción explícita "NO agregues otras fuentes" impide que el modelo complemente con referencias plausibles pero no verificadas.

**3. Encuadre por persona.**
Presentar al modelo como "un estudiante de ingeniería de software escribiendo un README de curso" acota la verbosidad, define la audiencia esperada (docente + compañeros) y evita la sobre-formalización inconsistente con un documento de entrega por fases.

**4. Descomposición en secciones como cadena de pensamiento.**
Dividir el prompt en subsecciones exactas (narrativa del problema → tabla de actores → reglas de negocio → restricciones → diferenciador → resumen de solución) obliga al modelo a razonar cada componente en secuencia, donde cada sección informa a la siguiente.

**5. Restricciones de formato explícitas.**
Especificar un máximo de 400 líneas, la estructura de tablas requerida y el texto de marcador de posición para secciones futuras garantiza que la salida se adapte al modelo de entrega incremental del proyecto.

**6. Ciclo de validación de la salida.**
Tras la generación, cada estadística fue rastreada hasta su fuente citada antes de ser aceptada. La tabla comparativa SPADIES vs. Este Proyecto fue revisada para asegurar que ninguna afirmación tergiversara las capacidades de SPADIES.

**Registro de iteraciones:**

| Iteración | Cambio Realizado | Motivo |
|-----------|------------------|--------|
| v1 | Prompt inicial con rol + contexto del proyecto | Establecer línea base |
| v2 | Adición de estadísticas exactas y fuentes preaprobadas | La salida generaba cifras plausibles pero no verificadas |
| v3 | Adición de restricciones negativas explícitas | La salida añadía fuentes adicionales y comparaciones especulativas |
| v4 | Adición de especificación de formato (tablas, límite de líneas) | La salida era verbosa y no estructurada |

---

### Anexo C: Prompt de Pulimiento y Revisión de Calidad

Aplicado tras la generación del documento para verificar la coherencia interna y el cumplimiento de la rúbrica.

```
Revisa el siguiente entregable universitario y devuelve una lista estructurada
de problemas con el formato: Sección | Problema | Corrección Sugerida

Verifica:

1. COBERTURA DE LA RÚBRICA — ¿cada sección satisface estos criterios?
   - Alcance del problema claramente delimitado
   - Definición del problema y relevancia en el contexto colombiano
   - Actores, procesos y reglas de negocio identificados
   - Justificación de que no existe una solución pública equivalente
   - Restricciones específicas del problema definidas
   - Requerimientos funcionales y no funcionales claramente definidos
   - Uso de IA Generativa documentado y validado
   - Trazabilidad de requerimientos presente

2. AFIRMACIONES SIN RESPALDO — cualquier afirmación que no esté respaldada
   por una fuente citada.

3. VERBOSIDAD — tablas con relleno innecesario, párrafos de más de 3
   oraciones que no añaden información.

4. CONSISTENCIA INTERNA — ¿los actores, reglas de negocio y requerimientos
   hacen referencia al mismo alcance del sistema? ¿Hay contradicciones?

5. ARGUMENTO DIFERENCIADOR — ¿es sólida la justificación de que no existe
   un equivalente público? ¿La comparación con SPADIES cubre todas las
   posibles objeciones?

[CONTENIDO DEL DOCUMENTO AQUÍ]
```

---

### Anexo D: Prompt de Verificación Bibliográfica

Aplicado para verificar todas las referencias citadas antes de finalizar el documento.

```
Para cada referencia listada a continuación, verifica:

1. ¿Este documento / ley / publicación existe realmente?
2. ¿La estadística específica citada aparece en esta fuente?
3. ¿El año y el autor son correctos?
4. ¿Existe una fuente más reciente o más autorizada disponible?
5. ¿La URL sigue siendo accesible y apunta al recurso correcto?

Referencias a verificar:

1. SPADIES — Estadísticas de Deserción (MEN, 2024)
   URL: https://www.mineducacion.gov.co/sistemasinfo/spadies/secciones/Estadisticas-de-desercion/
   Afirmaciones: Tasa de deserción anual 8,08% (2022); La Guajira 21,6% vs Cundinamarca 4,2%

2. Ley 30/1992 — Ley de Educación Superior
   URL: http://www.secretariasenado.gov.co/senado/basedoc/ley_0030_1992.html
   Afirmación: Exige reportes de retención a las IES

3. Ley 1581/2012 — Habeas Data (citada por nombre, sin URL)
   Afirmación: Requiere consentimiento explícito y minimización de datos para el tratamiento de datos personales

4. Ley 2307/2023 — Gratuidad en Educación Superior (citada por nombre, sin URL)
   Afirmación: Vincula la financiación de universidades públicas a KPIs de retención

5. EconStor (2021) — Cómo SPADIES mejoró los resultados en Colombia
   URL: https://www.econstor.eu/handle/10419/233065
   Afirmación: SPADIES mejoró la visibilidad nacional pero persiste una brecha a nivel institucional

6. LEE Informe N°74 — Deserción en Educación Superior (U. Javeriana, 2023)
   URL: https://www.javeriana.edu.co/recursosdb/5581483/8102914/INFORME-74-DESERCIO%CC%81N-EDU-SUPERIOR2023.pdf
   Afirmaciones: Deserción por cohorte 23,15% universitaria, 33,52% técnica (2023)

Para cada una: confirma existencia, verifica la afirmación específica, señala
URLs rotas, sugiere una fuente mejor si existe.
```

---

*Entrega 1 — 28 de marzo de 2025 | Entrega individual de Hever Ballesta*

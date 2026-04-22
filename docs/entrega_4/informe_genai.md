# Informe de uso de IA generativa — Entrega 4

## 1) Enfoque general

La IA se uso como acelerador de trabajo (no como reemplazo del criterio
tecnico). En cada fase hubo una regla estable: sugerencia de IA + verificacion
manual + checklist de aceptacion antes de integrar cambios.

Este enfoque sigue la vision del proyecto: la IA es una herramienta muy
potente cuando se usa con control, conocimiento del tema y pasos de validacion
explita por tarea.

## 2) Herramientas y fases

| Herramienta | Fases principales | Uso concreto |
|---|---|---|
| Claude Code (Opus) | Analisis y decisiones de alto nivel | Reestructuracion del proyecto, definicion de arquitectura, revision de rubrica |
| Claude Code (Haiku) | Ejecucion operativa | Scaffolding, refactors puntuales, tareas repetitivas de codigo y docs |
| gpt-5.3-codex | Contraste critico y segunda opinion | Revisions de plan, validacion de consistencia, implementaciones puntuales en Entrega 3 y 4 |

## 3) Estrategias de prompt engineering aplicadas

Se aplicaron cinco estrategias de manera recurrente.

1. Role prompting (asistente como ingeniero de software con alcance explicito).
2. Estructura por secciones (formato de salida definido antes de ejecutar).
3. Delimitadores claros (alcance, fuera de alcance, criterios de aceptacion).
4. Few-shot ligero (plantillas de tablas para trazabilidad y defectos).
5. Razonamiento asistido con contraste de modelos (una respuesta no se integra
   sin revision humana y sin cruzar con codigo y rubrica).

## 4) Workflow de trabajo con prompts

El flujo usado en el proyecto fue el siguiente:

- Se crea un prompt por entrega o por correccion en `.prompts/`.
- Se ejecuta el prompt con un modelo segun la complejidad.
- Se valida contra (rubrica, README, estado real del codigo, reglas del
  proyecto).
- Si hay desalineacion, se abre archivo de correccion/discusion y se itera.
- Solo despues de pasar checklist manual se integra el resultado.

Checklist manual usado en practicas (resumen):

- coherencia con alcance de la tarea
- compatibilidad con stack real (FastAPI, PostgreSQL, React)
- cumplimiento legal y de privacidad (Ley 1581/2012)
- evidencia trazable en archivos y commits

## 5) Comparacion de modelos (Opus vs Haiku)

Opus se uso cuando se necesitaba analisis largo y decisiones con trade-offs
(por ejemplo, cambios de arquitectura y evaluacion contra rubrica).

Haiku se uso cuando la tarea ya estaba bien delimitada y el objetivo era
velocidad de ejecucion (crear estructura, ajustar archivos, pulir componentes).

gpt-5.3-codex se uso como segundo par de ojos para reducir sesgo de una sola
herramienta y para revisar inconsistencias entre plan y ejecucion.

## 6) Impacto en productividad (estimaciones)

Todas las cifras se reportan como estimacion basada en bitacora de tareas y
tiempos observados durante Entregas 1 a 4.

| Indicador | Estimacion |
|---|---|
| Horas ahorradas en redaccion y estructura documental | 20 a 28 horas |
| Horas ahorradas en refactor de README y consistencia cruzada | 8 a 12 horas |
| Errores detectados por revision asistida de IA | 6 casos relevantes |
| Retrabajos evitados por revisar dependencias y alcance antes de codificar | 4 a 6 iteraciones |

Los beneficios mas visibles fueron rapidez para documentar, deteccion temprana
de incoherencias y mejor cobertura de rubrica. El costo principal fue tener
que filtrar respuestas incompletas o fuera del contexto real del repositorio.

## 7) Cierre

El uso de IA en CertiDoc fue productivo porque se manejo con control humano,
checklists por tarea y contraste con evidencia tecnica. La IA ayudo a avanzar
mas rapido, pero las decisiones finales siempre dependieron de conocimiento del
dominio y validacion manual.

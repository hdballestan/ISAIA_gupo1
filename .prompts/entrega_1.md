Eres un estudiante de ingeniería de software redactando el README.md inicial
para un proyecto de curso universitario. Este README refleja la estructura del
documento final del proyecto y crecerá con cada entrega. Escribe SOLO el
contenido de la Entrega 1. Sé conciso — esto es un proyecto de curso, no una
tesis.

## PROYECTO

- **Nombre:** (pendiente de aprobación) — Sistema de Alerta Temprana de
  Deserción Universitaria para universidades públicas colombianas
- **Equipo:** William, Hever, Cristhian, Andrés
- **Documento de trabajo (las entregas están aquí):**
  https://docs.google.com/document/d/1EhfuCNT7FTHISwdVtMusnq5gW1kcwQ8M6SCS3SApwjY/edit?tab=t.0

## ESTRUCTURA DEL README

El README debe seguir esta estructura que refleja el ciclo de vida completo
del proyecto. Por ahora, solo las secciones 1 y 2 tienen contenido. El resto
se lista como marcadores de posición con "Se entregará en la Entrega N" para
que el lector vea la hoja de ruta completa:

1. Definición del Problema y Contexto de Negocio ← ESCRIBE ESTO AHORA
2. Diferenciador Clave: Por Qué Esto No Es SPADIES ← ESCRIBE ESTO AHORA
3. Arquitectura y Diseño (Entrega 2 — Abr 8)
4. Construcción y Código (Entrega 3 — Abr 15)
5. Pruebas y Calidad (Entrega 3 — Abr 15)
6. Uso de IA Generativa (Entrega 4 — Abr 22)
7. Consideraciones Éticas (Entrega 4 — Abr 22)
8. Producto Final (Abr 25)

## QUÉ ESCRIBIR — Alcance de la Entrega 1

### Sección 1: Definición del Problema y Contexto de Negocio

Cubre estos puntos de forma concisa:

**Problema y relevancia en Colombia:**
- ~1 de cada 3 estudiantes nunca se gradúa. Deserción anual universitaria:
  8.08% (2022). Deserción por cohorte: 23.15% universitaria, 33.52%
  técnica (2023). Brechas regionales: La Guajira 21.6% vs Cundinamarca 4.2%.
- Las universidades reaccionan DESPUÉS de la deserción en lugar de predecirla.
- La política de Gratuidad (Ley 2307/2023) amplía el acceso pero sin
  herramientas de retención, el dinero público se desperdicia.

**Tabla de actores** (breve):
- Estudiantes: reciben alertas de riesgo, se conectan con apoyo
- Tutores Académicos: ven dashboards de riesgo por estudiante, registran intervenciones
- Bienestar y Apoyo Financiero: asignan recursos limitados según nivel de riesgo
- Registro Académico: provee datos de matrícula, calificaciones, asistencia
- Liderazgo Institucional: dashboards estratégicos, KPIs alineados con SPADIES
- MEN / SPADIES: regulador externo, define las definiciones de deserción

**Reglas de negocio** (máximo 5):
- Deserción = no matrícula en ninguna IES por 2+ periodos consecutivos (definición SPADIES)
- Puntajes de riesgo recalculados al menos una vez por semestre, idealmente a mitad de periodo
- Niveles de riesgo (bajo/medio/alto/crítico) activan intervenciones escalonadas
- Cada puntaje de riesgo debe mostrar los principales factores contribuyentes (explicabilidad)
- Minimización de datos según Ley 1581/2012

**Tabla de restricciones regulatorias** (solo estas):
| Ley 30/1992 | Marco de educación superior, requiere reportes de retención |
| Ley 1581/2012 | Protección de datos, requiere consentimiento |
| Ley 2307/2023 | Gratuidad — financiación vinculada a KPIs de retención |

**Restricciones específicas del problema:**
- Las universidades públicas tienen presupuestos ajustados → cloud-friendly, ligero
- Los calendarios académicos varían (semestral vs trimestral)
- Los registros históricos frecuentemente están incompletos o no digitalizados
- El MVP usa datos sintéticos generados a partir de distribuciones públicas de SPADIES

### Sección 2: Diferenciador Clave — Por Qué Esto No Es SPADIES

Esto es crítico. Escribe una comparación clara y corta con esta estructura:

| Aspecto | SPADIES | Este Proyecto |
|---------|---------|---------------|
| Alcance | Estadísticas nacionales agregadas | Por estudiante, por institución |
| Temporalidad | Retrospectivo (después de la deserción) | Predictivo (antes de la deserción) |
| Granularidad | Tasas a nivel de cohorte | Puntajes de riesgo individuales |
| Accionabilidad | Dashboard de medición | Flujos de intervención + alertas |
| Integración | Sin API institucional | Ingesta de datos del SIA universitario |
| IA | Ninguna | Modelo de clasificación ML + asistente IA generativa |

Luego un párrafo corto explicando: SPADIES le dice al país CUÁNTOS
desertaron. Este sistema le dice a una universidad CUÁLES estudiantes están
a punto de desertar, y QUÉ hacer al respecto. Operan en capas completamente
diferentes.

### Resumen de la solución (breve, ya que la arquitectura viene en la Entrega 2):

Menciona que estos componentes existen pero no los detalles aún:
- Motor de predicción ML (modelo de clasificación — XGBoost/Random Forest
  sobre características tabulares: promedio académico, créditos, puntaje
  Saber 11, estado de apoyo financiero, estrato socioeconómico, historial
  de ausencia intersemestral)
- Datos sintéticos de entrenamiento generados a partir de distribuciones
  públicas de SPADIES
- Dashboard para tutores (basado en roles, con explicabilidad por estudiante)
- Sistema de alertas y notificaciones
- Componente de IA generativa: Claude como asistente de IA integrado en la
  plataforma — los tutores pueden consultarlo sobre perfiles de riesgo
  estudiantil y obtener sugerencias de intervención
- Pipeline CI/CD para despliegue continuo
- Salida de reportes compatible con SPADIES

## FUENTES — Solo estas 6, todas verificadas y de acceso abierto

Todos los enlaces deben ser clicables en el markdown. Referéncialos en línea
donde se citen datos, y lístalos en una sección de Referencias al final.

1. [SPADIES — Estadísticas de Deserción (MEN, 2024)](https://www.mineducacion.gov.co/sistemasinfo/spadies/secciones/Estadisticas-de-desercion/)
2. [Ley 30/1992 — Educación Superior](http://www.secretariasenado.gov.co/senado/basedoc/ley_0030_1992.html)
3. Ley 1581/2012 — Habeas Data (referencia por nombre)
4. Ley 2307/2023 — Gratuidad (referencia por nombre)
5. [Cómo SPADIES mejoró los resultados en Colombia (EconStor, 2021)](https://www.econstor.eu/handle/10419/233065)
6. [LEE Informe N°74 — Deserción en Educación Superior (U. Javeriana, 2023, PDF)](https://www.javeriana.edu.co/recursosdb/5581483/8102914/INFORME-74-DESERCIO%CC%81N-EDU-SUPERIOR2023.pdf)

NO agregues otras fuentes. NO inventes estadísticas.

## FORMATO

- Inglés, Markdown limpio para GitHub
- Enlace al documento de trabajo compartido justo después del título, visible
- Tabla de Contenidos con las 8 secciones (contenido + marcadores de posición)
- Tablas concisas, sin muros de texto
- Línea de tiempo del proyecto mostrando las 5 entregas con fechas
- Tabla del equipo (nombres, columna de GitHub vacía)
- Mantener todo el documento por debajo de 400 líneas de markdown

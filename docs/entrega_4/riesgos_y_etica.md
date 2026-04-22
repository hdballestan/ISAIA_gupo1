# Riesgos, sesgos y etica — Entrega 4

## 1) Marco aplicado

El analisis se hizo sobre riesgos tecnicos, legales y sociales del MVP
CertiDoc, con referencia a normas colombianas relevantes (Ley 1581/2012,
Ley 1273/2009, Ley 1918/2018 y Decreto 19/2012).

## 2) Riesgos tecnicos

| Riesgo | Impacto | Mitigacion aplicada | Mitigacion pendiente |
|---|---|---|---|
| Dependencia de servicios externos (VirusTotal) | Fallas en consulta de amenazas | Endpoint bajo demanda + fallback `unavailable` | Cache de resultados por ventana de tiempo |
| Deuda tecnica por sugerencias de IA no validadas | Inconsistencias entre docs y codigo | Checklist manual por tarea y revision cruzada | Automatizar chequeos de coherencia docs/codigo |
| Perdida de conocimiento tacito | Dificultad para mantener decisiones | Registro en `.prompts/`, `tasks/` y README | Consolidar ADR formales por decision mayor |
| OCR sensible a calidad de imagen | Extracciones incompletas | Mensajes de error claros y flujo alterno por texto | Preprocesamiento de imagen en cliente |

## 3) Riesgos legales

| Riesgo | Norma relacionada | Aplicacion en el proyecto | Estado |
|---|---|---|---|
| Tratamiento excesivo de datos personales | Ley 1581/2012 (principios de finalidad y minimizacion) | Documentos se procesan en cliente, no se almacenan en servidor | Mitigado en MVP |
| Exposicion por controles de seguridad insuficientes | Ley 1273/2009 (delitos informaticos) | JWT, bcrypt, validacion de entrada, CORS, rate limit y honeypot | Mitigado parcialmente |
| Derechos de autor de codigo generado por IA | Regimen de propiedad intelectual aplicable en Colombia | Revision humana, ajustes manuales y trazabilidad en commits | Mitigado parcialmente |

## 4) Riesgos sociales

| Riesgo social | Impacto potencial | Mitigacion aplicada | Pendiente |
|---|---|---|---|
| Exclusión digital de personas con baja conectividad | Menor acceso a orientacion de tramites | UI simple, flujo directo por texto y enlaces oficiales | Version ligera offline de apoyo |
| Sesgo de cobertura hacia tramites mas comunes | Menor precision para casos regionales | Formulario de tickets para proponer nuevos certificados | Curaduria periodica por region |
| Barrera de lenguaje tecnico | Mala interpretacion de resultados | Textos de interfaz en lenguaje ciudadano | Pruebas de usabilidad con usuarios reales |

## 5) Analisis de sesgos en catalogo y regex

El catalogo inicial es finito y fue curado manualmente. Esto puede producir
sesgo de cobertura (mas fuerte en entidades nacionales y ciudades principales).

El matcher por regex reduce alucinacion, pero puede fallar cuando un documento
usa sinonimos no previstos. El riesgo no es inventar resultados, el riesgo es
dejar de detectar uno real (falso negativo).

Medidas aplicadas:

- apertura de tickets ciudadanos para ampliar catalogo
- refinamiento incremental de `regex_patterns`
- trazabilidad de cambios en tareas y commits

## 6) Cumplimiento de principios eticos

| Principio | Aplicacion concreta |
|---|---|
| Transparencia | Se aclara que CertiDoc orienta, no emite certificados |
| Consentimiento | El usuario decide si sube archivo o pega texto |
| Minimizacion | No se persisten documentos originales (procesamiento local) |
| Proporcionalidad | Se usa regex para un dominio cerrado, evitando complejidad innecesaria |

## 7) Cierre

La postura etica del proyecto es pragmatica: usar IA para aumentar
productividad, con limites claros, validacion manual y trazabilidad.
Todavia hay deuda pendiente (sesgo de cobertura y mayor automatizacion de
controles), pero el MVP ya aplica medidas concretas de privacidad y seguridad.

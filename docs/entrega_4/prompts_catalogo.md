# Catalogo anotado de prompts — Entrega 4

## 1) Inventario por archivo

| Archivo | Fase | Proposito | Salida esperada | Salida real | Iteracion |
|---|---|---|---|---|---|
| `.prompts/entrega_1.md` | E1 inicial | Primer README del tema original | Documento base de problema y diferenciador | Sirvio como punto de partida, luego el tema fue reemplazado | Si |
| `.prompts/reestructuracion.md` | E1 ajuste | Propuesta formal de cambio de tema | Nuevo alcance, actores, procesos, reglas y decisiones | Se adopto CertiDoc con foco en tramites colombianos | Si |
| `.prompts/entrega_1_new.md` | E1 refactor | Redactar README refactorizado (secciones 1 a 3) | Problema, requerimientos SMART y trazabilidad | Se genero base de README vigente para E1 | Si |
| `.prompts/entrega_2.md` | E2 | Arquitectura y diseno detallado | Diagramas, modelo de datos y API | Util para E2, luego hubo desalineacion tras simplificacion E3 | Si |
| `.prompts/correcciones/revision_completitud_v1.md` | E2 revision | Detectar vacios y placeholders | Tabla de problemas por seccion | Permitio ubicar deuda documental pendiente | Si |
| `.prompts/correcciones/revision_rubrica_v1.md` | E2 revision | Evaluar cobertura de rubrica | Tabla CUBIERTO/PARCIAL/AUSENTE | Se identificaron criterios parciales para cierre posterior | Si |
| `.prompts/correcciones/decision_no_almacenar_docs.md` | E2 seguridad | Definir politica de privacidad de documentos | Decision de procesamiento client-side | Se aplico como principio tecnico del proyecto | No |
| `.prompts/correcciones/entrega_2_pendientes_finales.md` | E2 cierre | Corregir robustez y formato README | Lista de ajustes puntuales | Sirvio como backlog de correcciones | Si |
| `.prompts/discusion/cambios_entrega_3.md` | E3 plan | Simplificar stack para entrega individual | Decisiones tecnicas con trade-offs | Se migro a FastAPI, PostgreSQL, regex y OCR local | No |
| `.prompts/discusion/revision_planes_entrega_3_codex_uv.md` | E3 plan | Revisar debilidades del plan | Hallazgos y acciones correctivas | Se corrigieron dependencias y uso de `uv` | Si |
| `.prompts/discusion/proceso_ia_y_dependencias_entrega_3.md` | E3 plan | Alinear narrativa de herramientas | Acuerdo de uso combinado de modelos | Quedo trazabilidad de proceso IA | No |
| `.prompts/entrega_3.md` | E3 ejecucion | Plan maestro de construccion y pruebas | Objetivo, stack, entregables y log de prompts | Se uso como bitacora viva de implementacion | Si |
| `.prompts/correcciones/correcciones_plan_entrega_3_2026-04-12.md` | E3 ajuste | Registrar correcciones de plan | Lista de cambios concretos | Se cerraron huecos de alcance y dependencias | No |
| `.prompts/correcciones/cambio_solo_docker_2026-04-14.md` | E3 ajuste | Pasar ejecucion local a Docker | Definicion de cambio y motivacion | Se actualizo compose y script operativo | No |
| `.prompts/ux-portales-y-ocr-fix.md` | E3 ajuste UX/OCR | Resolver OCR y mejorar estado de portales | Pasos tecnicos y checklist | Se aplicaron cambios de OCR local y UX legible | Si |
| `.prompts/discusion/discusion_frontend_limpio_2026-04-17.md` | E3 pulido | Ajuste visual de frontend | Acuerdos de interfaz sin cambiar logica | Se aplicaron cambios visuales y de copy | No |
| `.prompts/discusion/feature_vt_bajo_demanda_2026-04-17.md` | E3 seguridad UX | Pasar VT a revision bajo demanda | Cambio de flujo y fallback | Se agrego endpoint dedicado y fallback `unavailable` | No |
| `.prompts/correcciones/refactorizar_readme_2026-04-17.md` | E3 docs | Alinear README con arquitectura real | Reescritura de secciones 4 a 6 | README quedo coherente con stack implementado | Si |

## 2) Tabla resumen solicitada

| archivo | fecha | herramienta | resultado_validado |
|---|---|---|---|
| `.prompts/entrega_1.md` | 2026-03-27 (aprox) | Claude Code | si |
| `.prompts/reestructuracion.md` | 2026-04-07 (aprox) | Claude Code (Opus) | si |
| `.prompts/entrega_1_new.md` | 2026-04-07 (aprox) | Claude Code | si |
| `.prompts/entrega_2.md` | 2026-04-07 | Claude Code | si |
| `.prompts/correcciones/revision_completitud_v1.md` | 2026-04-08 | Claude Code | si |
| `.prompts/correcciones/revision_rubrica_v1.md` | 2026-04-08 | Claude Code | si |
| `.prompts/correcciones/decision_no_almacenar_docs.md` | 2026-04-08 | Claude Code | si |
| `.prompts/correcciones/entrega_2_pendientes_finales.md` | 2026-04-08 | Claude Code | si |
| `.prompts/discusion/cambios_entrega_3.md` | 2026-04-12 | Opus 4.6 + gpt-5.3-codex | si |
| `.prompts/discusion/revision_planes_entrega_3_codex_uv.md` | 2026-04-12 | gpt-5.3-codex | si |
| `.prompts/discusion/proceso_ia_y_dependencias_entrega_3.md` | 2026-04-12 | Opus 4.6 + gpt-5.3-codex | si |
| `.prompts/entrega_3.md` | 2026-04-12 | Opus 4.6 + Haiku 4.5 + gpt-5.3-codex | si |
| `.prompts/correcciones/correcciones_plan_entrega_3_2026-04-12.md` | 2026-04-12 | gpt-5.3-codex | si |
| `.prompts/correcciones/cambio_solo_docker_2026-04-14.md` | 2026-04-14 | Claude Code | si |
| `.prompts/ux-portales-y-ocr-fix.md` | 2026-04-17 | gpt-5.3-codex + Claude Code | si |
| `.prompts/discusion/discusion_frontend_limpio_2026-04-17.md` | 2026-04-17 | Claude Code | si |
| `.prompts/discusion/feature_vt_bajo_demanda_2026-04-17.md` | 2026-04-17 | Claude Code | si |
| `.prompts/correcciones/refactorizar_readme_2026-04-17.md` | 2026-04-17 | gpt-5.3-codex | si |

## 3) Criterio de validacion usado

Un resultado se marco como validado cuando cumplio tres condiciones
(coherencia con rubrica, consistencia con codigo del repositorio y revision
manual antes de integrar).

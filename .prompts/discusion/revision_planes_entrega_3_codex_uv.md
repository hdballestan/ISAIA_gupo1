# Revision de planes Entrega 3 (formato prompt + respuesta)

**Fecha:** 2026-04-12

## Prompt revisado

Se solicita evaluar de forma critica los planes de Entrega 3 (`plan.md`, `tasks/`, `.prompts/`) para detectar puntos flacos y proponer complementos antes de modificar. Tambien se pide considerar estas decisiones:

- Backend con gestion de paquetes via `uv`
- Proceso IA complementario: Opus 4.6 + gpt-5.3-codex para planificacion
- Ejecucion asistida con Kaiku y Sonnet

## Respuesta de revision

El plan esta bien estructurado por fases, pero requiere ajustes puntuales para evitar retrabajo y mejorar consistencia de evidencia.

### Hallazgos criticos

1. Dependencias de tareas incompletas:
   - `T-04` debe depender de `T-05` porque usa matcher en `/extract`.
   - Falta `CertificateDetail` en el arbol base, aunque se usa en rutas.
   - `T-03` incluye `/me/*` sin tarea dedicada para implementarlo.

2. Gestion de dependencias backend:
   - El plan sigue centrado en `requirements.txt`.
   - Con `uv`, la fuente de verdad debe ser `pyproject.toml` + `uv.lock`.

3. Contrato API:
   - Falta versionado explicito y formato comun de errores.
   - Se acepta incorporar versionado (`/api/v1`) en el plan.

4. Coherencia de privacidad:
   - Si el procesamiento es client-side, `/extract` debe recibir texto y no archivo crudo.

### Fortalezas

- Fases claras y trazables.
- Alcance MVP acotado al deadline.
- Seguridad base contemplada (JWT, RBAC, rate limit, honeypot).

### Acciones recomendadas para aplicar en el plan

1. Mantener referencia a Opus y agregar Codex como complemento del proceso IA (no sustituir).
2. Actualizar entregables backend para trabajar con `uv`.
3. Corregir dependencias esenciales entre tareas.
4. Agregar versionado API y contrato de error minimo en criterios de aceptacion.

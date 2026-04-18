# Correcciones aplicadas al plan Entrega 3

**Fecha:** 2026-04-12

Se registran ajustes concretos sobre `plan.md` y `tasks/` para cerrar huecos detectados en la revision.

## Cambios aplicados

1. Dependencias corregidas:
   - `T-2026-04-12-04` ahora depende tambien de `T-2026-04-12-05`.

2. Estructura faltante agregada en planeacion:
   - Se incluye `frontend/src/pages/CertificateDetail.jsx` en arbol y en indice.

3. Alcance RBAC corregido:
   - Se retira referencia a `/me/*` en `T-2026-04-12-03` para evitar alcance sin tarea.

4. Gestion de paquetes backend alineada con decision:
   - `uv` definido como base (`pyproject.toml` + `uv.lock`).
   - `requirements.txt` queda como opcional de compatibilidad.

5. Versionado y contrato API incorporados:
   - Endpoints definidos bajo `/api/v1`.
   - Se agrega contrato de error comun.

6. CI/CD ajustado para menor riesgo:
   - Lint/test en PR y push.
   - Deploy manual o por tag/release.

## Nota

Este archivo documenta correcciones de plan. Las decisiones de proceso (modelos IA y forma de trabajo) viven en `discusion/`.

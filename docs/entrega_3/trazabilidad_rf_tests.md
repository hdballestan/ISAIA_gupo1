# Trazabilidad RF y pruebas — Entrega 3

| RF | Descripcion breve | Evidencia | Resultado |
|---|---|---|---|
| RF-01 | Catalogo de certificados con metadatos | `backend/tests/test_api.py::test_admin_certificate_crud_flow` + `GET /api/v1/certificates` | Cumple |
| RF-02 | Consulta por proposito | Filtro `purpose` en `backend/app/routes/certificates.py` (validacion manual de endpoint) | Cumple |
| RF-03 | Lista orientativa con entidad, portal y requisitos | `GET /api/v1/certificates` + render en `frontend/src/components/CertificateTable.jsx` | Cumple |
| RF-04 | Subida de PDF para extraccion | Flujo manual documentado en `tasks/T-2026-04-15-01.md` y `tasks/T-2026-04-17-01.md` | Cumple |
| RF-05 | Subida de imagen para OCR | Flujo manual documentado en `tasks/T-2026-04-15-01.md` (iteraciones de OCR) | Parcial |
| RF-06 | Pegado de texto para extraccion | `frontend/src/components/DocumentUploader.jsx` + `frontend/src/utils/matcher.test.js` | Cumple |
| RF-07 | Matching contra catalogo | `backend/tests/test_matcher.py` + `frontend/src/utils/matcher.test.js` | Cumple |
| RF-08 | Tablero personal de estados | No implementado en E3 (queda en backlog, ver `tasks/T-2026-04-21-02.md`) | No implementado |
| RF-09 | Alertas de vencimiento | No implementado en E3 (backlog) | No implementado |
| RF-10 | Formulario de solicitud de tramite | `POST /api/v1/tickets` + UI en `frontend/src/components/TicketForm.jsx` | Cumple |
| RF-11 | Rate limit 1 IP por 24h | `backend/tests/test_api.py::test_ticket_rate_limit_blocks_second_request` | Cumple |
| RF-12 | Panel admin para CRUD y moderacion | `backend/tests/test_api.py::test_admin_certificate_crud_flow` + UI admin manual | Cumple |
| RF-13 | Control de acceso por rol | `backend/tests/test_api.py::test_admin_access_without_role_returns_403` | Cumple |
| RF-14 | Exportacion de guia en PDF | No implementado en E3 (backlog) | No implementado |

## Nota

La matriz marca como parcial o no implementado lo que sigue fuera del alcance
de Entrega 3 (RF-08, RF-09 y RF-14). Esto mantiene trazabilidad honesta con la
rubrica y con el estado real del codigo.

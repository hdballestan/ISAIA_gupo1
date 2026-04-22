# Documentación del proyecto — guía maestra

Índice de artefactos de todas las entregas de CertiDoc. Cada entrega vive en
una subcarpeta. Este documento es la fuente única de verdad sobre **qué debe
existir** en cada fase, **dónde va** y **quién/qué lo produce**.

> El `README.md` raíz del proyecto es la narrativa cronológica integrada.
> Esta carpeta `docs/` contiene los artefactos formales por entrega que se
> referencian desde el README.

## Árbol objetivo

```
docs/
├── README.md                       # este archivo (guía maestra)
├── entrega_1/                      # problema + requerimientos (28-mar)
│   └── ARTEFACTOS.md               # enlaza secciones del README raíz
├── entrega_2/                      # arquitectura + diseño (8-abr)
│   └── ARTEFACTOS.md               # enlaza secciones 4-5 del README raíz
├── entrega_3/                      # construcción + pruebas (15-abr)
│   ├── ARTEFACTOS.md
│   ├── cobertura_pytest.txt        # salida de pytest --cov
│   ├── cobertura_vitest.txt        # salida de vitest run --coverage
│   ├── trazabilidad_rf_tests.md    # RF-01..RF-14 -> test/smoke/evidencia
│   └── defectos.md                 # registro id/causa/fix/fecha
├── entrega_4/                      # GenAI + ética (22-abr)
│   ├── ARTEFACTOS.md
│   ├── informe_genai.md            # estrategia completa de uso de IA
│   ├── prompts_catalogo.md         # índice anotado hacia .prompts/
│   ├── evaluacion_critica.md       # qué falló, qué acertó, por qué
│   └── riesgos_y_etica.md          # riesgos, sesgos, mitigaciones
├── presentacion/                   # entrega final (25-abr)
│   ├── libreto.md                  # guion de 10 min
│   ├── slides.pdf                  # exportado desde Keynote/Slides
│   └── guion_demo.md               # pasos exactos de la demo en vivo
├── deploy/
│   └── ec2.md                      # bootstrap EC2 + nginx + certbot
└── evidencia_final/                # capturas del sistema operando
    ├── extraccion_pdf.png
    ├── extraccion_imagen.png
    ├── checklist_funcional.png
    ├── admin_crud.png
    └── threat_check_funcionando.png
```

## Estado por entrega

| Entrega | Fecha | Estado | Task que lo cierra |
|---|---|---|---|
| E1 — Problema y requerimientos | 28-mar | Completo en README §1-§3 | — |
| E2 — Arquitectura y diseño | 8-abr | Completo en README §4 y §5 | `tasks/T-2026-04-22-01.md` |
| E3 — Construcción y pruebas | 15-abr | Completo con artefactos de evidencia en `docs/entrega_3/` | `tasks/T-2026-04-22-01.md` |
| E4 — GenAI y ética | 22-abr | Completo con artefactos en `docs/entrega_4/` | `tasks/T-2026-04-22-01.md` |
| Final — Producto integrado | 25-abr | Pendiente | `tasks/T-2026-04-25-01.md` |

## Instrucciones para crear los artefactos

### docs/entrega_1/ARTEFACTOS.md

Un índice que enlaza a las secciones ya existentes del README raíz:

- Definición del problema → README §1
- Actores y procesos → README §1 (tablas)
- Reglas y marco regulatorio → README §1
- Diferenciador → README §2
- Requerimientos funcionales y no funcionales → README §3.1, §3.2
- Trazabilidad → README §3.4
- Uso de IA en el análisis → README §3.3
- Prompts fuente → `.prompts/entrega_1_new.md`, `.prompts/reestructuracion.md`

No duplicar contenido: este archivo es un mapa, no una copia.

### docs/entrega_2/ARTEFACTOS.md

- Arquitectura de contexto y contenedores → README §4.1, §4.2
- Decisiones y trade-offs → README §4.4
- Principios de diseño → README §4.5
- Prompts fuente → `.prompts/entrega_2.md`, `.prompts/discusion/cambios_entrega_3.md`
- **Nota de diferimiento** — §5 detallado se cierra en E4 con modelo PostgreSQL real, API vigente y componentes React actuales.

### docs/entrega_3/ARTEFACTOS.md

- Implementación → README §6
- Estrategia de pruebas → README §7.2
- Criterios de calidad → README §7.3
- Cobertura → `cobertura_pytest.txt`, `cobertura_vitest.txt` (este mismo folder)
- Matriz RF ↔ prueba → `trazabilidad_rf_tests.md`
- Defectos → `defectos.md`

**Cómo generar los reportes de cobertura (comandos que corre el humano o el LLM ejecutor, no Claude):**

```
cd backend && uv run pytest --cov=app --cov-report=term > ../docs/entrega_3/cobertura_pytest.txt
cd ../frontend && npx vitest run --coverage > ../docs/entrega_3/cobertura_vitest.txt
```

**Plantilla trazabilidad_rf_tests.md:**

```
| RF | Descripción breve | Evidencia | Resultado |
|---|---|---|---|
| RF-01 | Catálogo de certificados | backend/tests/test_certificates.py::test_list | ✅ |
| RF-04 | Subida PDF | matcher.test.js::pdf-flow + smoke test | ✅ |
| RF-11 | Rate limit 1/IP/24h | backend/tests/test_tickets.py::test_rate_limit | ✅ |
...
```

**Plantilla defectos.md:**

```
| ID | Fecha | Síntoma | Causa raíz | Fix (commit) |
|---|---|---|---|---|
| D-001 | 2026-04-15 | OCR producía texto vacío en PNG | Tesseract.js sin worker configurado | 17b4c32 |
...
```

### docs/entrega_4/

Ver instrucciones detalladas en `tasks/T-2026-04-22-01.md`. Producir **4 archivos**:

1. `informe_genai.md` — estrategia, herramientas, prompts, workflows.
2. `prompts_catalogo.md` — índice anotado con propósito y salida esperada de cada prompt en `.prompts/`.
3. `evaluacion_critica.md` — qué funcionó, qué falló, cuándo hubo que re-promptear, alucinaciones detectadas.
4. `riesgos_y_etica.md` — riesgos técnicos, legales, sociales; análisis de sesgos; mitigaciones aplicadas; datos y privacidad.

Al cerrar E4, actualizar README §5, §8 y §9 con enlaces a estos archivos.

### docs/presentacion/

- `libreto.md` → ya creado en este commit.
- `slides.pdf` → responsabilidad del humano (exportar desde la herramienta de diseño).
- `guion_demo.md` → instrucciones paso a paso para la demo en vivo, con backup (capturas) por si falla internet en clase.

### docs/deploy/ec2.md

Bootstrap de la instancia EC2 (lo hace el humano). Ver
`tasks/T-2026-04-21-03.md` para contenidos requeridos:

- AMI, tamaño, SG, EBS.
- Instalación de docker, docker compose, nginx, certbot.
- Estructura `/opt/certidoc/` con `docker-compose.prod.yml` y `.env`.
- Config nginx con reverse proxy y TLS.
- Estrategia de rollback.

### docs/evidencia_final/

Capturas tomadas al sistema desplegado en EC2, cubriendo los flujos clave de
negocio listados en el libreto de sustentación.

## Qué NO va en docs/

- Código fuente → `backend/`, `frontend/`.
- Prompts vivos → `.prompts/`.
- Tareas operativas → `tasks/`.
- CI/CD → `.github/workflows/`.

## Convenciones

- Todos los archivos `.md` con encabezado `# Título — Entrega N`.
- Fechas en formato ISO `YYYY-MM-DD`.
- Enlaces relativos entre archivos de `docs/`.
- Capturas en PNG, nombre descriptivo en snake_case.
- Longitud máxima recomendada por archivo: 300 líneas.

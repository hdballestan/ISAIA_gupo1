# Artefactos de referencia — Entrega 3

Este archivo concentra la evidencia de construccion y pruebas.

## Enlaces principales

- Construccion e implementacion: `../../README.md` (seccion 6)
- Estrategia y criterios de calidad: `../../README.md` (secciones 7.2 y 7.3)
- Cobertura backend (pytest): `cobertura_pytest.txt`
- Cobertura frontend (vitest): `cobertura_vitest.txt`
- Matriz RF con pruebas y evidencia manual: `trazabilidad_rf_tests.md`
- Registro de defectos corregidos: `defectos.md`

## Nota sobre ejecucion de cobertura

La cobertura backend se genero con `uv run --with pytest-cov` porque el plugin
`pytest-cov` no estaba instalado por defecto en el entorno.

La cobertura frontend se ejecuto con runtime Node 22 para resolver
incompatibilidades de motor con Vitest/Vite en el entorno local.

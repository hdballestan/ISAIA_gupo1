# Prompt — Correcciones Pendientes Entrega 2 (README)

## Instruccion principal
Aplica un ajuste puntual al `README.md` para cerrar pendientes de Entrega 2 segun rubrica (`rubrica.txt`).

No cambies el tema, no reestructures secciones completas y no agregues fuentes nuevas.
Trabaja solo en secciones 4, 5 y Anexos.

---

## Pendientes a corregir

### 1) Robustez y alta disponibilidad explicitas en arquitectura
En **seccion 4** agrega un subapartado breve (o amplía 4.7/4.9) con mecanismos concretos de robustez/HA, minimo:

- timeouts y retries para llamada a OpenAI,
- manejo de fallos (fallback controlado cuando OpenAI no responde),
- idempotencia para endpoints de escritura (`/tickets`, `/me/certificates/{id}`),
- desacople asincrono para extraccion pesada (ej. SQS) como decision de evolucion,
- observabilidad minima (CloudWatch metrics/alarms, correlation/request id).

Formato esperado: tabla `Mecanismo | Donde aplica | Riesgo mitigado | Trade-off`.

### 2) Eliminar placeholders de anexos en estado "pendiente"
En **Anexos**, reemplaza textos tipo "[pendiente de documentacion]" por una redaccion cerrada y verificable.

Requisito:
- mantener los anexos D/E/F,
- describir su proposito,
- si el archivo aun no existe, marcarlo como "programado" (no "pendiente") con una fecha objetivo.

### 3) Ajuste de forma (lineas del README)
Reducir longitud del `README.md` para que no exceda **550 lineas** sin perder cobertura de rubrica de Entrega 2.

Sugerencias permitidas:
- compactar texto redundante,
- fusionar bullets repetidos,
- simplificar notas extensas.

No eliminar:
- diagramas mermaid de 4.1, 4.2, 4.3, 4.4, 4.5, 4.6,
- tabla de decisiones y trade-offs,
- tabla de seguridad,
- trazabilidad endpoint -> RF.

---

## Criterios de aceptacion

1. Queda explicita la robustez/HA con mecanismos tecnicos verificables.
2. No hay textos "pendiente" en anexos D/E/F.
3. El README final queda en <=550 lineas.
4. Se mantiene coherencia con RF/RNF y con la seccion de arquitectura.

---

## Salida esperada

Devuelve:
1. lista corta de cambios aplicados,
2. lineas finales del README,
3. validacion final contra estos 4 criterios.

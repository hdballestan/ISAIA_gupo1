# Prompt — Revision de Completitud del README

## Instruccion
Revisa el README.md del proyecto CertiDoc y devuelve una lista de problemas
con formato: Seccion | Problema | Correccion.

## Checklist

1. **Secciones vacias o placeholder:** identifica toda seccion marcada como
   "marcador de posicion" que deberia tener contenido segun la entrega actual.

2. **Cobertura de rubrica por entrega:**
   - Entrega 1 (secciones 1-3): problema delimitado, actores, procesos
     explicitos, reglas de negocio, restricciones, RF con SMART, RNF,
     trazabilidad, uso de GenAI documentado.
   - Entrega 2 (secciones 4-5): C4 (contexto, contenedores, componentes),
     secuencia, infra, principios, trade-offs, modelo de datos, API, frontend,
     seguridad, pipeline, uso justificado de LLM/RAG.

3. **Coherencia cruzada:**
   - Cada endpoint de la API (seccion 5.2) traza a un RF (seccion 3.1).
   - Cada componente frontend (seccion 5.3) traza a un proceso (seccion 1).
   - Cada decision de seguridad (seccion 5.5) traza a un RNF (seccion 3.2).
   - Los actores de los procesos coinciden con la tabla de actores.

4. **Notas pendientes:** busca cualquier texto que diga "pendiente",
   "marcador", "se cerrara cuando" y senalalo como deuda.

5. **Formato:** dobles separadores (---), tablas rotas, links muertos,
   secciones fuera de orden en la tabla de contenidos.

Devuelve SOLO la tabla de problemas. No reescribas el documento.

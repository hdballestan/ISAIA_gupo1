Revisa el código modificado o por modificar aplicando estas reglas. Usa context7 para verificar el uso correcto de cada librería antes de sugerir cambios.

## Python / FastAPI — PEP 8

- flake8 con max-line-length=88
- Imports ordenados: stdlib > third-party > local, separados por línea en blanco
- snake_case para funciones y variables, PascalCase para clases
- Type hints en funciones públicas
- Pydantic para validación de entrada
- Excepciones específicas (nunca bare except)
- Máximo 300 líneas por archivo — si excede, dividir por responsabilidad
- Máximo 20 líneas por función — si excede, extraer subfunciones
- Sin comentarios que repitan lo que el código ya dice

## React / Vite — JavaScript

- Un componente por archivo, nombre PascalCase
- Props destructuradas: `function Card({ title, url })`
- Hooks al inicio del componente
- useEffect con array de dependencias correcto y cleanup
- Estilos solo via clases CSS en styles.css (no inline, no módulos)
- Llamadas a API en services/, nunca en componentes
- Máximo 300 líneas por archivo, 20 por función

## CSS

- Variables en `:root` para colores, fuentes, espaciado
- Mobile-first: estilos base para móvil, media queries para desktop
- Clases descriptivas BEM: `.card__title`, `.uploader--active`
- Sin `!important` salvo override de terceros
- Fuentes y tamaños definidos una sola vez en `:root`

## Seguridad

- Sanitizar entrada del usuario (backend: Pydantic, frontend: escapar HTML)
- No exponer API keys ni secrets en frontend
- CORS: solo el dominio del frontend
- JWT con expiración ≤ 1 hora
- Passwords: bcrypt con cost ≥ 12
- Rate limiting activo en endpoints públicos sensibles

## Checklist antes de aprobar cambios

1. ¿El archivo tiene menos de 300 líneas?
2. ¿Cada función tiene menos de 20 líneas?
3. ¿Los imports siguen el orden correcto?
4. ¿Se usó context7 para verificar APIs de librerías?
5. ¿Los estilos están en styles.css, no inline?
6. ¿Hay comentarios innecesarios que eliminar?
7. ¿La entrada del usuario está validada?

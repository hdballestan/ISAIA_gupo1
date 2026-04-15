#!/usr/bin/env bash
# CertiDoc — Script de ejecución
# Uso: bash deploy.sh [up|down|logs|reset|test]

set -e

CMD="${1:-up}"

# --------------------------------------------------------------------------
# Helpers
# --------------------------------------------------------------------------
check_docker() {
  if ! command -v docker &>/dev/null; then
    echo "ERROR: Docker no está instalado."
    echo "  Instala Docker Desktop: https://www.docker.com/products/docker-desktop"
    exit 1
  fi

  if ! docker info &>/dev/null 2>&1; then
    echo "ERROR: Docker Desktop no está corriendo."
    echo "  Abre Docker Desktop y espera a que el motor esté activo."
    echo "  En Windows puedes iniciarlo desde el menú de inicio."
    exit 1
  fi
}

check_compose() {
  if ! docker compose version &>/dev/null 2>&1; then
    echo "ERROR: docker compose (v2) no está disponible."
    echo "  Actualiza Docker Desktop a la versión más reciente."
    exit 1
  fi
}

# --------------------------------------------------------------------------
# Comandos
# --------------------------------------------------------------------------
cmd_up() {
  check_docker
  check_compose
  echo "Levantando pila completa (db + backend + frontend)..."
  docker compose up --build -d
  echo ""
  echo "Servicios disponibles:"
  echo "  Frontend:  http://localhost:5173"
  echo "  Backend:   http://localhost:8000"
  echo "  Swagger:   http://localhost:8000/docs"
  echo ""
  echo "Para ver logs en vivo: bash deploy.sh logs"
}

cmd_down() {
  check_docker
  check_compose
  docker compose down
  echo "Pila detenida."
}

cmd_logs() {
  check_docker
  check_compose
  docker compose logs -f
}

cmd_reset() {
  check_docker
  check_compose
  echo "Eliminando contenedores y volúmenes (reset de DB)..."
  docker compose down -v
  echo "Levantando desde cero..."
  docker compose up --build -d
  echo "Reset completo."
}

cmd_test() {
  check_docker
  check_compose

  echo "--- Pruebas de humo ---"

  echo "[1] Listado de certificados:"
  curl -sf http://localhost:8000/api/v1/certificates | head -c 200
  echo ""

  echo "[2] Detalle certificado id=1:"
  curl -sf http://localhost:8000/api/v1/certificates/1 | head -c 200
  echo ""

  echo "[3] Matching de texto:"
  curl -sf -X POST http://localhost:8000/api/v1/extract \
    -H "Content-Type: application/json" \
    -d '{"text": "antecedentes judiciales policia nacional"}' | head -c 300
  echo ""

  echo "[4] Frontend responde:"
  curl -sf -o /dev/null -w "HTTP %{http_code}" http://localhost:5173
  echo ""

  echo "--- Pruebas completadas ---"
}

# --------------------------------------------------------------------------
# Dispatch
# --------------------------------------------------------------------------
case "$CMD" in
  up)    cmd_up ;;
  down)  cmd_down ;;
  logs)  cmd_logs ;;
  reset) cmd_reset ;;
  test)  cmd_test ;;
  *)
    echo "Uso: bash deploy.sh [up|down|logs|reset|test]"
    echo ""
    echo "  up     — construir y levantar toda la pila"
    echo "  down   — apagar la pila"
    echo "  logs   — ver logs en vivo"
    echo "  reset  — apagar, limpiar DB y volver a levantar"
    echo "  test   — pruebas de humo contra la API"
    ;;
esac

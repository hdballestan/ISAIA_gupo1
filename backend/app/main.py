from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.db.database import create_tables
from app.db.seed import run_seed
from app.routes.admin import router as admin_router
from app.routes.auth import router as auth_router
from app.routes.certificates import router as certificates_router
from app.routes.extract import router as extract_router
from app.routes.tickets import router as tickets_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    run_seed()
    yield


app = FastAPI(
    title="CertiDoc API",
    version="1.0.0",
    description="Portal Unificado de Gestión de Certificados (Colombia)",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.exception_handler(HTTPException)
async def http_error_handler(_: Request, exc: HTTPException) -> JSONResponse:
    body = {
        "code": str(exc.status_code),
        "message": "Solicitud invalida",
        "details": [],
    }
    if isinstance(exc.detail, str):
        body["message"] = exc.detail
    return JSONResponse(status_code=exc.status_code, content={"error": body})


@app.exception_handler(RequestValidationError)
async def validation_error_handler(
    _: Request, exc: RequestValidationError
) -> JSONResponse:
    body = {
        "code": "422",
        "message": "Error de validacion",
        "details": exc.errors(),
    }
    return JSONResponse(status_code=422, content={"error": body})


app.include_router(auth_router)
app.include_router(certificates_router)
app.include_router(extract_router)
app.include_router(tickets_router)
app.include_router(admin_router)

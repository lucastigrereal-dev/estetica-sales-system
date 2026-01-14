from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import leads, agendamentos, dashboard, pagamentos, webhooks, clinicas

# Criar todas as tabelas no banco de dados
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Estética Sales System API",
    description="API para gerenciamento de leads, pacientes, agendamentos e financeiro",
    version="2.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(leads.router, prefix="/api", tags=["Leads"])
app.include_router(agendamentos.router, prefix="/api", tags=["Agendamentos"])
app.include_router(dashboard.router, prefix="/api", tags=["Dashboard"])
app.include_router(clinicas.router, prefix="/api", tags=["Clinicas"])
app.include_router(pagamentos.router, prefix="/api", tags=["Pagamentos"])
app.include_router(webhooks.router, prefix="/api", tags=["Webhooks"])

@app.get("/")
def root():
    return {
        "message": "Estética Sales System API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}

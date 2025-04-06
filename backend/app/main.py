from fastapi import FastAPI
from app.core.middleware import setup_cors
from app.db.init_db import init_db
from app.api.routes import router as api_router

def create_app() -> FastAPI:
    app = FastAPI(title="ToDo App")

    setup_cors(app)
    app.include_router(api_router)
    init_db()

    return app

app = create_app()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import chat, content

app = FastAPI(title="Farmer Assistant API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(content.router, prefix="/api/content", tags=["content"])


@app.get("/api/health")
async def health() -> dict:
    return {"status": "ok"}

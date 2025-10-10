from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette.status import HTTP_429_TOO_MANY_REQUESTS

class RateLimitError(Exception):
    def __init__(self, message: str = "Too many requests"):  # noqa: D401
        self.message = message
        super().__init__(message)

class UpstreamAPIError(Exception):
    def __init__(self, message: str = "Upstream API error"):
        self.message = message
        super().__init__(message)

def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(RateLimitError)
    async def _handle_rate_limit(_: Request, exc: RateLimitError):
        return JSONResponse(
            status_code=HTTP_429_TOO_MANY_REQUESTS,
            content={"code": "RATE_LIMIT", "message": exc.message},
        )

    @app.exception_handler(UpstreamAPIError)
    async def _handle_upstream(_: Request, exc: UpstreamAPIError):
        return JSONResponse(status_code=502, content={"code": "UPSTREAM_ERROR", "message": exc.message})

    @app.exception_handler(Exception)
    async def _handle_generic(_: Request, exc: Exception):
        return JSONResponse(status_code=500, content={"code": "INTERNAL_ERROR", "message": str(exc)})

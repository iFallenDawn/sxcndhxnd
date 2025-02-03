from typing import Union

from fastapi import FastAPI

from .routers import commissions

app = FastAPI()

app.include_router(commissions.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
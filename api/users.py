from fastapi import FastAPI

from utils.decorators import public_handler

api = FastAPI()


@public_handler
@api.get("/get-users")
async def get_users():
    # users = get_users()

    return "hello"

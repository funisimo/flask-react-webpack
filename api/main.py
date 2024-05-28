from fastapi import FastAPI
from models.user import User
api = FastAPI()


@api.get("/users")
async def get_user():
    users = User.fetch_all()

    return users


@api.get("/get-user-id")
async def get_user(email):
    try:
        user = User.get_user_by_email(email)
        return user._entity_key._key._path
    except Exception as e:
        return str(e)

@api.get("/get-user/{user_id}")
async def get_user(user_id):
    try:
        user = User.get_user_by_id(user_id)
        return user
    except Exception as e:
        return str(e)


@api.get("/verify-email")
async def get_user(email):
    try:
        return User.verify_email_address(email)
    except Exception as e:
        return str(e)


@api.get("/set-password")
async def get_user(email, password):
    return User.update_password(email, password)


@api.get("/ping")
async def get_user():
    return "pong"

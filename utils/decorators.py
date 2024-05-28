import datetime
import functools
import logging

from flask import request, abort, url_for, redirect

from models.user import User


def set_csrf(func):
    """Needs to be called AFTER @login_required or @admin_required."""
    @functools.wraps(func)
    def wrapper(**params):
        params["csrf"] = User.set_csrf_token(user=params["user"])
        return func(**params)

    return wrapper


def validate_csrf(func):
    """Needs to be called AFTER @login_required or @admin_required."""
    @functools.wraps(func)
    def wrapper(**params):
        csrf = request.form.get("csrf")
        user = params["user"]

        if User.is_csrf_token_valid(user=user, csrf_token=csrf):
            return func(**params)
        else:
            logging.error("CSRF token is not valid for user {user_id}.".format(user_id=user.get_id))
            return abort(403, description="CSRF token is missing or not valid.")

    return wrapper


def react_handler(func):
    @functools.wraps(func)
    def wrapper(path):

        session_token = request.cookies.get("my-web-app-session")
        params = {"now": datetime.datetime.now(), "reactMainJsPath": path}

        if session_token:
            success, user, message = User.get_user_by_session_token(session_token=session_token)
            params["user"] = user

        return func(params)

    return wrapper

def public_handler(func):
    @functools.wraps(func)
    def wrapper(**params):
        session_token = request.cookies.get("my-web-app-session")

        params["now"] = datetime.datetime.now()  # send current date to handler and HTML template

        if session_token:
            success, user, message = User.get_user_by_session_token(session_token=session_token)
            params["user"] = user

        return func(**params)

    return wrapper


def login_required(func):
    @functools.wraps(func)
    def wrapper(**params):
        params["now"] = datetime.datetime.now()  # send current date to handler and HTML template

        session_token = request.cookies.get("my-web-app-session")

        if session_token:
            success, user, message = User.get_user_by_session_token(session_token=session_token)
            params["user"] = user

            if user:
                return func(**params)
            else:
                return abort(403, description=message)

        return redirect(url_for("public.auth.login"))

    return wrapper


def admin_required(func):
    @functools.wraps(func)
    def wrapper(**params):
        session_token = request.cookies.get("my-web-app-session")

        params["now"] = datetime.datetime.now()  # send current date to handler and HTML template

        if session_token:
            success, user, message = User.get_user_by_session_token(session_token=session_token)
            params["user"] = user

            if user and user.admin:
                return func(**params)
            elif user:
                logging.error("Non-admin user {username} wanted to access an admin-only page.".format(username=user.username))
                return abort(403, description="I'm sorry, but this is for admins only.")
            else:
                return abort(403, description=message)

        return redirect(url_for("public.auth.login"))

    return wrapper

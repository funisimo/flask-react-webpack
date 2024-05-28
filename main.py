import json

from flask import Flask, send_from_directory

import handlers.profile.sessions
from cron.remove_deleted_users import remove_deleted_users_cron
from handlers.admin import users
from handlers.profile.auth import logout
from handlers.public import main as public_main, auth
from handlers.profile import main as profile_main
from tasks.send_email_task import send_email_via_sendgrid
from utils.check_environment import is_local
from utils.decorators import public_handler
from utils.fake_data import load_fake_data
from api import main
from a2wsgi import ASGIMiddleware
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from flask_cors import CORS

app = Flask(__name__)
# For asset loading
CORS(app)

reactBuildPath = '/react-app/build'

# Mapping flask and fastapi applications on same app
app.wsgi_app = DispatcherMiddleware(app.wsgi_app, {
    '/home': app,
    '/api': ASGIMiddleware(main.api),
})


# react static resources
# @app.route('/react', defaults={'path': 'index.html'})
# @app.route('/react/<path:path>')
# def react(path):
#     return send_from_directory(app.static_folder, path)

# React main bundle entry
@public_handler
@app.route('/react', defaults={'path': 'manifest.json'})
@app.route('/react/<path:path>')
def react(path):
    manifestJson = json.load(open(app.root_path + reactBuildPath + '/' + path))
    return public_main.react(manifestJson['main.js'])


# React static resource loading
@public_handler
@app.route('/react/build', defaults={'path': ''})
@app.route('/react/build/<path:path>')
def build(path):
    return send_from_directory(app.root_path + reactBuildPath, path)


# PUBLIC URLS
app.add_url_rule(rule="/", endpoint="public.main.index", view_func=public_main.index, methods=["GET"])

# PUBLIC auth
app.add_url_rule(rule="/init", endpoint="public.auth.init", view_func=auth.init, methods=["GET", "POST"])
app.add_url_rule(rule="/register", endpoint="public.auth.register", view_func=auth.register, methods=["GET", "POST"])

app.add_url_rule(rule="/login", endpoint="public.auth.login", view_func=auth.login_magic_link_send,
                 methods=["GET", "POST"])
app.add_url_rule(rule="/magic-login-token/<token>", view_func=auth.login_magic_link_validate, methods=["GET"])

app.add_url_rule(rule="/login-password", endpoint="public.auth.login_password", view_func=auth.login_via_password,
                 methods=["GET", "POST"])

app.add_url_rule(rule="/password-reset-enter-email", endpoint="public.auth.reset_password_enter_email",
                 view_func=auth.reset_password_enter_email, methods=["GET", "POST"])
app.add_url_rule(rule="/password-reset-token/<token>", endpoint="public.auth.reset_password_enter_password",
                 view_func=auth.reset_password_enter_password, methods=["GET", "POST"])

app.add_url_rule(rule="/change-email-token/<token>", view_func=auth.change_email_link_validate, methods=["GET"])

# PROFILE URLS
app.add_url_rule(rule="/profile", endpoint="profile.main.my_details", view_func=profile_main.my_details,
                 methods=["GET"])
app.add_url_rule(rule="/profile/edit", endpoint="profile.main.edit_profile_get",
                 view_func=profile_main.edit_profile_get, methods=["GET"])
app.add_url_rule(rule="/profile/edit", endpoint="profile.main.edit_profile_post",
                 view_func=profile_main.edit_profile_post, methods=["POST"])
app.add_url_rule(rule="/profile/change-email", endpoint="profile.main.change_email_get",
                 view_func=profile_main.change_email_get, methods=["GET"])
app.add_url_rule(rule="/profile/change-email", endpoint="profile.main.change_email_post",
                 view_func=profile_main.change_email_post, methods=["POST"])

# PROFILE sessions
app.add_url_rule(rule="/profile/sessions", endpoint="profile.sessions.sessions_list",
                 view_func=handlers.profile.sessions.sessions_list, methods=["GET"])
app.add_url_rule(rule="/profile/session/delete", endpoint="profile.sessions.session_delete",
                 view_func=handlers.profile.sessions.session_delete, methods=["POST"])

# PROFILE auth
app.add_url_rule(rule="/logout", endpoint="profile.auth.logout", view_func=logout, methods=["POST"])

# ADMIN URLS

# user
app.add_url_rule(rule="/admin/user/<user_id>/delete-toggle", endpoint="admin.users.user_delete_toggle",
                 view_func=users.user_delete_toggle, methods=["POST"])
app.add_url_rule(rule="/admin/user/<user_id>", endpoint="admin.users.user_details", view_func=users.user_details,
                 methods=["GET"])
app.add_url_rule(rule="/admin/user/<user_id>/edit", endpoint="admin.users.user_edit_get", view_func=users.user_edit_get,
                 methods=["GET"])
app.add_url_rule(rule="/admin/user/<user_id>/edit", endpoint="admin.users.user_edit_post",
                 view_func=users.user_edit_post, methods=["POST"])
app.add_url_rule(rule="/admin/user/<user_id>/suspend-toggle", endpoint="admin.users.user_suspend_toggle",
                 view_func=users.user_suspend_toggle, methods=["POST"])

# users
app.add_url_rule(rule="/admin/users", endpoint="admin.users.users_list", view_func=users.users_list,
                 methods=["GET"])
app.add_url_rule(rule="/admin/users/deleted", endpoint="admin.users.users_list_deleted",
                 view_func=users.users_list_deleted, methods=["GET"])
app.add_url_rule(rule="/admin/users/suspended", endpoint="admin.users.users_list_suspended",
                 view_func=users.users_list_suspended, methods=["GET"])

# CRON JOBS
app.add_url_rule(rule="/cron/remove-deleted-users", view_func=remove_deleted_users_cron, methods=["GET"])

# TASKS
app.add_url_rule(rule="/tasks/send-email", endpoint="tasks.send_email_task.send_email_via_sendgrid",
                 view_func=send_email_via_sendgrid, methods=["POST"])

# LOAD FAKE DATA (localhost only!)
if is_local():
    app.add_url_rule(rule="/load-fake-data", view_func=load_fake_data, methods=["GET"])

if __name__ == '__main__':
    if is_local():
        app.run(port=8080, host="localhost", debug=True)  # localhost
    else:
        app.run(debug=False)  # production

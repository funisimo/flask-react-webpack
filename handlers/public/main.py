from utils.decorators import public_handler, react_handler
from utils.translations import render_template_with_translations


@public_handler
def index(**params):
    return render_template_with_translations("public/main/index.html", **params)


@react_handler
def react(params):
    return render_template_with_translations("public/react/index.html", **params)

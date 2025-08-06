from flask import Flask, jsonify, request, send_from_directory
import requests
from recipe import recipe_bp
from login import login_bp
from cart import cart_bp
from database import get_db, User  # User modelini sadece database.py'den al
import os

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db = get_db()
    db.init_app(app)  # MUTLAKA GEREKLİ

    with app.app_context():
        db.create_all()

    app.register_blueprint(recipe_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(cart_bp)
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def get_db():
    return db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    first_name = db.Column(db.String(80), nullable=False)

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    price = db.Column(db.Float, nullable=False)
    brand = db.Column(db.String(80), nullable=False)
    quantity = db.Column(db.String(20), nullable=True)

class Cart(db.Model):
    __tablename__ = 'carts'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    name = db.Column(db.String(120), nullable=False)
    quantity = db.Column(db.String(20), nullable=False)
    price = db.Column(db.Float, nullable=False)
    brand = db.Column(db.String(80), nullable=False)
    
    user = db.relationship('User', backref=db.backref('carts', lazy=True))
from flask import Blueprint, jsonify, request
from database import db, Cart, User, Product

cart_bp = Blueprint('cart', __name__)

@cart_bp.route('/api/cart', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    user_id = data.get('user_id')
    items = data.get('items')  # Liste içinde {product_id, quantity} objeleri

    if user_id is None or not items:
        return jsonify({'success': False, 'message': 'Kullanıcı ID ve ürün listesi gerekli!'}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({'success': False, 'message': 'Kullanıcı bulunamadı!'}), 404

    added_products = []
    not_found_products = []

    for item in items:
        product_id = item.get('product_id')
        quantity = item.get('quantity')

        if product_id is None or quantity is None:
            continue  # eksik veri varsa atla

        product = Product.query.get(product_id)
        if not product:
            not_found_products.append(product_id)
            continue

        # Ürün zaten sepetteyse miktarı artır
        existing_item = Cart.query.filter_by(user_id=user.id, product_id=product.id).first()
        if existing_item:
            existing_item.quantity += quantity
        else:
            cart_item = Cart(user_id=user.id, product_id=product.id, quantity=quantity)
            db.session.add(cart_item)

        added_products.append({'product_name': product.name, 'quantity': quantity})

    db.session.commit()

    return jsonify({
        'success': True,
        'added_products': added_products,
        'not_found_products': not_found_products,
        'message': f'{len(added_products)} ürün sepete eklendi.'
    }), 201

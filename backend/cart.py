from flask import Blueprint, jsonify, request
from database import db, Cart, User

cart_bp = Blueprint('cart', __name__)

# 1. POST /cart/add-items - Sepete ürün(ler) ekle
@cart_bp.route('/api/cart/add-items', methods=['POST'])
def add_items_to_cart():
    data = request.get_json()
    user_id = data.get('user_id')
    items = data.get('items', [])

    if not user_id or not items:
        return jsonify({'error': 'user_id ve items zorunludur'}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Kullanıcı bulunamadı'}), 404

    for item in items:
        cart_item = Cart(
            user_id=user_id,
            name=item.get('name'),
            price=item.get('cost'),
            brand=item.get('brand'),
            quantity=item.get('quantity')
        )
        db.session.add(cart_item)

    db.session.commit()
    return jsonify({'message': f'{len(items)} ürün sepete eklendi'}), 201


# 2. GET /cart/<user_id> - Sepeti getir
@cart_bp.route('/api/cart/<int:user_id>', methods=['GET'])
def get_cart_by_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Kullanıcı bulunamadı'}), 404

    cart_items = Cart.query.filter_by(user_id=user_id).all()
    items = []
    for item in cart_items:
        items.append({
            'id': item.id,
            'name': item.name,
            'cost': item.price,
            'brand': item.brand,
            'quantity': item.quantity
        })

    return jsonify({'data': items, 'success': True}), 200


# 3. DELETE /cart/<user_id> - Sepeti temizle
@cart_bp.route('/api/cart/<int:user_id>', methods=['DELETE'])
def clear_cart(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Kullanıcı bulunamadı'}), 404

    deleted = Cart.query.filter_by(user_id=user_id).delete()
    db.session.commit()

    return jsonify({'message': f'{deleted} ürün sepetten silindi'}), 200
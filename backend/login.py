from flask import Blueprint, jsonify, request
from database import db, User

login_bp = Blueprint('login', __name__)

@login_bp.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    
    user_list = []
    for user in users:
        user_list.append({
            "id": user.id,
            "name": user.first_name,
            "email": user.email,
            "password": user.password
        })

    return jsonify({'success': True, 'users': user_list}), 200

@login_bp.route('/api/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')
    print(f'Email: {email} password {password}')
    user = User.query.filter_by(email=email, password=password).first()

    if not user:
        print("Kullanıcı Bulunamadı")
        return jsonify({'success': False , 'message': f'Kullanıcı Bulunamadı'}), 400
    
    else:
        print(f'Hoşgeldin {user.first_name}')
        return jsonify({'success': True, 'message': f'Hoşgeldin {user.first_name}', 'data': {'name': user.first_name}}), 200
    
@login_bp.route('/api/register', methods=['POST'])
def register():
    email = request.json.get('email')
    password = request.json.get('password')
    name = request.json.get('name')

    # Kullanıcı daha önce kayıt olmuş mu?
    if User.query.filter_by(email=email).first():
        print("Bu e-posta zaten kayıtlı")
        return jsonify({'success': False, 'message': 'Bu e-posta zaten kayıtlı'}), 400

    # Yeni kullanıcıyı oluştur
    new_user = User(email=email, password=password, first_name=name)
    db.session.add(new_user)
    db.session.commit()
    print(f'Kayıt başarılı. Hoşgeldin {name}')
    return jsonify({'success': True, 'message': f'Kayıt başarılı. Hoşgeldin {name}', 'data': {'name': name}}), 201
# recipe.py

from config import API_KEY, MODEL_NAME
from flask import Blueprint, jsonify, request
from database import db, Product
from handlers import RequestHandler
from services import GeminiService
from parser import ResponseParser

recipe_bp = Blueprint('recipe', __name__)

# Handler'ı Blueprint seviyesinde oluştur (gerekirse global olarak taşıyabilirsin)
gemini_service = GeminiService(API_KEY, MODEL_NAME)
response_parser = ResponseParser()
handler = RequestHandler(gemini_service, response_parser)

@recipe_bp.route('/api/recipe', methods=['POST'])
def get_recipe():
    category = request.json.get('category')
    text = request.json.get('text')
    json_input = {
        'category': category,
        'text': text
    }
    
    import json
    json_input_str = json.dumps(json_input)

    response = handler.process_request_to_json(json_input_str)

    return jsonify({'success': True, 'data': response}), 200
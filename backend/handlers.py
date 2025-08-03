# handlers.py

import json
from services import GeminiService
from parser import ResponseParser
from typing import Dict, Optional
import pandas as pd

class RequestHandler:
    """Gelen istekleri işler, servisleri ve ayrıştırıcıları koordine eder."""
    
    def __init__(self, gemini_service: GeminiService, response_parser: ResponseParser):
        """
        Gerekli servis ve ayrıştırıcılarla handler'ı başlatır.
        
        Args:
            gemini_service (GeminiService): LLM ile iletişim kuracak servis.
            response_parser (ResponseParser): Yanıtları ayrıştıracak olan ayrıştırıcı.
        """
        self.service = gemini_service
        self.parser = response_parser

    def process_request_to_json(self, json_input: str) -> dict:  # str yerine dict döndür
        """
        JSON formatındaki bir isteği işler ve sonucu Python dict olarak döndürür.
        """
        try:
            data = json.loads(json_input)
            category = data.get("category")
            text_content = data.get("text")

            if not category or not text_content:
                return {
                    "success": False,
                    "message": "JSON içinde 'category' ve 'text' alanları zorunludur.",
                    "data": None
                }

            # 1. Servis aracılığıyla LLM'den yanıt al
            raw_response = self.service.generate_list(category, text_content)
            print(raw_response)
            # 2. Yanıtı ayrıştırıcı ile DataFrame'lere dönüştür
            dataframes = self.parser.parse_to_dataframes(raw_response)
            video_ids = self.parser.video_id_from_url(raw_response)
            
            # 3. Sonucu formatla
            category_id_map = {
                "ucuz": 1,
                "orta": 2,
                "pahali": 3
            }

            recipes = []

            for cat_name, df in dataframes.items():
                recipes.append({
                    "id": category_id_map.get(cat_name, 0),
                    "ingredients": convert_ingredients(df)
                })

            return {

                    "recipes": recipes, 
                    "video_id": video_ids
            }

        except json.JSONDecodeError:
            return {
                "success": False,
                "message": "Geçersiz JSON formatı.",
                "data": None
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Beklenmedik bir hata oluştu: {str(e)}",
                "data": None
            } 
        # YENİ METOT: Mobil uygulama için eklendi
        def get_raw_list_by_category(self, category: str, text: str) -> str:
            """
            Mobil uygulama gibi doğrudan argüman alan senaryolar için,
            sadece ham metin listesini ("tarifi") döndürür.

            Args:
                category (str): İstek kategorisi (örn: "kırtasiye", "tarif").
                text (str): İsteğin detayı (örn: "10. sınıf", "menemen").

            Returns:
                str: Model tarafından üretilen formatlanmış ham metin listesi veya hata mesajı.
            """
            try:
                if not category or not text:
                    return "Hata: 'category' ve 'text' alanları boş olamaz."

                # Servis aracılığıyla LLM'den ham metin yanıtını al
                raw_response = self.service.generate_list(category, text)
                return raw_response

            except Exception as e:
                # Hata durumunda, hatayı string olarak döndür
                return f"Liste oluşturulurken bir hata oluştu: {str(e)}"
            
def convert_ingredients(df):
        return [
            {
                "name": row.get("Ürün", ""),
                "brand": row.get("Marka", ""),
                "cost": float(row.get("Fiyat", "0")),
                "quantity": row.get("Adet", "")
            }
            for _, row in df.iterrows()
        ]
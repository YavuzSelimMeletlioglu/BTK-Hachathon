# services.py

import google.generativeai as genai
from config import PROMPTS

class GeminiService:
    """Google Gemini API ile iletişimi yönetir."""
    def __init__(self, api_key: str, model_name: str):
        """
        Servisi başlatır ve modeli yapılandırır.
        
        Args:
            api_key (str): Google API anahtarı.
            model_name (str): Kullanılacak modelin adı.
        """
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(model_name=model_name)

    def generate_list(self, category: str, text: str) -> str:
        """
        Belirtilen kategori ve metne göre bir prompt oluşturur ve LLM'den yanıt alır.
        
        Args:
            category (str): İstek kategorisi (örn: "kırtasiye", "tarif").
            text (str): İsteğin detayı (örn: "10. sınıf", "menemen").
            
        Returns:
            str: Model tarafından üretilen ham metin çıktısı.
            
        Raises:
            ValueError: Eğer kategori `config.PROMPTS` içinde bulunamazsa.
        """
        prompt_template = PROMPTS.get(category)
        if not prompt_template:
            raise ValueError(f"Geçersiz kategori: '{category}'. 'config.py' dosyasına eklenmeli.")
        
        prompt = prompt_template.format(text=text)
        response = self.model.generate_content(prompt)
        return response.text
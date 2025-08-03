# config.py

# BURAYA KENDİ GOOGLE API ANAHTARINIZI GİRİN
API_KEY = "AIzaSyCUvO6h9XHCB6hxHWpaQv4VWVYOQB-mxxk" 
MODEL_NAME = "gemini-2.5-flash"

# Yeni kategoriler eklemek için bu sözlüğe ekleme yapmanız yeterlidir.
PROMPTS = {
    "tarif": """
{text} tarifi için gerekli malzemeleri 3 farklı fiyat kategorisinde listele. Bir Youtube videosu url'si ver

SADECE aşağıdaki formatı kullan, başka hiçbir şey yazma. Adet alanına ürünlerin birimleri ile birlikte yaz (1kg, 10adet, 1lt gibi).:

UCUZ:
Ürün,Marka,Fiyat,Adet
[ürün listesi]

ORTA:
Ürün,Marka,Fiyat,Adet
[ürün listesi]

PAHALI:
Ürün,Marka,Fiyat,Adet
[ürün listesi]

Her kategori için en az 3 ürün ver. Fiyatları TL olarak yaz.
""",
    "kırtasiye": """
{text} kırtasiye için gerekli malzemeleri 3 farklı fiyat kategorisinde listele.

SADECE aşağıdaki formatı kullan, başka hiçbir şey yazma:

UCUZ:
Ürün,Marka,Fiyat
[ürün listesi]

ORTA:
Ürün,Marka,Fiyat
[ürün listesi]

PAHALI:
Ürün,Marka,Fiyat
[ürün listesi]

Her kategori için en az 3 ürün ver. Fiyatları TL olarak yaz.
""",
    "video": """
{text} 
"""
}
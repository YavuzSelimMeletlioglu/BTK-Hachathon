# parsers.py

import pandas as pd
import io
import re
from typing import Dict

class ResponseParser:
    """
    LLM'den gelen metin tabanlı yanıtları Pandas DataFrame'lerine ayrıştırır.
    """
    @staticmethod
    def parse_to_dataframes(response_text: str) -> Dict[str, pd.DataFrame]:
        """
        Ham metni 'UCUZ', 'ORTA', 'PAHALI' kategorilerine göre ayrıştırır.
        
        Args:
            response_text (str): LLM'den gelen ham metin yanıtı.
            
        Returns:
            Dict[str, pd.DataFrame]: Her kategori için bir DataFrame içeren sözlük.
        """
        categories = ["UCUZ", "ORTA", "PAHALI"]
        dataframes = {}
        
        for cat in categories:
            try:
                start_marker = f"{cat}:"
                start_index = response_text.find(start_marker)
                
                if start_index == -1:
                    dataframes[cat.lower()] = pd.DataFrame()
                    continue

                # Başlangıçtan sonraki metni al
                text_after_start = response_text[start_index + len(start_marker):].strip()
                
                # Bir sonraki kategorinin başlangıcını bularak bitiş noktasını belirle
                end_index = len(text_after_start)
                for next_cat_marker in categories:
                    if next_cat_marker == cat:
                        continue
                    next_cat_pos = text_after_start.find(f"{next_cat_marker}:")
                    if next_cat_pos != -1 and next_cat_pos < end_index:
                        end_index = next_cat_pos
                
                category_text = text_after_start[:end_index].strip()
                
                # *** SADECE BU SATIRLAR EKLENDİ ***
                # YouTube URL'lerini içeren satırları temizle
                lines = category_text.split('\n')
                cleaned_lines = []
                for line in lines:
                    if not ('youtube.com' in line or 'youtu.be' in line or line.startswith('http')):
                        cleaned_lines.append(line)
                category_text = '\n'.join(cleaned_lines)
                # *** EK BÖLÜM SONU ***
                
                # Metni DataFrame'e dönüştür
                if category_text:
                    df = pd.read_csv(io.StringIO(category_text))
                    df.reset_index(drop=True, inplace=True)
                    
                    # *** SADECE BU SATIRLAR EKLENDİ ***
                    # NaN değerleri olan satırları temizle
                    df = df.dropna(how='all')  # Tüm değerleri NaN olan satırları sil
                    # *** EK BÖLÜM SONU ***
                    
                    dataframes[cat.lower()] = df
                else:
                    dataframes[cat.lower()] = pd.DataFrame()

            except Exception as e:
                print(f"'{cat}' kategorisi ayrıştırılırken hata: {e}")
                dataframes[cat.lower()] = pd.DataFrame()
                
        return dataframes
    
    def video_id_from_url(self, response_text: str) -> str:
        """
        Response metninden YouTube video ID'sini çıkarır.
        
        Args:
            response_text (str): LLM'den gelen tam response metni.
            
        Returns:
            str: Video ID'si.
        """
        try:
            # *** SADECE BU METHOD DEĞİŞTİ ***
            # YouTube URL'sini bul ve video ID'sini çıkar
            match = re.search(r'https?://(?:www\.)?youtube\.com/watch\?v=([\w-]+)', response_text)
            if match:
                return match.group(1)
            
            match = re.search(r'https?://youtu\.be/([\w-]+)', response_text)
            if match:
                return match.group(1)
            
            return "3wo7qr6PIU4"  # Default
            # *** EK BÖLÜM SONU ***
            
        except Exception as e:
            print(f"Video ID çıkarılırken hata: {e}")
            return "3wo7qr6PIU4"
import re
from typing import Optional, Tuple

class Normalizer:
    @staticmethod
    def normalize_price(price_text: str) -> Tuple[Optional[float], Optional[str]]:
        if not price_text:
            return None, None
        
        text = price_text.upper().replace('.', '').replace(',', '')
        numbers = re.findall(r'\d+', text)
        if not numbers:
            return None, None
            
        value = float(numbers[0])
        currency = "CLP"
        if "UF" in text:
            currency = "UF"
        elif "USD" in text or "$" in text and "UF" not in text:
            currency = "CLP" # Default assuming CLP / Chile focus
            
        return value, currency

    @staticmethod
    def normalize_m2(m2_text: str) -> Optional[float]:
        if not m2_text:
            return None
        text = m2_text.replace(',', '.')
        numbers = re.findall(r'\d+\.?\d*', text)
        if numbers:
            return float(numbers[0])
        return None

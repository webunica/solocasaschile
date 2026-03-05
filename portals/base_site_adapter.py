from abc import ABC, abstractmethod
from typing import List, Optional
from schemas.company import CompanySchema
from schemas.model import ModelSchema
import requests
from bs4 import BeautifulSoup
from core.logger import get_logger

logger = get_logger(__name__)

class BaseSiteAdapter(ABC):
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": "Mozilla/5.0"})

    def get_soup(self, url: str) -> Optional[BeautifulSoup]:
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            return BeautifulSoup(response.text, 'html.parser')
        except Exception as e:
            logger.error(f"Error fetching {url}: {e}")
            return None

    @abstractmethod
    def discover_model_urls(self) -> List[str]:
        pass

    @abstractmethod
    def parse_company_info(self) -> CompanySchema:
        pass

    @abstractmethod
    def parse_model_page(self, url: str) -> Optional[ModelSchema]:
        pass
        
    def scrape(self):
        logger.info(f"Iniciando scraping para {self.base_url}")
        company = self.parse_company_info()
        models = []
        model_urls = self.discover_model_urls()
        
        for m_url in model_urls:
            model = self.parse_model_page(m_url)
            if model:
                models.append(model)
                
        return company, models

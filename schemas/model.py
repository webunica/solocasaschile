from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ModelSchema(BaseModel):
    id: Optional[int] = None
    company_name: str
    model_name: str
    model_code: Optional[str] = None
    model_url: str
    category: Optional[str] = None
    style: Optional[str] = None
    surface_m2: Optional[float] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    floors: Optional[int] = None
    structure_material: Optional[str] = None
    delivery_modes: List[str] = Field(default_factory=list)
    price_from: Optional[float] = None
    price_to: Optional[float] = None
    currency: Optional[str] = None
    original_price_text: Optional[str] = None
    includes_transport: Optional[bool] = None
    includes_assembly: Optional[bool] = None
    estimated_total_time: Optional[str] = None
    description: Optional[str] = None
    image_urls: List[str] = Field(default_factory=list)
    pdf_ficha_url: Optional[str] = None
    scrape_date: datetime = Field(default_factory=datetime.now)
    fingerprint_hash: Optional[str] = None

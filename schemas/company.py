from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class CompanySchema(BaseModel):
    id: Optional[int] = None
    name: str = Field(..., description="Nombre de la empresa")
    domain: str = Field(..., description="Dominio principal normalizado")
    website: str
    company_type: Optional[str] = None
    specialty: Optional[str] = None
    description: Optional[str] = None
    base_city: Optional[str] = None
    base_region: Optional[str] = None
    geographic_coverage: List[str] = Field(default_factory=list)
    public_phone: Optional[str] = None
    public_whatsapp: Optional[str] = None
    public_email: Optional[str] = None
    social_networks: List[str] = Field(default_factory=list)
    services: List[str] = Field(default_factory=list)
    scrape_date: datetime = Field(default_factory=datetime.now)
    source_url: str

class CompanyComparisonSchema(BaseModel):
    name: str
    company_type: str
    specialty: str
    coverage: str
    models_detected: int
    price_range: str
    delivery_types: str
    contact: str
    completeness_score: float

from pydantic import BaseModel, EmailStr, Field, ConfigDict, constr
from datetime import datetime as dt

# https://docs.pydantic.dev/latest/concepts/models
class Commission(BaseModel):
    # model_config = ConfigDict(extra='forbid')
    # id: str  - this is handled elsewhere
    date: str = dt.now().date().strftime('%m/%d/%Y')
    user_id: str | None = Field(default=None, alias='userId')
    first_name: str = Field(alias='firstName')
    last_name: str = Field(alias='lastName')
    email: EmailStr = constr(to_lower=True)
    commission_type: str = Field(alias='commissionType')
    piece_vision: str = Field(alias='pieceVision')
    symmetry_type: str = Field(alias='symmetryType')
    base_material: str = Field(alias='baseMaterial')
    creative_control: str = Field(alias='creativeControl')
    colors: str
    fabrics: str
    shape_patterns: str = Field(alias='shapePatterns')
    distress: str
    retailor: str
    pockets: str
    weekly_checks: str = Field(alias='weeklyChecks')
    extra: str
    
class User(BaseModel):
    big: str
    
    
class Product(BaseModel):
    big: str
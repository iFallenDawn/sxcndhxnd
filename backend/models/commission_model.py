from pydantic import BaseModel, EmailStr
import datetime

class Commission(BaseModel):
    id: str = None
    date: datetime.date = datetime.now()
    user_id: str = None
    first_name: str 
    last_name: str
    email: EmailStr
    commission_type: str
    piece_vision: str
    symmetry_type: str
    base_material: str
    creative_control: str
    colors: str
    fabrics: str
    shape_patterns: str
    distress: str
    retailor: str
    pockets: str
    weekly_checks: str
    extra: str
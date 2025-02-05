from pydantic import BaseModel, EmailStr, Field, ConfigDict, constr, BeforeValidator
from datetime import datetime as dt
from typing_extensions import Annotated

# https://docs.pydantic.dev/latest/api/config/
config_dict = ConfigDict(str_strip_whitespace=True)

# https://docs.pydantic.dev/latest/concepts/validators/#field-validators
def email_to_lower(email: object) -> str:
    return str(email).strip().lower()

# https://docs.pydantic.dev/latest/concepts/models
# note, these will be stored in database as written below, like first_name instead of firstName
# aliases so life is easier when we make reqBody in frontend
class CommissionIn(BaseModel):
    model_config = config_dict
    # id: str - this is handled in CommissionOut
    date: str = dt.now().date().strftime('%m/%d/%Y')
    user_id: str | None = Field(default=None, alias='userId')
    first_name: str = Field(alias='firstName')
    last_name: str = Field(alias='lastName')
    email: Annotated[EmailStr, BeforeValidator(email_to_lower)]
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
    

class CommissionOut(BaseModel):
    model_config = config_dict
    id: str
    date: str 
    user_id: str | None = Field(default=None, alias='userId')
    first_name: str
    last_name: str
    email: Annotated[EmailStr, BeforeValidator(email_to_lower)]
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
    
class User(BaseModel):
    model_config = config_dict
    # id: str  - this is handled elsewhere
    first_name: str = Field(alias='firstName')
    last_name: str = Field(alias='lastName')
    password: str
    email: Annotated[EmailStr, BeforeValidator(email_to_lower)]
    instagram: str
    commissionIds: list[str] | None
    productIds: list[str] | None
    
class Product(BaseModel):
    model_config = config_dict
    big: str
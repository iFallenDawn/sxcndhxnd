from __future__ import annotations
from decimal import Decimal
from pydantic import BaseModel, Field, UUID4, EmailStr, SecretStr, field_validator
from pydantic.types import StringConstraints
from sqlalchemy.dialects.postgresql import ARRAY
from typing import Literal
from uuid import uuid4
import datetime

ProductStatus = Literal['sold', 'reserved', 'archive', 'available', 'display']

# CUSTOM CLASSES
# Note: These are custom model classes for defining common features among
# Pydantic Base Schema.

# Classes have been modified and added since the autogeneration


class CustomModel(BaseModel):
	"""Base model class with common features."""
	pass


class CustomModelInsert(CustomModel):
	"""Base model for insert operations with common features."""
	pass


class CustomModelUpdate(CustomModel):
	"""Base model for update operations with common features."""
	pass


# BASE CLASSES
# Note: These are the base Row models that include all fields.


class CommissionsBaseSchema(CustomModel):
	"""Commissions Base Schema."""

	# Primary Keys
	id: UUID4

	# Columns
	base_material: bool
	colors: str
	commission_type: str
	created_at: datetime.datetime
	creative_control: bool
	distress: bool
	email: EmailStr
	extra: str | None = Field(default=None)
	fabrics: str
	first_name: str
	last_name: str
	piece_vision: str
	pockets: bool
	product_id: UUID4 | None = Field(default=None)
	retailor: bool
	shape_patterns: str
	symmetry_type: str
	updated_at: datetime.datetime
	updated_by: UUID4 | None = Field(default=None)
	user_id: UUID4 | None = Field(default=None)
	weekly_checkins: bool


class ProductsBaseSchema(CustomModel):
	"""Products Base Schema."""

	# Primary Keys
	id: UUID4

	# Columns
	category: str | None = Field(default=None)
	commission_id: str | None = Field(default=None)
	created_at: datetime.datetime
	created_by: UUID4 | None = Field(default=None)
	description: str
	drop_item: bool | None = Field(default=None)
	drop_title: str | None = Field(default=None)
	image_urls: list[str]
	paid: bool | None = Field(default=None)
	price: Decimal
	size: str | None = Field(default=None)
	status: str
	title: str
	updated_at: datetime.datetime
	updated_by: UUID4 | None = Field(default=None)
	user_id: str | None = Field(default=None)


class UsersBaseSchema(CustomModel):
	"""Users Base Schema."""

	# Primary Keys
	id: UUID4

	# Columns
	created_at: datetime.datetime
	email: EmailStr
	first_name: str
	instagram: str = Field(description="instagram handle")
	last_name: str
	updated_at: datetime.datetime


class UsersRolesBaseSchema(CustomModel):
	"""UsersRoles Base Schema."""

	# Primary Keys
	id: UUID4

	# Columns
	role: str
# INSERT CLASSES
# Note: These models are used for insert operations. Auto-generated fields
# (like IDs and timestamps) are optional.


class CommissionsInsert(CustomModelInsert):
	"""Commissions Insert Schema."""

	# Primary Keys
	id: UUID4 = Field(default_factory=uuid4)

	# Field properties:
	# extra: nullable
	# product_id: nullable
	# user_id: nullable, has default value
	
	# Required fields
	base_material: bool
	colors: str
	commission_type: str
	created_at: datetime.datetime
	creative_control: bool
	distress: bool
	email: EmailStr
	fabrics: str
	first_name: str
	last_name: str
	piece_vision: str
	pockets: bool
	retailor: bool
	shape_patterns: str
	symmetry_type: str
	updated_at: datetime.datetime
	weekly_checkins: bool
	
		# Optional fields
	extra: str | None = Field(default=None)
	product_id: UUID4 | None = Field(default=None)
	user_id: UUID4 | None = Field(default=None)
	updated_by: UUID4 | None = Field(default=None)


class ProductsInsert(CustomModelInsert):
	"""Products Insert Schema."""

	# Primary Keys
	id: UUID4 = Field(default_factory=uuid4)

	# Field properties:
	# category: nullable
	# commission_id: nullable
	# created_at: has default value
	# created_by: nullable
	# drop_item: nullable
	# drop_title: nullable
	# paid: nullable
	# size: nullable
	# updated_at: has default value
	# updated_by: nullable
	# user_id: nullable
	
	# Required fields
	description: str
	image_urls: list[str]
	price: Decimal
	title: str
	
	# Optional fields
	category: str | None = Field(default=None)
	commission_id: str | None = Field(default=None)
	created_at: datetime.datetime | None = Field(default=None)
	created_by: UUID4 | None = Field(default=None)
	drop_item: bool | None = Field(default=None)
	drop_title: str | None = Field(default=None)
	paid: bool | None = Field(default=None)
	size: str | None = Field(default=None)
	status: ProductStatus | None = Field(default=None)
	updated_at: datetime.datetime | None = Field(default=None)
	updated_by: UUID4 | None = Field(default=None)
	user_id: str | None = Field(default=None)


class UsersInsert(CustomModelInsert):
	"""Users Insert Schema."""

	# Primary Keys
	id: UUID4

	# Field properties:
	# created_at: has default value
	
	# Required fields
	email: EmailStr
	first_name: str
	instagram: str = Field(description="instagram handle")
	last_name: str
	
	# Optional fields
	updated_at: datetime.datetime | None = Field(default=None)
	created_at: datetime.datetime | None = Field(default=None)


class UsersRolesInsert(CustomModelInsert):
	"""UsersRoles Insert Schema."""

	# Primary Keys
	id: UUID4

# Required fields
	role: str
# UPDATE CLASSES
# Note: These models are used for update operations. All fields are optional.


class CommissionsUpdate(CustomModelUpdate):
	"""Commissions Update Schema."""

	# Primary Keys
	id: UUID4

	# Field properties:
	# extra: nullable
	# product_id: nullable
	# user_id: nullable, has default value
	
	# Optional fields
	base_material: bool | None = Field(default=None)
	colors: str | None = Field(default=None)
	commission_type: str | None = Field(default=None)
	creative_control: bool | None = Field(default=None)
	distress: bool | None = Field(default=None)
	email: EmailStr | None = Field(default=None)
	extra: str | None = Field(default=None)
	fabrics: str | None = Field(default=None)
	first_name: str | None = Field(default=None)
	last_name: str | None = Field(default=None)
	piece_vision: str | None = Field(default=None)
	pockets: bool | None = Field(default=None)
	product_id: UUID4 | None = Field(default=None)
	retailor: bool | None = Field(default=None)
	shape_patterns: str | None = Field(default=None)
	symmetry_type: str | None = Field(default=None)
	user_id: UUID4 | None = Field(default=None)
	weekly_checkins: bool | None = Field(default=None)


class ProductsUpdate(CustomModelUpdate):
	"""Products Update Schema."""

	# Primary Keys
	# id: UUID4 - comes from path parameter

	# Field properties:
	# category: nullable
	# commission_id: nullable
	# drop_item: nullable
	# drop_title: nullable
	# paid: nullable
	# size: nullable
	# user_id: nullable
	
	# Optional fields
	category: str | None = Field(default=None)
	commission_id: str | None = Field(default=None)
	description: str | None = Field(default=None)
	drop_item: bool | None = Field(default=None)
	drop_title: str | None = Field(default=None)
	image_urls: list[str] | None = Field(default=None)
	paid: bool | None = Field(default=None)
	price: Decimal | None = Field(default=None)
	size: str | None = Field(default=None)
	status: ProductStatus | None = Field(default=None)
	title: str | None = Field(default=None)
	user_id: str | None = Field(default=None)


class UsersRolesUpdate(CustomModelUpdate):
	"""UsersRoles Update Schema."""

	# Primary Keys
	id: UUID4 | None = Field(default=None)

	# Optional fields
	role: str | None = Field(default=None)


# OPERATIONAL CLASSES


class Commissions(CommissionsBaseSchema):
	"""Commissions Schema for Pydantic.

	Inherits from CommissionsBaseSchema. Add any customization here.
	"""

	# Foreign Keys
	product: Products | None = Field(default=None)
	user: Users | None = Field(default=None)


class Products(ProductsBaseSchema):
	"""Products Schema for Pydantic.

	Inherits from ProductsBaseSchema. Add any customization here.
	"""

	# Foreign Keys
	commissions: list[Commissions] | None = Field(default=None)


class Users(UsersBaseSchema):
	"""Users Schema for Pydantic.

	Inherits from UsersBaseSchema. Add any customization here.
	"""

	# Foreign Keys
	commissions: list[Commissions] | None = Field(default=None)


class UsersRoles(UsersRolesBaseSchema):
	"""UsersRoles Schema for Pydantic.

	Inherits from UsersRolesBaseSchema. Add any customization here.
	"""
	pass


# New classes
class AuthUpdateEmail(CustomModelUpdate):
    new_email: EmailStr
    refresh_token: str

class AuthRegister(CustomModelInsert):
    # Required fields
	email: EmailStr
	first_name: str
	instagram: str = Field(description="instagram handle")
	last_name: str
	password: SecretStr

class AuthSignIn(CustomModel):
    email: EmailStr
    password: SecretStr
    
class AuthSignOut(CustomModel):
    refresh_token: str

class AuthRefresh(CustomModel):
    refresh_token: str

class AuthConfirm(CustomModel):
    token_hash: str
    type: Literal["signup", "invite", "magiclink", "recovery", "email_change", "email"]

class AuthChangePassword(CustomModelUpdate):
    current_password: SecretStr
    new_password: SecretStr
    refresh_token: str
    
    @field_validator("new_password")
    @classmethod
    def validate_password_strength(cls, v: SecretStr) -> SecretStr:
        pw = v.get_secret_value()
        if len(pw) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v
    
class UsersUpdate(CustomModelUpdate):
	"""Users Update Schema."""

	# Field properties:
	# created_at: has default value
	
	# Optional fields
	first_name: str | None = Field(default=None)
	instagram: str | None = Field(default=None, description="instagram handle")
	last_name: str | None = Field(default=None)

class UsersPublicProfile(BaseModel):
    id: UUID4
    first_name: str
    last_name: str
    instagram: str
    
class GalleryImagesBaseSchema(CustomModel):
    id: UUID4
    image_url: str
    description: str | None = Field(default=None)
    created_by: UUID4 | None = Field(default=None)
    created_at: datetime.datetime
    
class GalleryImagesInsert(CustomModelInsert):
    id: UUID4 = Field(default_factory=uuid4)
    image_url: str
    description: str | None = Field(default=None)
    
class GalleryResponse(BaseModel):
    products: list[ProductsBaseSchema]
    gallery_images: list[GalleryImagesBaseSchema]
    
class ReserveProductRequest(BaseModel):
    instagram: str
    
class ReservationsBaseSchema(CustomModel):
    id: UUID4
    product_id: UUID4
    instagram: str
    created_at: datetime.datetime
    user_id: UUID4 | None = Field(default=None)
    
class ReservationsInsert(CustomModelInsert):
    id: UUID4 = Field(default_factory=uuid4)
    product_id: UUID4
    instagram: str
    
class ReservationsUpdate(CustomModelUpdate):
    instagram: str | None = Field(default=None)
    
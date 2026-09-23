from pydantic import UUID4
# base class for errors
class AppError(Exception):
    pass

class NotFoundError(AppError):
    def __init__(self, resource: str, id: str | UUID4):
        self.resource = resource
        self.id = id
        super().__init__(f"{resource} with id {id} not found")
        
class ConflictError(AppError):
    def __init__(self, message: str):
        self.message = message
        super().__init__(message)

class UnauthorizedError(AppError):
    def __init__(self, message: str = "Authentication required"):
        self.message = message
        super().__init__(message)

class ForbiddenError(AppError):
    def __init__(self, message: str = "You do not have sufficient permissions to perform this action"):
        self.message = message
        super().__init__(message)

class InvalidFileTypeError(AppError):
    def __init__(self, content_type: str | None):
        self.content_type = content_type
        super().__init__(f"Unsupported file type: {content_type}")

class FailedToDeleteFromBucketError(AppError):
    def __init__(self, id: str | UUID4, bucket: str):
        self.id = id
        self.bucket = bucket
        super().__init__(f"Failed to delete storage object with id {id} from bucket {bucket}")
        
class NoFieldsProvidedError(AppError):
    def __init__(self):
        super().__init__("No fields provided to update")
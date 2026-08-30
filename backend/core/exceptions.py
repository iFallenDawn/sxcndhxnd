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
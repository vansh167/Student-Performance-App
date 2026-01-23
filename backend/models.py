from pydantic import BaseModel, EmailStr

class SignupModel(BaseModel):
    name: str
    email: EmailStr
    password: str
    rePassword: str

class LoginModel(BaseModel):
    email: EmailStr
    password: str

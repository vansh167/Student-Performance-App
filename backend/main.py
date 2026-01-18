from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow react
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Student(BaseModel):
    name: str
    gender: str
    study_time: int
    previous_grade: int
    attendance: int
    sleep_hours: int
    family_support: str
    motivation: str
    extracurricular: str

def predict(student: Student):
    score = (
        student.study_time * 2 +
        student.previous_grade * 0.5 +
        student.attendance * 0.3 +
        student.sleep_hours * 1 +
        (5 if student.family_support == "Yes" else 0) +
        (10 if student.motivation == "High" else 5 if student.motivation == "Medium" else 0) +
        (5 if student.extracurricular == "Yes" else 0)
    )
    score = min(round(score, 2), 100)

    if score >= 85:
        category = "Excellent"
    elif score >= 70:
        category = "Good"
    elif score >= 50:
        category = "Average"
    else:
        category = "Poor"

    return score, category

@app.post("/predict")
def predict_student(student: Student):
    score, category = predict(student)
    return {"score": score, "category": category}

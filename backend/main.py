from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import students_collection
from bson import ObjectId


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
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


def predict_logic(data: Student):
    score = (
        data.study_time * 2 +
        data.previous_grade * 0.5 +
        data.attendance * 0.3 +
        data.sleep_hours * 1 +
        (5 if data.family_support == "Yes" else 0) +
        (10 if data.motivation == "High" else 5 if data.motivation == "Medium" else 0) +
        (5 if data.extracurricular == "Yes" else 0)
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
def predict(student: Student):
    score, category = predict_logic(student)
    return {"score": score, "category": category}


@app.post("/save")
def save_student(student: Student):
    score, category = predict_logic(student)

    record = student.dict()
    record["score"] = score
    record["category"] = category

    students_collection.insert_one(record)

    return {"message": "Student saved successfully!", "score": score, "category": category}


@app.get("/students")
def get_students():
    data = []
    for s in students_collection.find():
        s["_id"] = str(s["_id"])
        data.append(s)
    return data


@app.delete("/students/{student_id}")
def delete_student(student_id: str):
    res = students_collection.delete_one({"_id": ObjectId(student_id)})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "Student deleted successfully!"}


@app.put("/students/{student_id}")
def update_student(student_id: str, student: Student):
    score, category = predict_logic(student)

    record = student.dict()
    record["score"] = score
    record["category"] = category

    res = students_collection.update_one(
        {"_id": ObjectId(student_id)},
        {"$set": record}
    )

    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")

    return {"message": "Student updated successfully!", "score": score, "category": category}

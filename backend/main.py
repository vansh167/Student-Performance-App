from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from database import students_collection
from bson import ObjectId
from io import StringIO
import csv

app = FastAPI()

# ✅ FIXED CORS (LOCAL + RENDER FRONTEND)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://student-performance-frontend.onrender.com" 
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------- MODELS --------------------

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


# -------------------- LOGIC --------------------

def predict_logic(data: Student):
    score = (
        data.study_time * 2
        + data.previous_grade * 0.5
        + data.attendance * 0.3
        + data.sleep_hours * 1
        + (5 if data.family_support == "Yes" else 0)
        + (10 if data.motivation == "High" else 5 if data.motivation == "Medium" else 0)
        + (5 if data.extracurricular == "Yes" else 0)
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


def safe_object_id(student_id: str):
    try:
        return ObjectId(student_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid student id")


# -------------------- ROUTES --------------------

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

    return {
        "message": "Student saved successfully!",
        "score": score,
        "category": category
    }


@app.get("/students")
def get_students():
    data = []
    for s in students_collection.find():
        s["_id"] = str(s["_id"])
        data.append(s)
    return data


@app.get("/students/{student_id}")
def get_student(student_id: str):
    oid = safe_object_id(student_id)

    student = students_collection.find_one({"_id": oid})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    student["_id"] = str(student["_id"])
    return student


@app.delete("/students/{student_id}")
def delete_student(student_id: str):
    oid = safe_object_id(student_id)

    res = students_collection.delete_one({"_id": oid})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")

    return {"message": "Student deleted successfully!"}


@app.put("/students/{student_id}")
def update_student(student_id: str, student: Student):
    oid = safe_object_id(student_id)

    score, category = predict_logic(student)

    record = student.dict()
    record["score"] = score
    record["category"] = category

    res = students_collection.update_one({"_id": oid}, {"$set": record})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")

    return {
        "message": "Student updated successfully!",
        "score": score,
        "category": category
    }


@app.get("/recommendations/{student_id}")
def get_recommendations(student_id: str):
    oid = safe_object_id(student_id)

    student = students_collection.find_one({"_id": oid})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    attendance = int(student.get("attendance", 0))
    study_time = int(student.get("study_time", 0))
    sleep_hours = int(student.get("sleep_hours", 0))
    previous_grade = int(student.get("previous_grade", 0))
    motivation = str(student.get("motivation", "Medium"))

    weaknesses = []
    if attendance < 75: weaknesses.append("Low Attendance")
    if sleep_hours < 6: weaknesses.append("Poor Sleep")
    if study_time < 6: weaknesses.append("Low Study Time")
    if previous_grade < 60: weaknesses.append("Weak Academics")
    if motivation.lower() == "low": weaknesses.append("Low Motivation")

    if not weaknesses:
        weaknesses = ["No major weakness detected"]

    recommendations = []

    if attendance < 75:
        recommendations.append({
            "icon": "ShieldCheck",
            "title": "Improve Attendance",
            "desc": "Target 85%+ attendance. Regular attendance improves grades drastically.",
            "tag": "High Priority"
        })

    if sleep_hours < 6:
        recommendations.append({
            "icon": "MoonStar",
            "title": "Fix Sleep Routine",
            "desc": "Aim for 7–8 hours. Better sleep means better focus & memory.",
            "tag": "Health"
        })

    if study_time < 6:
        recommendations.append({
            "icon": "Clock3",
            "title": "Increase Study Time",
            "desc": "Minimum 8–10 hrs/week. Use Pomodoro 25/5 method.",
            "tag": "Productivity"
        })

    if previous_grade < 60:
        recommendations.append({
            "icon": "BookOpenCheck",
            "title": "Work on Basics",
            "desc": "Revise fundamentals & practice questions daily for confidence.",
            "tag": "Academics"
        })

    if motivation.lower() == "low":
        recommendations.append({
            "icon": "Sparkles",
            "title": "Build Motivation",
            "desc": "Set weekly targets & small rewards. Motivation boosts performance a lot.",
            "tag": "Mindset"
        })

    recommendations.append({
        "icon": "TrendingUp",
        "title": "Smart Action Plan",
        "desc": "Daily: 45 min revision + 30 min practice + 15 min notes + 10 min review.",
        "tag": "Recommended"
    })

    weekly_plan = [
        {"day": "Mon - Wed", "task": "Basics Revision + Practice Test"},
        {"day": "Thu - Fri", "task": "Weak Topics + Group Study"},
        {"day": "Sat", "task": "Mock Test + Analysis"},
        {"day": "Sun", "task": "Relax + Plan next week"},
    ]

    student["_id"] = str(student["_id"])

    return {
        "student": student,
        "weaknesses": weaknesses,
        "recommendations": recommendations,
        "weekly_plan": weekly_plan
    }


@app.get("/export/csv")
def export_csv():
    students = list(students_collection.find())

    output = StringIO()
    writer = csv.writer(output)

    writer.writerow([
        "Name", "Gender", "Score", "Category",
        "Attendance", "Study Time", "Sleep Hours", "Previous Grade",
        "Family Support", "Motivation", "Extracurricular"
    ])

    for s in students:
        writer.writerow([
            s.get("name"),
            s.get("gender"),
            s.get("score"),
            s.get("category"),
            s.get("attendance"),
            s.get("study_time"),
            s.get("sleep_hours"),
            s.get("previous_grade"),
            s.get("family_support"),
            s.get("motivation"),
            s.get("extracurricular")
        ])

    output.seek(0)

    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=students.csv"}
    )

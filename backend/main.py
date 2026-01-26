from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from bson import ObjectId
from io import StringIO
from collections import Counter, defaultdict
from datetime import datetime, timedelta
import csv
import bcrypt

from fastapi import UploadFile, File, Form
import os
import shutil
from database import resources_collection
from fastapi.staticfiles import StaticFiles



from jose import jwt, JWTError

from database import students_collection, users_collection
from models import SignupModel, LoginModel


# =========================
# CONFIG (DEPLOY SAFE)
# =========================
SECRET_KEY = os.getenv("SECRET_KEY", "YOUR_SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@gmail.com")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "12345")

app = FastAPI()
os.makedirs("uploads/resources", exist_ok=True)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "https://student-performance-app-4j75.onrender.com"
)


app = FastAPI()

# =========================
# CORS (DEPLOY SAFE)
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        FRONTEND_URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# MODELS
# =========================
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


# =========================
# HELPERS
# =========================
def safe_object_id(student_id: str):
    try:
        return ObjectId(student_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid student id")


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


def create_access_token(data: dict):
    payload = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload.update({"exp": expire})
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user_id(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token missing")

    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        user_id = payload.get("user_id")
        role = payload.get("role", "user")

        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        return {"user_id": user_id, "role": role}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


def admin_only(user=Depends(get_current_user_id)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


# =========================
# AUTH
# =========================
@app.post("/signup")
def signup(data: SignupModel):
    user = users_collection.find_one({"email": data.email})
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = bcrypt.hashpw(data.password.encode("utf-8"), bcrypt.gensalt())

    users_collection.insert_one({
        "name": data.name,
        "email": data.email,
        "password": hashed_pw.decode("utf-8"),
        "rePassword": data.rePassword  # ✅ learning
    })

    return {"message": "Signup successful"}


@app.post("/login")
def login(data: LoginModel):
    # ✅ Hardcoded Admin
    if data.email == ADMIN_EMAIL and data.password == ADMIN_PASSWORD:
        token = create_access_token({"user_id": "ADMIN", "role": "admin"})
        return {
            "message": "Admin login successful",
            "token": token,
            "user": {
                "id": "ADMIN",
                "name": "Admin",
                "email": ADMIN_EMAIL,
                "role": "admin"
            }
        }

    user = users_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not bcrypt.checkpw(data.password.encode("utf-8"), user["password"].encode("utf-8")):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"user_id": str(user["_id"]), "role": "user"})

    return {
        "message": "Login successful",
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "name": user.get("name"),
            "email": user.get("email"),
            "role": "user"
        }
    }


@app.get("/me")
def get_me(user=Depends(get_current_user_id)):
    user_id = user["user_id"]

    if user_id == "ADMIN":
        return {"id": "ADMIN", "name": "Admin", "email": ADMIN_EMAIL, "rePassword": ""}

    db_user = users_collection.find_one({"_id": ObjectId(user_id)}, {"password": 0})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": str(db_user["_id"]),
        "name": db_user.get("name"),
        "email": db_user.get("email"),
        "rePassword": db_user.get("rePassword", "")
    }


# =========================
# STUDENTS
# =========================
@app.post("/predict")
def predict(student: Student):
    score, category = predict_logic(student)
    return {"score": score, "category": category}


@app.post("/save")
def save_student(student: Student, user=Depends(get_current_user_id)):
    user_id = user["user_id"]   # ✅ FIX

    score, category = predict_logic(student)

    record = student.dict()
    record["score"] = score
    record["category"] = category
    record["user_id"] = user_id   # ✅ FIX
    record["created_at"] = datetime.utcnow()

    students_collection.insert_one(record)
    return {"message": "Saved", "score": score, "category": category}


@app.get("/students")
def get_students(user=Depends(get_current_user_id)):
    user_id = user["user_id"]   # ✅ FIX

    data = []
    for s in students_collection.find({"user_id": user_id}).sort("created_at", -1):
        s["_id"] = str(s["_id"])
        data.append(s)
    return data


@app.get("/students/{student_id}")
def get_student(student_id: str, user=Depends(get_current_user_id)):
    user_id = user["user_id"]   # ✅ FIX
    oid = safe_object_id(student_id)

    student = students_collection.find_one({"_id": oid, "user_id": user_id})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    student["_id"] = str(student["_id"])
    return student


@app.delete("/students/{student_id}")
def delete_student(student_id: str, user=Depends(get_current_user_id)):
    user_id = user["user_id"]   # ✅ FIX
    oid = safe_object_id(student_id)

    res = students_collection.delete_one({"_id": oid, "user_id": user_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")

    return {"message": "Deleted"}


@app.put("/students/{student_id}")
def update_student(student_id: str, student: Student, user=Depends(get_current_user_id)):
    user_id = user["user_id"]   # ✅ FIX
    oid = safe_object_id(student_id)

    score, category = predict_logic(student)

    record = student.dict()
    record["score"] = score
    record["category"] = category
    record["updated_at"] = datetime.utcnow()

    res = students_collection.update_one(
        {"_id": oid, "user_id": user_id},
        {"$set": record}
    )

    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")

    return {"message": "Updated", "score": score, "category": category}


# =========================
# RECOMMENDATIONS
# =========================
@app.get("/recommendations/{student_id}")
def get_recommendations(student_id: str, user=Depends(get_current_user_id)):
    user_id = user["user_id"]   # ✅ FIX
    oid = safe_object_id(student_id)

    student = students_collection.find_one({"_id": oid, "user_id": user_id})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    attendance = int(student.get("attendance", 0))
    study_time = int(student.get("study_time", 0))
    sleep_hours = int(student.get("sleep_hours", 0))
    previous_grade = int(student.get("previous_grade", 0))
    motivation = str(student.get("motivation", "Medium"))

    weaknesses = []
    if attendance < 75:
        weaknesses.append("Low Attendance")
    if sleep_hours < 6:
        weaknesses.append("Poor Sleep Routine")
    if study_time < 6:
        weaknesses.append("Low Study Time")
    if previous_grade < 60:
        weaknesses.append("Weak Academics")
    if motivation.lower() == "low":
        weaknesses.append("Low Motivation")

    if not weaknesses:
        weaknesses = ["No major weakness detected 🎉"]

    recommendations = []
    if attendance < 75:
        recommendations.append({"icon": "ShieldCheck", "title": "Boost Attendance",
                                "desc": "Aim for 85%+ and attend all important classes.", "tag": "High Priority"})

    if sleep_hours < 6:
        recommendations.append({"icon": "MoonStar", "title": "Improve Sleep Cycle",
                                "desc": "Try 7–8 hrs daily. Avoid mobile before sleeping.", "tag": "Health"})

    if study_time < 6:
        recommendations.append({"icon": "Clock3", "title": "Increase Study Hours",
                                "desc": "Study at least 8–10 hrs/week. Pomodoro method.", "tag": "Productivity"})

    if previous_grade < 60:
        recommendations.append({"icon": "BookOpenCheck", "title": "Strengthen Basics",
                                "desc": "Start fundamentals + daily practice.", "tag": "Academics"})

    if motivation.lower() == "low":
        recommendations.append({"icon": "Sparkles", "title": "Motivation Hack",
                                "desc": "Set daily goals + reward yourself.", "tag": "Mindset"})

    recommendations.append({"icon": "TrendingUp", "title": "Smart Daily Routine",
                            "desc": "45m revision + 30m practice + 10m test.", "tag": "Recommended"})

    weekly_plan = [
        {"day": "Mon", "task": "Basics Revision + 20 Practice Questions"},
        {"day": "Tue", "task": "Weak Topics + Notes"},
        {"day": "Wed", "task": "Mock Test + Analysis"},
        {"day": "Thu", "task": "Attendance Focus + Revision"},
        {"day": "Fri", "task": "Group Study + Doubts"},
        {"day": "Sat", "task": "Full Mock Test + Improve Mistakes"},
        {"day": "Sun", "task": "Relax + Plan next week goals"},
    ]

    student["_id"] = str(student["_id"])

    return {
        "student": student,
        "weaknesses": weaknesses,
        "recommendations": recommendations,
        "weekly_plan": weekly_plan
    }


# =========================
# LEADERBOARD
# =========================
@app.get("/leaderboard/all")
def leaderboard_all():
    students = list(students_collection.find({}))

    for s in students:
        s["_id"] = str(s["_id"])

    students.sort(key=lambda x: x.get("score", 0), reverse=True)

    ranked = []
    for i, s in enumerate(students, start=1):
        ranked.append({
            "rank": i,
            "_id": s["_id"],
            "name": s.get("name"),
            "score": s.get("score", 0),
            "category": s.get("category"),
            "attendance": s.get("attendance"),
            "study_time": s.get("study_time"),
            "previous_grade": s.get("previous_grade"),
            "user_id": s.get("user_id")
        })

    avg_score = round(sum([s["score"] for s in ranked]) / len(ranked), 2) if ranked else 0

    return {
        "avg_score": avg_score,
        "students": ranked
    }


@app.get("/export/csv")
def export_csv(user=Depends(get_current_user_id)):
    user_id = user["user_id"]   # ✅ FIX
    students = list(students_collection.find({"user_id": user_id}))

    output = StringIO()
    writer = csv.writer(output)

    writer.writerow([
        "Name", "Gender", "Score", "Category",
        "Attendance", "Study Time", "Sleep Hours", "Previous Grade",
        "Family Support", "Motivation", "Extracurricular"
    ])

    for s in students:
        writer.writerow([
            s.get("name"), s.get("gender"), s.get("score"), s.get("category"),
            s.get("attendance"), s.get("study_time"), s.get("sleep_hours"), s.get("previous_grade"),
            s.get("family_support"), s.get("motivation"), s.get("extracurricular")
        ])

    output.seek(0)
    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=students.csv"}
    )


@app.get("/analytics")
def analytics(user=Depends(get_current_user_id)):
    user_id = user["user_id"]   # ✅ FIX
    students = list(students_collection.find({"user_id": user_id}))

    if not students:
        return {
            "summary": {"total_students": 0, "avg_score": 0, "top_score": 0, "low_score": 0},
            "categories": [],
            "active_students": [],
            "score_trend": [],
            "activity_map": []
        }

    for s in students:
        s["_id"] = str(s["_id"])
        s["score"] = float(s.get("score", 0))
        s["created_at"] = s.get("created_at") or datetime.utcnow()

        if isinstance(s["created_at"], str):
            try:
                s["created_at"] = datetime.fromisoformat(s["created_at"])
            except:
                s["created_at"] = datetime.utcnow()

    total = len(students)
    avg_score = round(sum([s["score"] for s in students]) / total, 2)
    top_score = max([s["score"] for s in students])
    low_score = min([s["score"] for s in students])

    cat_counter = Counter([s.get("category", "Unknown") for s in students])
    categories = [{"name": k, "value": v} for k, v in cat_counter.items()]

    active_threshold = datetime.utcnow() - timedelta(days=3)
    active_students = []
    for s in sorted(students, key=lambda x: x["created_at"], reverse=True):
        if s["created_at"] >= active_threshold:
            active_students.append({
                "_id": s["_id"],
                "name": s.get("name"),
                "score": s.get("score"),
                "category": s.get("category"),
                "last_active": s["created_at"].strftime("%Y-%m-%d")
            })

    trend_map = defaultdict(list)
    last7 = datetime.utcnow() - timedelta(days=7)

    for s in students:
        if s["created_at"] >= last7:
            day = s["created_at"].strftime("%a")
            trend_map[day].append(s["score"])

    score_trend = []
    order = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    for day in order:
        if day in trend_map:
            score_trend.append({"day": day, "score": round(sum(trend_map[day]) / len(trend_map[day]), 2)})
        else:
            score_trend.append({"day": day, "score": 0})

    today = datetime.utcnow()
    activity_counter = defaultdict(int)

    for s in students:
        d = s["created_at"].strftime("%Y-%m-%d")
        activity_counter[d] += 1

    activity_map = []
    for i in range(30):
        d = today - timedelta(days=i)
        key = d.strftime("%Y-%m-%d")
        activity_map.append({"date": key, "value": activity_counter.get(key, 0)})

    activity_map.reverse()

    return {
        "summary": {"total_students": total, "avg_score": avg_score, "top_score": top_score, "low_score": low_score},
        "categories": categories,
        "active_students": active_students[:5],
        "score_trend": score_trend,
        "activity_map": activity_map
    }


# =========================
# ADMIN
# =========================
@app.get("/admin/users")
def get_all_users(admin=Depends(admin_only)):
    users = list(users_collection.find({}, {"password": 0}))

    data = []
    for u in users:
        data.append({
            "id": str(u["_id"]),
            "name": u.get("name"),
            "email": u.get("email"),
            "rePassword": u.get("rePassword", "")
        })

    return data


@app.get("/admin/users/{uid}/students")
def admin_user_students(uid: str, admin=Depends(admin_only)):
    students = list(students_collection.find({"user_id": uid}).sort("created_at", -1))

    data = []
    for s in students:
        s["_id"] = str(s["_id"])
        if "created_at" in s and isinstance(s["created_at"], datetime):
            s["created_at"] = s["created_at"].strftime("%Y-%m-%d")
        data.append(s)

    return data


@app.delete("/admin/users/{uid}")
def delete_user(uid: str, admin=Depends(admin_only)):
    students_collection.delete_many({"user_id": uid})

    res = users_collection.delete_one({"_id": ObjectId(uid)})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User deleted successfully"}



@app.post("/admin/resources/upload")
async def upload_resource(
    title: str = Form(...),
    semester: str = Form(...),
    subject: str = Form(...),
    pdf: UploadFile = File(...)
):
    # Save file inside uploads/resources folder
    file_location = f"uploads/resources/{pdf.filename}"

    with open(file_location, "wb") as f:
        f.write(await pdf.read())

    resource = {
        "title": title,
        "semester": semester,
        "subject": subject,
        "file_url": f"/uploads/resources/{pdf.filename}",  # correct URL
        "uploaded_at": datetime.utcnow()
    }

    resources_collection.insert_one(resource)

    return {"message": "Uploaded successfully"}


@app.get("/resources")
def get_resources():
    data = []
    for r in resources_collection.find().sort("uploaded_at", -1):
        r["_id"] = str(r["_id"])
        data.append(r)
    return data
@app.get("/resources")
def get_resources():
    data = []
    for r in resources_collection.find().sort("uploaded_at", -1):
        r["_id"] = str(r["_id"])
        data.append(r)
    return data
@app.delete("/admin/resources/{rid}")
def delete_resource(rid: str, admin=Depends(admin_only)):
    resource = resources_collection.find_one({"_id": ObjectId(rid)})
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    # delete file from folder
    file_path = resource["file_url"].replace("/uploads/", "uploads/")
    if os.path.exists(file_path):
        os.remove(file_path)

    resources_collection.delete_one({"_id": ObjectId(rid)})
    return {"message": "Resource deleted"}

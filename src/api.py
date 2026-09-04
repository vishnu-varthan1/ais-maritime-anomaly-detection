from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import os

app = FastAPI(
    title="AIS Maritime Anomaly Detection API",
    version="1.0"
)

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained model
model = joblib.load(
    "models/isolation_forest_v1.joblib"
)

# Features expected by the model
feature_cols = [
    "SOG",
    "COG",
    "time_gap",
    "distance_km",
    "speed_change",
    "course_change_circular"
]


@app.get("/")
def home():
    return {
        "message": "AIS Anomaly Detection API",
        "status": "running"
    }


@app.post("/predict")
def predict(data: dict):

    df = pd.DataFrame([data])

    prediction = model.predict(
        df[feature_cols]
    )[0]

    score = model.decision_function(
        df[feature_cols]
    )[0]

    return {
        "anomaly": int(prediction),
        "anomaly_score": float(score)
    }


@app.get("/vessels")
def get_vessels():

    file_path = "data/processed/anomaly_results.csv"

    if not os.path.exists(file_path):
        return {
            "error": "AIS results file not found"
        }

    data = pd.read_csv(file_path)

    return data.to_dict(orient="records")
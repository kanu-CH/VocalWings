from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import shutil
import os
from bird_model.model_utils import load_models, predict
from fastapi.middleware.cors import CORSMiddleware
from bird_model.config import AUDIO_FOLDER
# from bird_model.model_utils import *
# from bird_model.config import *

app = FastAPI()

os.makedirs(AUDIO_FOLDER, exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models at startup
load_models()

@app.post("/predict")
async def predict_bird(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(AUDIO_FOLDER, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        label, confidence = predict(file_path)

        os.remove(file_path)

        return JSONResponse({
            "species": label,
            "confidence": confidence
        })
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

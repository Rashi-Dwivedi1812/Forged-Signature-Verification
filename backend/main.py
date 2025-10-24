import tensorflow as tf
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import io
import uvicorn
import os

# --- Load Model ---
model_path = 'Forged-Signature-Verification/temp_model.h5'
try:
    # Load the full model for single predictions
    full_model = tf.keras.models.load_model(model_path)
    print(f"--- Full model '{model_path}' loaded successfully! ---")
    
    # Create a feature extractor model for comparison.
    feature_layer_output = full_model.layers[-2].output
    feature_extractor_model = tf.keras.Model(inputs=full_model.input, outputs=feature_layer_output)
    print("--- Feature extractor model created successfully! ---")

except Exception as e:
    print(f"--- 🔴 Error loading model: {e} ---")
    full_model = None
    feature_extractor_model = None

# --- Initialize App and Add CORS ---
app = FastAPI()

# -------------------------------------------------------------------
# ✅ IMPORTANT: Update this list with your frontend URL
# -------------------------------------------------------------------
origins = [
    "https://your-vercel-app-url.vercel.app",  # Your production frontend URL
    "http://localhost:3000",                  # For local React development
    "http://localhost:5173",                  # For local Vite development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Helper Function to Preprocess Images ---
def preprocess_image(image_bytes):
    """Takes image bytes and preprocesses it for the model."""
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((224, 224))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

# --- API Endpoint for Single Prediction ---
@app.post("/api/predict-single")
async def predict_signature(file: UploadFile = File(...)):
    if not full_model:
        raise HTTPException(status_code=500, detail="Model not loaded")
        
    contents = await file.read()
    img_array = preprocess_image(contents)
    
    prediction = full_model.predict(img_array)
    score = float(prediction[0][0])
    
    is_forged_result = score > 0.5
    response_data = {
        "filename": file.filename,
        "confidence": score,      
        "is_forged": is_forged_result  
    }
    return response_data

# --- API Endpoint for Signature Comparison ---
@app.post("/api/compare-signatures")
async def compare_signatures(files: list[UploadFile] = File(...)):
    if not feature_extractor_model:
        raise HTTPException(status_code=500, detail="Feature extractor model not loaded")

    if len(files) != 2:
        raise HTTPException(status_code=400, detail="Please upload exactly two files for comparison.")

    # Preprocess both images
    image_one_bytes = await files[0].read()
    image_two_bytes = await files[1].read()
    
    img_array_1 = preprocess_image(image_one_bytes)
    img_array_2 = preprocess_image(image_two_bytes)

    # Extract feature vectors from both images
    features_1 = feature_extractor_model.predict(img_array_1)
    features_2 = feature_extractor_model.predict(img_array_2)

    # Calculate the similarity score (Euclidean distance)
    distance = np.linalg.norm(features_1 - features_2)
    similarity_score = max(0, 1 - (distance / 10)) 
    
    # Format the response for the frontend
    is_match_result = similarity_score > 0.5 
    response_data = {
        "filenames": [files[0].filename, files[1].filename],
        "similarity_score": float(similarity_score),
        "is_match": bool(is_match_result)
    }
    return response_data

# --- Run Server for Production ---
if __name__ == "__main__":
    # Render and other hosts will set the PORT environment variable
    port = int(os.environ.get("PORT", 8000))
    print(f"--- Starting server on port {port} ---")
    uvicorn.run(app, host="0.0.0.0", port=port)

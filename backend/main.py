from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import numpy as np
from PIL import Image
import io
import tensorflow as tf
from typing import Optional, List
import base64

app = FastAPI(title="Forged Signature Verification API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models on startup
cnn_model = None
siamese_model = None
contrastive_model = None

@app.on_event("startup")
async def load_models():
    global cnn_model, siamese_model, contrastive_model
    try:
        cnn_model = tf.keras.models.load_model('models/cnn_model.h5')
        siamese_model = tf.keras.models.load_model('models/siamese_model.h5')
        contrastive_model = tf.keras.models.load_model('models/contrastive_model.h5')
        print("Models loaded successfully!")
    except Exception as e:
        print(f"Error loading models: {e}")

@app.get("/")
async def root():
    return {"message": "Forged Signature Verification API"}

@app.post("/api/predict-single")
async def predict_single_signature(
    file: UploadFile = File(...),
    model_type: Optional[str] = "cnn"
):
    """Predict if a single signature is forged or genuine"""
    try:
        # Read and process image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Preprocess image (resize, normalize, etc.)
        processed_image = preprocess_image(image)
        
        # Select model
        model = cnn_model if model_type == "cnn" else siamese_model
        
        # Make prediction
        prediction = model.predict(processed_image)
        confidence = float(prediction[0][0])
        
        # Determine if forged or genuine
        is_forged = confidence > 0.5
        
        # Convert image to base64 for frontend display
        img_buffer = io.BytesIO()
        image.save(img_buffer, format='PNG')
        img_base64 = base64.b64encode(img_buffer.getvalue()).decode()
        
        return {
            "success": True,
            "prediction": "Forged" if is_forged else "Genuine",
            "confidence": confidence,
            "image": f"data:image/png;base64,{img_base64}",
            "model_used": model_type
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/compare-signatures")
async def compare_signatures(
    file1: UploadFile = File(...),
    file2: UploadFile = File(...),
    model_type: Optional[str] = "siamese"
):
    """Compare two signatures for similarity"""
    try:
        # Read both images
        contents1 = await file1.read()
        contents2 = await file2.read()
        
        image1 = Image.open(io.BytesIO(contents1))
        image2 = Image.open(io.BytesIO(contents2))
        
        # Convert to RGB
        if image1.mode != 'RGB':
            image1 = image1.convert('RGB')
        if image2.mode != 'RGB':
            image2 = image2.convert('RGB')
        
        # Preprocess images
        processed_image1 = preprocess_image(image1)
        processed_image2 = preprocess_image(image2)
        
        # Select model
        model = siamese_model if model_type == "siamese" else contrastive_model
        
        # Calculate similarity
        similarity = model.predict([processed_image1, processed_image2])
        similarity_score = float(similarity[0][0])
        
        # Determine if signatures match
        threshold = 0.8
        is_match = similarity_score > threshold
        
        # Convert images to base64
        img1_buffer = io.BytesIO()
        img2_buffer = io.BytesIO()
        image1.save(img1_buffer, format='PNG')
        image2.save(img2_buffer, format='PNG')
        
        img1_base64 = base64.b64encode(img1_buffer.getvalue()).decode()
        img2_base64 = base64.b64encode(img2_buffer.getvalue()).decode()
        
        return {
            "success": True,
            "match": is_match,
            "similarity_score": similarity_score,
            "threshold": threshold,
            "verdict": "Signatures Match" if is_match else "Signatures Don't Match",
            "image1": f"data:image/png;base64,{img1_base64}",
            "image2": f"data:image/png;base64,{img2_base64}",
            "model_used": model_type
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/clean-image")
async def clean_image(file: UploadFile = File(...)):
    """Clean/denoise a signature image"""
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Apply your image cleaning logic here
        # This is a placeholder - use your actual image_cleaning.py logic
        cleaned_image = apply_image_cleaning(image)
        
        # Convert to base64
        img_buffer = io.BytesIO()
        cleaned_image.save(img_buffer, format='PNG')
        img_base64 = base64.b64encode(img_buffer.getvalue()).decode()
        
        return {
            "success": True,
            "cleaned_image": f"data:image/png;base64,{img_base64}"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def preprocess_image(image: Image.Image) -> np.ndarray:
    """Preprocess image for model input"""
    # Resize to expected dimensions (adjust based on your model)
    image = image.resize((224, 224))
    
    # Convert to array and normalize
    img_array = np.array(image) / 255.0
    
    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array

def apply_image_cleaning(image: Image.Image) -> Image.Image:
    """Apply image cleaning/denoising"""
    # Implement your image cleaning logic here
    # For now, returning the original image
    return image

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
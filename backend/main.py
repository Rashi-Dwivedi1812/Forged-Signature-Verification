from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import numpy as np
from PIL import Image
import io
import tensorflow as tf
from typing import Optional, List
import base64
import os

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
        # Build a path to the model file relative to this script's location.
        script_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.dirname(script_dir)
        model_path = os.path.join(project_root, 'signature_version_model.h5')

        if os.path.exists(model_path):
            cnn_model = tf.keras.models.load_model(model_path, compile=False)
            print("CNN Model loaded successfully!")
        else:
            print(f"Warning: CNN model not found at {model_path}")

        siamese_model = None
        contrastive_model = None

        print("Model loading process finished.")
    except Exception as e:
        print("="*80)
        print("!!! CRITICAL ERROR: FAILED TO LOAD THE KERAS MODEL !!!")
        print(f"Error Type: {type(e).__name__}")
        print(f"Error Details: {e}")
        print("\nThis error is often caused by a version mismatch between the TensorFlow/Keras")
        print("library used to save the model and the one used to load it.")
        print("\nRECOMMENDED ACTION:")
        print("1. Open the model in its original training environment (or a compatible one).")
        print("2. Re-save the model, for example: `model.save('new_model.h5')`")
        print("3. Use this newly saved model file in your application.")
        print("This will update the model file to a compatible format.")
        print("="*80)


@app.get("/")
async def root():
    return {"message": "Welcome to the Forged Signature Verification API"}

@app.post("/api/predict-single")
async def predict_single_signature(
    file: UploadFile = File(...),
    model_type: Optional[str] = "cnn"
):
    """Predict if a single signature is forged or genuine"""
    if model_type == "cnn" and cnn_model is None:
        raise HTTPException(status_code=503, detail="CNN model is not loaded. Check backend logs for errors.")
    if model_type != "cnn":
         raise HTTPException(status_code=400, detail=f"Model type '{model_type}' is not supported for single prediction.")


    try:
        # Read and process image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))

        # Convert to RGB if necessary, as models usually expect 3 channels
        if image.mode != 'RGB':
            image = image.convert('RGB')

        # Preprocess image for the model
        processed_image = preprocess_image(image)

        # Select model
        model = cnn_model # Currently only CNN is supported here

        # Make prediction
        prediction = model.predict(processed_image)
        confidence = float(prediction[0][0])

        # Determine if forged or genuine based on a 0.5 threshold
        is_forged = confidence > 0.5

        # Convert original image to base64 for frontend display
        img_buffer = io.BytesIO()
        image.save(img_buffer, format='PNG')
        img_base64 = base64.b64encode(img_buffer.getvalue()).decode()

        return JSONResponse(content={
            "success": True,
            "prediction": "Forged" if is_forged else "Genuine",
            "confidence": confidence,
            "image": f"data:image/png;base64,{img_base64}",
            "model_used": model_type
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during prediction: {e}")

@app.post("/api/compare-signatures")
async def compare_signatures(
    file1: UploadFile = File(...),
    file2: UploadFile = File(...),
    model_type: Optional[str] = "siamese"
):
    """Compare two signatures for similarity"""
    # Placeholder for when siamese or contrastive models are available
    if model_type in ["siamese", "contrastive"]:
        if (model_type == "siamese" and siamese_model is None) or \
           (model_type == "contrastive" and contrastive_model is None):
            raise HTTPException(status_code=503, detail=f"{model_type.capitalize()} model is not loaded.")
    else:
        raise HTTPException(status_code=400, detail=f"Model type '{model_type}' is not supported for signature comparison.")

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
        # Note: The actual prediction logic might differ based on your model's output
        similarity = model.predict([processed_image1, processed_image2])
        similarity_score = float(similarity[0][0])

        # Determine if signatures match
        threshold = 0.8
        is_match = similarity_score > threshold

        # Convert images to base64 for response
        img1_buffer = io.BytesIO()
        img2_buffer = io.BytesIO()
        image1.save(img1_buffer, format='PNG')
        image2.save(img2_buffer, format='PNG')

        img1_base64 = base64.b64encode(img1_buffer.getvalue()).decode()
        img2_base64 = base64.b64encode(img2_buffer.getvalue()).decode()

        return JSONResponse(content={
            "success": True,
            "match": is_match,
            "similarity_score": similarity_score,
            "threshold": threshold,
            "verdict": "Signatures Match" if is_match else "Signatures Don't Match",
            "image1": f"data:image/png;base64,{img1_base64}",
            "image2": f"data:image/png;base64,{img2_base64}",
            "model_used": model_type
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during comparison: {e}")


@app.post("/api/clean-image")
async def clean_image(file: UploadFile = File(...)):
    """Clean/denoise a signature image"""
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))

        # Apply your image cleaning logic here
        cleaned_image = apply_image_cleaning(image)

        # Convert cleaned image to base64
        img_buffer = io.BytesIO()
        cleaned_image.save(img_buffer, format='PNG')
        img_base64 = base64.b64encode(img_buffer.getvalue()).decode()

        return JSONResponse(content={
            "success": True,
            "cleaned_image": f"data:image/png;base64,{img_base64}"
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while cleaning the image: {e}")

def preprocess_image(image: Image.Image, size=(224, 224)) -> np.ndarray:
    """Preprocess image for model input"""
    # Resize to expected dimensions
    image = image.resize(size)

    # Convert to array and normalize
    img_array = np.array(image) / 255.0

    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)

    return img_array

def apply_image_cleaning(image: Image.Image) -> Image.Image:
    """Apply image cleaning/denoising"""
    # This is a placeholder. Implement your actual image cleaning logic.
    # For example, using OpenCV for thresholding or denoising.
    # import cv2
    # open_cv_image = np.array(image)
    # # Convert RGB to BGR
    # open_cv_image = open_cv_image[:, :, ::-1].copy()
    # gray = cv2.cvtColor(open_cv_image, cv2.COLOR_BGR2GRAY)
    # _, cleaned = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)
    # return Image.fromarray(cleaned)
    print("Applying placeholder image cleaning.")
    return image

if __name__ == "__main__":
    import uvicorn
    # It's good practice to allow host and port to be configured via environment variables
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host=host, port=port, reload=True)
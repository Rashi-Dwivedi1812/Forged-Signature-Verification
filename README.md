# Forged Signature Verification 🖋️✨

A full-stack web application built with React and a TensorFlow/FastAPI backend to detect forged signatures and compare signature similarity.

[![Vercel Deployment](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel&style=flat-square)](https://forged-signature-verification.vercel.app)
[![Render Deployment](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render&style=flat-square)](https://forged-signature-verification.onrender.com)

---

### **Live Demo: [forged-signature-verification.vercel.app](https://forged-signature-verification.vercel.app)**

*(Note: The backend is hosted on Render's free tier, so the first request may take 30-60 seconds for the server to "wake up".)*

![Demo GIF](https://your-link-to-a-demo-gif.com/demo.gif)

## About The Project

This project uses a Deep Learning model (built with TensorFlow/Keras) to solve two common signature verification tasks:

1.  **Prediction:** Classify a single signature as **Genuine** or **Forged**.
2.  **Comparison:** Compare two signatures and provide a **similarity score** to determine if they are a match.

The model is served via a FastAPI backend and consumed by a modern React frontend.

## Features

* **Single Signature Prediction:** Upload an image to get a confidence score of it being genuine or forged.
* **Two-Signature Comparison:** Upload two images to see if they are a match, based on their extracted feature vectors.
* **REST API:** A clean API backend that handles all image processing and model inference.
* **Decoupled Frontend:** A fast, responsive React UI deployed separately for best performance.

## Tech Stack

| Frontend | Backend |
| :--- | :--- |
| ⚛️ React.js | 🚀 FastAPI |
| 🎨 Tailwind CSS (or CSS) | 🧠 TensorFlow & Keras |
| 🌐 Axios (or Fetch) | 🐍 Python 3 |
| 📦 Vite | 🖼️ Pillow (PIL) |
| ☁️ **Deployed on Vercel** | ☁️ **Deployed on Render** |

## Getting Started

To run this project locally, you will need to run the backend and frontend in separate terminals.

### Prerequisites

* Python 3.8+
* Node.js v16+
* A clone of the repository: `git clone https://github.com/Rashi-Dwivedi1812/Forged-Signature-Verification.git`

### 1. Backend Server (FastAPI)

```bash
# Navigate to the backend folder
cd Forged-Signature-Verification/backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload
```
### 2. Frontend Client (React)

```bash
# Navigate to the client folder in a new terminal
cd Forged-Signature-Verification/client # Or your frontend folder

# Install dependencies
npm install

# Run the development server
npm run dev
```
---

## 👩‍💻 Contributors

This project was brought to life by:

* **Sachin Mishra**
    * GitHub: [@sachin-m152](https://github.com/sachin-m15)
    * LinkedIn: [in/sachin-mishra-325444271](https://www.linkedin.com/in/sachin-mishra-325444271/)

* **Rashi Dwivedi**
    * GitHub: [@Rashi-Dwivedi1812](https://github.com/Rashi-Dwivedi1812)
    * LinkedIn: [in/rashi-dwivedi-796032339](https://www.linkedin.com/in/rashi-dwivedi-796032339/)

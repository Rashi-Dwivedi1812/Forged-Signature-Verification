An interactive machine learning-powered web app to detect forged signatures using convolutional autoencoders and Siamese Neural Networks. Designed for both single signature prediction and signature-to-signature verification.

🔍 Key Features
✅ Single Signature Forgery Prediction

🔄 Signature-to-Signature Comparison

📊 Confidence & Similarity Scores

💡 Clean, Interactive UI with Real-time Analysis

🧠 How It Works
Upload Signature(s):

Single mode: Upload one signature to predict if it’s forged.

Comparison mode: Upload two signatures to check for authenticity.

Image Preprocessing:

Signatures are cleaned using a custom convolutional autoencoder to remove noise and enhance clarity.

Prediction:

The cleaned images are passed through trained deep learning models (CNN or Siamese NN).

In comparison mode, a similarity score is computed. If it exceeds a defined threshold, the signature is marked genuine; otherwise, forged.

🛠️ Processes Involved
🧹 Image Cleaning:
Denoising and normalization via convolutional autoencoders.

📚 Model Training:
Custom CNN, Siamese NN, and Contrastive Siamese NN trained on the CEDAR signature dataset.

🎯 Prediction Logic:
Threshold-based decision using confidence and similarity scores.

📈 Evaluation Metrics:
PSNR and SSIM used for validating autoencoder performance.

🖥️ Frontend Interface:
Built using Streamlit with a focus on real-time prediction and user interaction.

🧰 Tech Stack & Libraries
Layer	Tools / Libraries
Frontend	Streamlit, custom CSS
Backend/ML	TensorFlow, NumPy, PIL
Data Handling	PIL, NumPy, io
Models	CNN, SNN, CSNN — exported as .h5
Deployment	Local Streamlit app (Cloud-ready)

├── app.py                        # Streamlit frontend
├── image_cleaning.py            # Autoencoder preprocessing
├── models/
│   ├── cnn_model.h5
│   ├── siamese_model.h5
│   └── contrastive_model.h5
├── cleaned_dataset/             # Autoencoder-processed images
├── requirements.txt
└── README.md

📢 Notes
Best results are achieved on clean, high-resolution signature scans.

Cloud deployment (e.g., Heroku, Hugging Face Spaces) is possible with minor tweaks.

Ideal for demonstrations, hackathons, or academic use.


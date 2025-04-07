import streamlit as st
import tensorflow as tf
import numpy as np
from PIL import Image
import io

# Page config
st.set_page_config(
    page_title="Signature Verification System",
    page_icon="✒️",
    layout="wide",
)

# Custom CSS styling
st.markdown("""
    <style>
        .main-header {
            font-size: 2.5rem;
            color: #1E3A8A;
            text-align: center;
            margin-bottom: 1rem;
        }
        .sub-header {
            font-size: 1.5rem;
            color: #374151;
            margin-bottom: 1rem;
        }
        .result-genuine {
            font-size: 1.8rem;
            color: #10B981;
            font-weight: bold;
        }
        .result-forged {
            font-size: 1.8rem;
            color: #EF4444;
            font-weight: bold;
        }
        .confidence {
            font-size: 1.2rem;
            color: #6B7280;
        }
        .stTabs [data-baseweb="tab-list"] {
            gap: 1rem;
        }
        .stTabs [data-baseweb="tab"] {
            height: 3rem;
            white-space: pre-wrap;
            background-color: #F3F4F6;
            border-radius: 4px 4px 0px 0px;
            gap: 1rem;
            color: #555;
            font-weight: 500;
            padding-top: 10px;
            padding-bottom: 10px;
        }
        .stTabs [aria-selected="true"] {
            background-color: #DBEAFE;
            color: #ff4b4b; /* selected tab text color */
            font-weight: 700;
            border-bottom: 2px solid #ff4b4b;
        }
    </style>
""", unsafe_allow_html=True)

# Header
st.markdown('<h1 class="main-header">✒️ Signature Verification System</h1>',
            unsafe_allow_html=True)
st.markdown('<p style="text-align: center; margin-bottom: 2rem;">Upload signature images to verify authenticity</p>', unsafe_allow_html=True)

# Session state
if 'model' not in st.session_state:
    st.session_state.model = None

# Load model


@st.cache_resource
def load_model(model_path):
    try:
        model = tf.keras.models.load_model(model_path)
        return model
    except Exception as e:
        st.error(f"Error loading model: {e}")
        return None


def preprocess_image(img, img_size=(224, 224)):
    img = img.convert("RGB")  # Convert to RGB instead of grayscale
    img = img.resize(img_size)
    img_array = np.array(img) / 255.0
    img_array = img_array.reshape(1, img_size[0], img_size[1], 3)  # 3 channels
    return img_array


# Tabs
tab1, tab2 = st.tabs(["📊 Single Image Analysis", "🔄 Signature Comparison"])

# --- Single Image Analysis ---
with tab1:
    st.markdown('<h2 class="sub-header">Single Signature Analysis</h2>',
                unsafe_allow_html=True)
    st.write("Upload a signature image to check if it's genuine or forged.")

    uploaded_file = st.file_uploader("Choose a signature image", type=[
                                     "jpg", "png", "jpeg"], key="single_image")
    model_file = st.file_uploader("Upload your trained model (.h5 file)", type=[
                                  "h5"], key="model_upload")

    if uploaded_file is not None:
        col1, col2 = st.columns([1, 1])
        with col1:
            image = Image.open(uploaded_file)
            resized_image = image.resize((100, 100))
            rotate_image = resized_image.rotate(90)
            st.image(rotate_image, caption='Uploaded Signature',
                     use_column_width=True)

        with col2:
            if model_file is not None:
                model_bytes = io.BytesIO(model_file.read())
                model_path = "temp_model.h5"
                with open(model_path, "wb") as f:
                    f.write(model_bytes.getbuffer())

                st.session_state.model = load_model(model_path)

                if st.session_state.model and st.button("Verify Signature"):
                    with st.spinner("Analyzing signature..."):
                        processed_img = preprocess_image(image)
                        prediction = st.session_state.model.predict(
                            processed_img)
                        prediction_value = prediction[0][0]
                        label = "Genuine" if prediction_value > 0.5 else "Forged"
                        confidence = prediction_value if label == "Genuine" else 1 - prediction_value

                        result_class = "result-genuine" if label == "Genuine" else "result-forged"
                        st.markdown(f'<p class="{result_class}">Prediction: {
                                    label}</p>', unsafe_allow_html=True)
                        st.markdown(f'<p class="confidence">Confidence: {
                                    confidence*100:.2f}%</p>', unsafe_allow_html=True)
                        st.progress(float(confidence))
            else:
                st.info(
                    "Please upload your trained model (.h5 file) to analyze the signature.")

# --- Signature Comparison ---
with tab2:
    st.markdown('<h2 class="sub-header">Compare Two Signatures</h2>',
                unsafe_allow_html=True)
    st.write(
        "Upload two signature images to compare them and check if they're from the same person.")

    col1, col2 = st.columns(2)
    with col1:
        reference_file = st.file_uploader("Upload reference signature (known genuine)", type=[
                                          "jpg", "png", "jpeg"], key="ref_image")
        if reference_file:
            reference_img = Image.open(reference_file)
            image_resize = reference_img.resize((100, 50))
            st.image(image_resize, caption='Reference Signature',
                     use_column_width=True)

    with col2:
        test_file = st.file_uploader("Upload test signature (to verify)", type=[
                                     "jpg", "png", "jpeg"], key="test_image")
        if test_file:
            test_img = Image.open(test_file)
            test_resized = test_img.resize((100, 50))
            st.image(test_resized, caption='Test Signature',
                     use_column_width=True)

    if st.session_state.model is None:
        model_file_comp = st.file_uploader("Upload your trained model (.h5 file)", type=[
                                           "h5"], key="model_upload_comp")
        if model_file_comp:
            model_bytes = io.BytesIO(model_file_comp.read())
            model_path = "temp_model.h5"
            with open(model_path, "wb") as f:
                f.write(model_bytes.getbuffer())
            st.session_state.model = load_model(model_path)

    if reference_file and test_file and st.session_state.model:
        if st.button("Compare Signatures"):
            with st.spinner("Comparing signatures..."):
                ref_processed = preprocess_image(reference_img)
                test_processed = preprocess_image(test_img)

                ref_prediction = st.session_state.model.predict(ref_processed)[
                    0][0]
                test_prediction = st.session_state.model.predict(test_processed)[
                    0][0]

                similarity = 1 - abs(ref_prediction - test_prediction)
                threshold = 0.9
                match_result = similarity > threshold

                if match_result:
                    st.markdown(
                        '<p class="result-genuine">Result: Signatures likely match!</p>', unsafe_allow_html=True)
                else:
                    st.markdown(
                        '<p class="result-forged">Result: Signatures likely do not match!</p>', unsafe_allow_html=True)
                st.markdown(f'<p class="confidence">Similarity Score: {
                            similarity*100:.2f}%</p>', unsafe_allow_html=True)
                st.progress(float(similarity))

                with st.expander("Technical Details"):
                    st.write(f"Reference prediction: {ref_prediction:.4f}")
                    st.write(f"Test prediction: {test_prediction:.4f}")
                    st.write(f"Similarity threshold: {threshold}")

# About section
with st.expander("ℹ️ About This App"):
    st.write("""
    ### How it works
    This signature verification system uses a deep learning model to check if a signature is genuine or forged.
    
    - **Single Image Analysis**: Predicts authenticity of one image.
    - **Signature Comparison**: Compares two images for similarity using a simple similarity score.
    
    ### Tips:
    - Upload high-contrast, clean signature images.
    - Image size is automatically resized to 224x224 and converted to grayscale.
    - Best used with models trained on datasets like CEDAR.
    """)

# Sidebar
st.sidebar.title("Instructions")
st.sidebar.write("""
1. Upload your `.h5` signature verification model.
2. Upload signature image(s) to test.
3. Click "Verify" or "Compare".
4. View results and similarity/confidence.
""")
st.sidebar.markdown("---")
st.sidebar.write(
    "Model should be compatible with grayscale 224x224 input. Trained on datasets like CEDAR.")

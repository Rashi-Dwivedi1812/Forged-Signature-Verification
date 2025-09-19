from tensorflow.keras.models import load_model, save_model
from tensorflow.keras import Model

print("--- Starting model conversion script ---")

old_model_path = "D:\\Forged-Signature-Verification\\signature_version_model.h5"
new_model_path = "D:\\Forged-Signature-Verification\\signature_version_model"

# Load with custom_objects fix for "Functional"
print(f"Loading model from: {old_model_path}")
model = load_model(
    old_model_path,
    custom_objects={"Functional": Model},
    compile=False
)

# Save in SavedModel format (directory)
print(f"Saving model to: {new_model_path}")
model.save(new_model_path)

print("--- Conversion finished successfully ---")
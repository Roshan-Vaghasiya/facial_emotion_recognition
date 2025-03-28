from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

app = FastAPI()

# CORS policy
origins = [
    "http://localhost",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
MODEL = tf.keras.models.load_model("model.h5", compile=False)

# Define emotion classes and corresponding emojis
CLASS_NAMES = ["Angry", "Happy", "Neutral", "Sad"]
EMOJI_MAP = {
    "Angry": "😠",
    "Happy": "😀",
    "Neutral": "😐",
    "Sad": "😢",
}

@app.get("/ping")
async def ping():
    return {"message": "Hello, I am alive!"}

# Function to preprocess the image
def read_file_as_image(data) -> np.ndarray:
    image = Image.open(BytesIO(data)).convert("L")  # Convert to grayscale
    image = image.resize((48, 48))  # Resize to 48x48
    image = np.array(image) / 255.0  # Normalize pixel values
    image = np.expand_dims(image, axis=0)  # Add batch dimension
    image = np.expand_dims(image, axis=-1)  # Add channel dimension
    return image

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = read_file_as_image(await file.read())

    predictions = MODEL.predict(image)
    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]

    return {
        "class": predicted_class,
        "emoji": EMOJI_MAP[predicted_class],  # Changed key to "emoji" instead of "emotion"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)

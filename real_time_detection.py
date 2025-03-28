import cv2
import numpy as np
import tensorflow as tf
from keras.models import load_model

# Load the trained model
model = load_model("model.h5", compile=False)

# Define emotion labels
CLASS_NAMES = ["Angry", "Happy", "Neutral", "Sad"]

# Initialize face detector
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Open webcam
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Convert frame to grayscale
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detect faces
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)

    for (x, y, w, h) in faces:
        # Extract face ROI
        face = gray[y:y+h, x:x+w]
        face = cv2.resize(face, (48, 48))  # Resize to model input size
        face = np.expand_dims(face, axis=-1)  # Add channel dimension
        face = np.expand_dims(face, axis=0)  # Add batch dimension
        face = face / 255.0  # Normalize

        # Predict emotion
        predictions = model.predict(face)
        predicted_class = CLASS_NAMES[np.argmax(predictions)]
        confidence = np.max(predictions)

        # Draw bounding box and label
        cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
        cv2.putText(frame, f"{predicted_class} ({confidence:.2f})", (x, y-10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 0, 0), 2)

    # Show frame
    cv2.imshow("Real-Time Emotion Detection", frame)

    # Press 'q' to exit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

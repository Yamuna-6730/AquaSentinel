import cv2
import numpy as np
import base64
from ultralytics import YOLO
from models.utils import estimate_distance, visibility_score, risk_zone
import os

class ModelService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelService, cls).__new__(cls)
            # Load model once
            model_path = os.path.join("models", "yolov8n.pt")
            # If the specific trained model is available, use it
            trained_model = "D:\\AquaSentinel\\runs\\detect\\aquasentinel_small2\\weights\\best.pt"
            if os.path.exists(trained_model):
                cls._instance.model = YOLO(trained_model)
            else:
                cls._instance.model = YOLO(model_path)
        return cls._instance

    def predict(self, frame: np.ndarray):
        h, w, _ = frame.shape
        vis = visibility_score(frame)

        results = self.model(frame, imgsz=640)[0]
        
        detections = []
        telemetry = {
            "object_detected": False,
            "risk_level": "Low",
            "distance": 0.0,
            "visibility_score": vis
        }

        annotated_frame = frame.copy()

        for box in results.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            conf = float(box.conf[0])
            cls = int(box.cls[0])
            label = self.model.names[cls]

            bw = x2 - x1
            bh = y2 - y1

            dist = estimate_distance(bw, bh, w, h)
            risk = risk_zone(label, dist, vis)

            # Update telemetry (use highest risk/closest object logic)
            telemetry["object_detected"] = True
            if risk == "High" or (risk == "Medium" and telemetry["risk_level"] == "Low"):
                telemetry["risk_level"] = risk
            
            # Simple logic: track the closest object for primary telemetry
            if telemetry["distance"] == 0 or dist < telemetry["distance"]:
                telemetry["distance"] = dist

            # Add to detections list
            detections.append({
                "label": label,
                "confidence": round(conf, 2),
                "bbox": { "x": x1, "y": y1, "w": bw, "h": bh }
            })

            # Draw on annotated frame
            color = (0, 0, 255) if risk == "High" else (0, 255, 255) if risk == "Medium" else (0, 255, 0)
            cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), color, 2)
            cv2.putText(annotated_frame, f"{label} {dist}m", (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

        # Add visibility text
        cv2.putText(annotated_frame, f"Visibility: {vis}%", (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 0), 2)

        # Convert annotated frame to base64
        _, buffer = cv2.imencode('.jpg', annotated_frame)
        base64_image = base64.b64encode(buffer).decode('utf-8')

        return {
            "detections": detections,
            "telemetry": telemetry,
            "annotated_image": f"data:image/jpeg;base64,{base64_image}"
        }

    @staticmethod
    def base64_to_numpy(base64_str: str):
        if "," in base64_str:
            base64_str = base64_str.split(",")[1]
        img_data = base64.b64decode(base64_str)
        nparr = np.frombuffer(img_data, np.uint8)
        return cv2.imdecode(nparr, cv2.IMREAD_COLOR)

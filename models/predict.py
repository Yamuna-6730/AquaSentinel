import cv2
from ultralytics import YOLO
from utils import estimate_distance, visibility_score, risk_zone

model = YOLO("D:\\AquaSentinel\\runs\\detect\\aquasentinel_small2\\weights\\best.pt")

def run():
    cap = cv2.VideoCapture(0)  # webcam

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        h, w, _ = frame.shape
        vis = visibility_score(frame)

        results = model(frame)[0]

        for box in results.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            cls = int(box.cls[0])
            label = model.names[cls]

            bw = x2 - x1
            bh = y2 - y1

            dist = estimate_distance(bw, bh, w, h)
            risk = risk_zone(label, dist, vis)

            color = (0,0,255) if risk=="High" else (0,255,255) if risk=="Medium" else (0,255,0)

            cv2.rectangle(frame, (x1,y1), (x2,y2), color, 2)

            text = f"{label} | {dist}m | {risk}"
            cv2.putText(frame, text, (x1, y1-10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

            # 🚨 ALERT
            if risk == "High":
                print(f"⚠️ ALERT: {label} at {dist}m")

        cv2.putText(frame, f"Visibility: {vis}%",
                    (10,30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255,255,0), 2)

        cv2.imshow("AquaSentinel", frame)

        if cv2.waitKey(1) & 0xFF == 27:
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    run()
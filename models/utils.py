import cv2
import numpy as np

def estimate_distance(bw, bh, img_w, img_h):
    area = bw * bh
    img_area = img_w * img_h
    return round((1 / (area / img_area + 1e-6)) * 2, 2)

def visibility_score(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    sharp = cv2.Laplacian(gray, cv2.CV_64F).var()
    bright = np.mean(gray)
    contrast = np.std(gray)

    return round(
        (0.5 * min(sharp/1000,1) +
         0.3 * (bright/255) +
         0.2 * min(contrast/100,1)) * 100, 2
    )

def risk_zone(class_name, distance, visibility):
    if class_name in ["trash net", "trash rope", "metal", "plastic"]:
        if distance < 30:
            return "High"
        elif distance < 80:
            return "Medium"

    if visibility < 40:
        return "High"

    return "Low"
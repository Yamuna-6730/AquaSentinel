from ultralytics import YOLO

def train():
    model = YOLO("yolov8n.pt")  # small fast model

    model.train(
        data="D:/AquaSentinel/data/yolo_small/data.yaml",
        epochs=10,
        imgsz=416,
        batch=2,
        device="cpu",
        workers=0,
        name="aquasentinel_small"
    )

if __name__ == "__main__":
    train()
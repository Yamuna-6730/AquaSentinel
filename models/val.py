from ultralytics import YOLO

model = YOLO("D:\\AquaSentinel\\runs\\detect\\aquasentinel_small2\\weights\\best.pt")

metrics = model.val()

print("mAP50:", metrics.box.map50)
print("mAP50-95:", metrics.box.map)
print("Precision:", metrics.box.p)
print("Recall:", metrics.box.r)
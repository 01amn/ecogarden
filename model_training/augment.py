import os
import cv2
import shutil
import glob

def augment_data():
    base_dir = os.path.join(os.path.dirname(__file__), "..", "dataset", "yolo")
    images_dir = os.path.join(base_dir, "images", "train")
    labels_dir = os.path.join(base_dir, "labels", "train")
    
    if not os.path.exists(images_dir):
        print(f"{images_dir} does not exist. Please run setup_dataset.py first.")
        return

    images = glob.glob(os.path.join(images_dir, "*.*"))
    print(f"Found {len(images)} images. Starting augmentation/cleaning...")
    
    removed = 0
    augmented = 0
    
    for img_path in images:
        filename = os.path.basename(img_path)
        name, ext = os.path.splitext(filename)
        label_path = os.path.join(labels_dir, f"{name}.txt")
        
        # Open image
        img = cv2.imread(img_path)
        if img is None:
            continue
            
        # 1. Remove bad data (blur detection using laplacian variance)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        variance = cv2.Laplacian(gray, cv2.CV_64F).var()
        if variance < 10.0:  # blurry threshold
            os.remove(img_path)
            if os.path.exists(label_path):
                os.remove(label_path)
            removed += 1
            print(f"Removed blurry image: {filename}")
            continue

        # 2. Augmentation (flip horizontal)
        # Bounding box label doesn't change since we use full image (0.5 0.5 1.0 1.0)
        flipped_img = cv2.flip(img, 1)
        flipped_name = f"{name}_aug_flip{ext}"
        flipped_img_path = os.path.join(images_dir, flipped_name)
        flipped_label_path = os.path.join(labels_dir, f"{name}_aug_flip.txt")
        
        cv2.imwrite(flipped_img_path, flipped_img)
        if os.path.exists(label_path):
            shutil.copy2(label_path, flipped_label_path)
            
        augmented += 1

    print(f"Augmentation complete. Removed {removed} blurry images, generated {augmented} augmented images.")

if __name__ == "__main__":
    augment_data()

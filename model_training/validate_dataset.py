import os
import hashlib
from PIL import Image

def validate_dataset():
    current_dir = os.path.dirname(__file__)
    dataset_dir = os.path.abspath(os.path.join(current_dir, "..", "dataset"))
    extracted_dir = os.path.join(dataset_dir, "extracted", "Medicinal Leaf dataset")

    if not os.path.exists(extracted_dir):
        print(f"Directory not found: {extracted_dir}")
        return

    print("Starting Dataset Validation...")
    
    corrupted_count = 0
    duplicate_count = 0
    empty_folders_removed = 0
    
    # Validation constraints
    MIN_IMAGES_REQUIRED = 50

    for folder in os.listdir(extracted_dir):
        class_path = os.path.join(extracted_dir, folder)
        if not os.path.isdir(class_path):
            continue

        images = [f for f in os.listdir(class_path) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        
        # 1. Empty folders
        if len(images) == 0:
            print(f"[WARN] Removing empty class folder: {folder}")
            os.rmdir(class_path)
            empty_folders_removed += 1
            continue
            
        # 2. Check sufficient images
        if len(images) < MIN_IMAGES_REQUIRED:
            print(f"[WARN] Class '{folder}' has only {len(images)} images (recommended {MIN_IMAGES_REQUIRED}+)")
            
        # 3. Detect Corrupted and Duplicates
        hashes = set()
        for img_name in images:
            img_path = os.path.join(class_path, img_name)
            
            # Corrupted image check
            try:
                with Image.open(img_path) as img:
                    img.verify() # Verify it's an image
            except Exception as e:
                print(f"[Error] Corrupted image found and removed: {img_path}")
                os.remove(img_path)
                corrupted_count += 1
                continue
                
            # Duplicate check using md5 hash
            try:
                with open(img_path, 'rb') as f:
                    file_hash = hashlib.md5(f.read()).hexdigest()
                    
                if file_hash in hashes:
                    print(f"[Info] Duplicate image found and removed: {img_path}")
                    os.remove(img_path)
                    duplicate_count += 1
                else:
                    hashes.add(file_hash)
            except Exception as e:
                pass

    print("\nDataset Validation Complete!")
    print(f"Corrupted Removed: {corrupted_count}")
    print(f"Duplicates Removed: {duplicate_count}")
    print(f"Empty Folders Removed: {empty_folders_removed}")

if __name__ == "__main__":
    validate_dataset()

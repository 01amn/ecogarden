import os
import shutil
import random

def setup_dataset():
    current_dir = os.path.dirname(__file__)
    dataset_dir = os.path.abspath(os.path.join(current_dir, "..", "dataset"))
    extracted_dir = os.path.join(dataset_dir, "extracted", "Medicinal Leaf dataset")

    if not os.path.exists(extracted_dir):
        print(f"Dataset not found at {extracted_dir}.")
        return

    # User defined target classes
    target_classes = [
        "aloe_vera", "bamboo", "brahmi", "coriander", "curry", "ginger", 
        "hibiscus", "mango", "marigold", "mint", "neem",
        "onion", "papaya", "peepal", "rose", "tulsi", "turmeric"
    ]
    
    # Mapping existing folder names to target class names if they vary
    class_mapping = {
         "aloevera": "aloe_vera"
    }

    train_dir = os.path.join(dataset_dir, "train")
    valid_dir = os.path.join(dataset_dir, "valid")
    test_dir = os.path.join(dataset_dir, "test")

    # Clear existing splits if they exist to prevent duplication
    for d in [train_dir, valid_dir, test_dir]:
        if os.path.exists(d):
            shutil.rmtree(d)
        os.makedirs(d, exist_ok=True)

    split_ratios = (0.8, 0.1, 0.1)

    for folder_name in os.listdir(extracted_dir):
        class_dir = os.path.join(extracted_dir, folder_name)
        if not os.path.isdir(class_dir):
            continue
            
        target_name = class_mapping.get(folder_name.lower(), folder_name.lower())
        
        if target_name not in target_classes:
            print(f"Skipping unrequested class: {folder_name}")
            continue

        images = [f for f in os.listdir(class_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        
        if len(images) == 0:
            print(f"[SKIP] No images found for class '{target_name}' — skipping.")
            continue

        # Create class subdirs only if there are images
        for d in [train_dir, valid_dir, test_dir]:
            os.makedirs(os.path.join(d, target_name), exist_ok=True)

        # Remove duplicates based on names or size if desired, but here just randomize 
        random.shuffle(images)
        
        train_split = int(len(images) * split_ratios[0])
        valid_split = int(len(images) * (split_ratios[0] + split_ratios[1]))

        train_imgs = images[:train_split]
        valid_imgs = images[train_split:valid_split]
        test_imgs = images[valid_split:]

        for img, dest_dir in [(train_imgs, train_dir), (valid_imgs, valid_dir), (test_imgs, test_dir)]:
            for i in img:
                src = os.path.join(class_dir, i)
                dst = os.path.join(dest_dir, target_name, i)
                shutil.copy2(src, dst)

        print(f"Processed {target_name}: {len(train_imgs)} train, {len(valid_imgs)} valid, {len(test_imgs)} test")

    print("Dataset setup complete! 80/10/10 split.")

if __name__ == "__main__":
    setup_dataset()

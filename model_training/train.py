import os
import json
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping

def train_model():
    current_dir = os.path.dirname(__file__)
    dataset_dir = os.path.abspath(os.path.join(current_dir, "..", "dataset"))
    train_dir = os.path.join(dataset_dir, "train")
    valid_dir = os.path.join(dataset_dir, "valid")
    test_dir = os.path.join(dataset_dir, "test")

    if not os.path.exists(train_dir):
        print("Training directory not found. Please run setup_dataset.py first.")
        return

    # Image Data Generators with MobileNetV2 specific preprocessing
    train_datagen = ImageDataGenerator(
        preprocessing_function=preprocess_input,
        rotation_range=20,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest'
    )
    
    # Only use preprocessing for validation and test
    val_test_datagen = ImageDataGenerator(
        preprocessing_function=preprocess_input
    )

    batch_size = 32
    target_size = (224, 224)

    train_data = train_datagen.flow_from_directory(
        train_dir,
        target_size=target_size,
        batch_size=batch_size,
        class_mode='categorical'
    )

    valid_data = val_test_datagen.flow_from_directory(
        valid_dir,
        target_size=target_size,
        batch_size=batch_size,
        class_mode='categorical',
        shuffle=False
    )
    
    test_data = val_test_datagen.flow_from_directory(
        test_dir,
        target_size=target_size,
        batch_size=batch_size,
        class_mode='categorical',
        shuffle=False
    )

    # Save class indices to classes.json
    class_names = list(train_data.class_indices.keys())
    classes_path = os.path.join(current_dir, "..", "backend", "classes.json")
    with open(classes_path, "w") as f:
        json.dump(class_names, f)
    print(f"Saved classes to {classes_path}")

    # Build the Model
    num_classes = len(class_names)
    base_model = MobileNetV2(input_shape=(224, 224, 3), include_top=False, weights='imagenet')
    base_model.trainable = False # Freeze base model

    model = Sequential([
        base_model,
        GlobalAveragePooling2D(),
        Dropout(0.2),
        Dense(num_classes, activation='softmax')
    ])

    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

    print(model.summary())

    model_dir = os.path.join(current_dir, "..", "backend", "model")
    os.makedirs(model_dir, exist_ok=True)
    target_model_path = os.path.join(model_dir, "plant_model.h5")
    
    checkpoint = ModelCheckpoint(target_model_path, monitor='val_accuracy', save_best_only=True, mode='max', verbose=1)
    early_stop = EarlyStopping(monitor='val_accuracy', patience=5, restore_best_weights=True)

    # Compute class weights to handle imbalanced dataset
    import numpy as np
    from sklearn.utils.class_weight import compute_class_weight
    labels = train_data.classes
    classes_arr = np.unique(labels)
    try:
        cw = compute_class_weight('balanced', classes=classes_arr, y=labels)
        class_weight_dict = dict(zip(classes_arr, cw))
    except Exception:
        class_weight_dict = None

    print("Starting training...")
    history = model.fit(
        train_data,
        epochs=20,
        validation_data=valid_data,
        callbacks=[checkpoint, early_stop],
        class_weight=class_weight_dict
    )

    print("Evaluating on test dataset...")
    test_loss, test_acc = model.evaluate(test_data)
    print(f"Test Accuracy: {test_acc:.4f}, Test Loss: {test_loss:.4f}")
    
    # Save final model explicitly to ensure availability 
    model.save(target_model_path)
    print(f"Model saved to {target_model_path}")

if __name__ == "__main__":
    train_model()

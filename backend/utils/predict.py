import json
import os
import io
import numpy as np
import logging
import requests
import urllib.parse

try:
    from PIL import Image, ImageOps, UnidentifiedImageError
except ImportError:
    pass

try:
    import tensorflow as tf
    from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
    # Disable GPU warnings if no GPU
    os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
except ImportError:
    tf = None

current_dir = os.path.dirname(__file__)
PLANTS_DIR = os.path.join(current_dir, '..', 'plant_info')

def get_available_plants():
    plants = []
    if os.path.exists(PLANTS_DIR):
        for file in os.listdir(PLANTS_DIR):
            if file.endswith('.json'):
                plants.append(file.replace('.json', ''))
    return plants

AVAILABLE_JSON_PLANTS = get_available_plants()

# The model and classes (lazy loaded)
model = None
class_names = []

# Mock model class for when TensorFlow is unavailable
class MockPlantModel:
    """Fallback model for plant identification using image heuristics"""
    def __init__(self):
        self.available_plants = AVAILABLE_JSON_PLANTS
        self.predictions_map = {
            'tulsi': 'tulsi',
            'rose': 'rose',
            'mint': 'mint',
            'neem': 'neem',
            'turmeric': 'turmeric',
            'ginger': 'ginger',
            'brahmi': 'brahmi',
            'aloe': 'aloe_vera',
            'curry': 'curry',
            'hibiscus': 'hibiscus',
        }
        self.input_shape = (None, 224, 224, 3)
    
    def predict(self, img_array):
        """
        Mock prediction based on simple color/brightness analysis
        Returns confidence scores for available plants
        """
        # Convert image array to analyze colors
        img = img_array[0]
        
        # Simple color analysis
        green_score = np.mean(img[:, :, 1]) / 255.0  # Green channel
        red_score = np.mean(img[:, :, 0]) / 255.0    # Red channel
        brightness = np.mean(img) / 255.0
        
        # Simulate plant predictions based on color heuristics
        predictions = np.zeros(len(self.available_plants))
        
        if green_score > 0.4:  # Green-heavy = likely herb
            predictions[self.available_plants.index('tulsi')] = 0.65 + green_score * 0.1
        
        if red_score > 0.35:   # Red-heavy = could be rose/hibiscus
            if 'rose' in self.available_plants:
                predictions[self.available_plants.index('rose')] = 0.55 + red_score * 0.1
            if 'hibiscus' in self.available_plants:
                predictions[self.available_plants.index('hibiscus')] = 0.45 + red_score * 0.05
        
        if brightness > 0.6:  # Bright = flowering plant
            if 'marigold' in self.available_plants:
                predictions[self.available_plants.index('marigold')] = 0.48
            if 'rose' in self.available_plants:
                predictions[self.available_plants.index('rose')] = max(predictions[self.available_plants.index('rose')], 0.45)
        
        # Assign remaining confidence to random plants
        if np.sum(predictions) < 0.3:
            idx = np.random.randint(0, len(predictions))
            predictions[idx] = 0.5 + np.random.rand() * 0.3
        
        # Normalize to sum to 1
        total = np.sum(predictions)
        if total == 0:
            predictions[0] = 1.0
        else:
            predictions = predictions / np.sum(predictions)
        
        return [predictions]

def load_ai_assets():
    global model, class_names
    if tf is None:
        logging.error("TensorFlow is not installed. Please run: pip install tensorflow")
        return False
        
    model_path = os.path.join(current_dir, '..', 'model', 'plant_model.h5')
    classes_path = os.path.join(current_dir, '..', 'classes.json')
    
    logging.info(f"Attempting to load classes from: {classes_path}")
    logging.info(f"Attempting to load model from: {model_path}")
    
    if os.path.exists(classes_path):
        try:
            with open(classes_path, 'r') as f:
                class_names = json.load(f)
            logging.info(f"Successfully loaded {len(class_names)} plant classes")
        except Exception as e:
            logging.error(f"Failed to load classes.json: {e}")
            return False
    else:
        logging.error(f"Cannot find classes.json at {classes_path}")
        return False
        
    if os.path.exists(model_path):
        try:
            if model is None:
                logging.info(f"Loading model from {model_path}...")
                model = tf.keras.models.load_model(model_path)
                logging.info(f"Model loaded successfully. Shape: {model.input_shape}")
            return True
        except Exception as e:
            logging.error(f"Failed to load MobileNetV2 model: {str(e)}")
            import traceback
            logging.error(f"Traceback: {traceback.format_exc()}")
            return False
    else:
        logging.error(f"Cannot find model at {model_path}. Please ensure model file exists.")
        return False

def format_name_for_regex(name):
    return ''.join(e for e in name if e.isalnum()).lower()

def match_plant_in_db(predicted_name):
    pred_clean = format_name_for_regex(predicted_name)
    
    # Check exact substring map with both directions for more robust matching
    for json_name in AVAILABLE_JSON_PLANTS:
        json_clean = format_name_for_regex(json_name)
        if json_clean == pred_clean or json_clean in pred_clean or pred_clean in json_clean:
            return json_name
            
    # Aliases
    aliases = {
        "tulasi": "tulsi",
        "holy basil": "tulsi",
        "mint": "mint",
        "peppermint": "mint",
        "neem": "neem",
        "aloe": "aloe_vera",
        "aloevera": "aloe_vera",
        "aloe_vera": "aloe_vera",
        "coriander": "coriander",
        "dhania": "coriander",
        "curry": "curry",
        "peepal": "peepal",
        "bamboo": "bamboo",
        "brahmi": "brahmi",
        "ginger": "ginger",
        "hibiscus": "hibiscus",
        "mango": "mango",
        "marigold": "marigold",
        "onion": "onion",
        "papaya": "papaya",
        "rose": "rose",
        "turmeric": "turmeric"
    }
    
    for alias, json_name in aliases.items():
        if alias in pred_clean:
            if json_name in AVAILABLE_JSON_PLANTS:
                return json_name
                
    return None

def search_plant_globally(plant_name):
    """
    Search for plant information globally using Trefle Plant Database API
    Falls back to other sources if needed
    """
    try:
        # Try Trefle API (free plant database)
        search_name = urllib.parse.quote(plant_name.strip())
        url = f"https://trefle.io/api/v1/plants/search?q={search_name}"
        
        timeout = 5
        response = requests.get(url, timeout=timeout)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('data') and len(data['data']) > 0:
                plant = data['data'][0]
                return {
                    "plantName": plant.get('common_name') or plant.get('scientific_name') or plant_name,
                    "scientificName": plant.get('scientific_name', ''),
                    "properties": [],
                    "dosha": "tridoshic",
                    "benefits": ["Consult with an Ayurvedic practitioner for usage"],
                    "therapyRecommendations": ["Research this plant before use"],
                    "confidence": 60,
                    "source": "global_database",
                    "image_url": plant.get('image_url')
                }
    except Exception as e:
        logging.warning(f"Global plant search failed for '{plant_name}': {str(e)}")
    
    return None


def predict_plant(image_bytes, image_bytes_optional=None):
    if image_bytes_optional is not None:
        image_bytes = image_bytes_optional

    # Try to load AI assets
    assets_loaded = load_ai_assets()
    
    if not assets_loaded:
        logging.warning("AI model not available. Attempting fallback mode using image analysis.")
        # Fallback: Basic image analysis without ML model
        return fallback_plant_identification(image_bytes)
        
    try:
        # 1. Parse Image safely
        try:
            image = Image.open(io.BytesIO(image_bytes))
            image.verify()
            image = Image.open(io.BytesIO(image_bytes))  # Re-open after verify
            image = ImageOps.exif_transpose(image)
        except Exception:
             return {"status": "error", "message": "Invalid or corrupted image file"}
             
        if image.width < 50 or image.height < 50:
             return {"status": "error", "message": "Invalid or corrupted image file"}
             
        # 2. Resize and preprocess for MobileNetV2
        image = image.convert("RGB")
        try:
            resample_mode = Image.Resampling.LANCZOS
        except AttributeError:
            resample_mode = Image.LANCZOS
        image = image.resize((224, 224), resample=resample_mode)
        img_array = np.array(image)
        
        # Add batch dimension and apply mobilenet_v2 preprocess_input
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)
        
        # 3. Predict
        predictions = model.predict(img_array)[0]
        
        # Get top 3
        top_indices = predictions.argsort()[-3:][::-1]
        top_3 = []
        for i in top_indices:
            top_3.append({
                "plant": class_names[i],
                "confidence": float(predictions[i])
            })
            
        # Pick the first supported plant from top predictions
        selected_plant = None
        chosen_prediction = top_3[0]
        for item in top_3:
            supported_plant = match_plant_in_db(item["plant"])
            logging.info(f"Checking prediction '{item['plant']}' -> matched: {supported_plant}")
            if supported_plant:
                selected_plant = supported_plant
                chosen_prediction = item
                break

        if not selected_plant:
            top_class = top_3[0]['plant']
            logging.warning(f"No plant match found locally for predictions: {[p['plant'] for p in top_3]}")
            
            # Try global search as fallback
            logging.info(f"Attempting global search for: {top_class}")
            global_result = search_plant_globally(top_class)
            
            if global_result:
                logging.info(f"Found globally: {global_result['plantName']}")
                return {
                    "status": "success",
                    "message": f"Plant identified from global database",
                    "predictions": top_3,
                    "data": global_result
                }
            
            return {
                "status": "error",
                "message": f"'{top_class}' not found in local or global database. Try a clearer image.",
                "predictions": top_3
            }

        top_class = chosen_prediction['plant']
        top_confidence = chosen_prediction['confidence']

        logging.info(f"Top prediction: {top_class} ({top_confidence:.2f}) -> matched to: {selected_plant}")

        # 5. Fetch JSON mapped metadata
        json_path = os.path.join(PLANTS_DIR, f'{selected_plant}.json')
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            data['confidence'] = round(top_confidence * 100, 1)  # Frontend expects percentage
            
            status = "success"
            message = ""
            if top_confidence < 0.6:
                status = "uncertain"
                message = "Low confidence result. Try a clearer image."
                
            return {
                "status": status,
                "message": message,
                "predictions": top_3,
                "data": data
            }
            
    except Exception as e:
        logging.error(f"Prediction failed: {e}")
        import traceback
        logging.error(traceback.format_exc())
        return {"status": "error", "message": f"Prediction error: {str(e)}"}

def fallback_plant_identification(image_bytes):
    """
    Fallback identification when model is not available
    Provides basic plant detection without ML model
    """
    try:
        image = Image.open(io.BytesIO(image_bytes))
        image.verify()
        logging.info(f"Fallback mode: Image validated. Size: {image.width}x{image.height}")
        
        # Return success with available plants as suggestions
        available = AVAILABLE_JSON_PLANTS
        message = f"Model unavailable. Please check the logs. Available plants to search: {', '.join(available[:5])}..."
        
        return {
            "status": "error",
            "message": message,
            "suggestions": available
        }
    except Exception as e:
        logging.error(f"Fallback identification failed: {e}")
        return {
            "status": "error",
            "message": "Unable to process image. Please check system logs."
        }

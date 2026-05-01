import json
import os
import requests
import logging

current_dir = os.path.dirname(__file__)
PLANTS_DIR = os.path.join(current_dir, '..', 'plant_info')

# Use provided PlantNet API key
PLANTNET_API_KEY = os.getenv("PLANTNET_API_KEY", "2b10lFlNZbcdgVmT2fvxm8ZsKu")
PLANTNET_API_URL = f"https://my-api.plantnet.org/v2/identify/all?api-key={PLANTNET_API_KEY}"

def get_available_plants():
    plants = []
    if os.path.exists(PLANTS_DIR):
        for file in os.listdir(PLANTS_DIR):
            if file.endswith('.json'):
                plants.append(file.replace('.json', ''))
    return plants

AVAILABLE_JSON_PLANTS = get_available_plants()

# Map scientific names or common names from PlantNet to our JSON files
SCIENTIFIC_NAME_MAP = {
    "aloe vera": "aloe_vera",
    "bambusoideae": "bamboo",
    "bambusa": "bamboo",
    "bacopa monnieri": "brahmi",
    "centella asiatica": "brahmi",
    "coriandrum sativum": "coriander",
    "murraya koenigii": "curry",
    "zingiber officinale": "ginger",
    "hibiscus rosa-sinensis": "hibiscus",
    "hibiscus": "hibiscus",
    "mangifera indica": "mango",
    "tagetes": "marigold",
    "mentha": "mint",
    "azadirachta indica": "neem",
    "allium cepa": "onion",
    "carica papaya": "papaya",
    "ficus religiosa": "peepal",
    "rosa": "rose",
    "ocimum tenuiflorum": "tulsi",
    "ocimum basilicum": "tulsi",
    "curcuma longa": "turmeric"
}

def format_name_for_regex(name):
    return ''.join(e for e in name if e.isalnum()).lower()

def match_plant_in_db(scientific_name, common_names):
    sn_clean = scientific_name.lower().strip()
    
    # Check exact scientific name match
    for key, val in SCIENTIFIC_NAME_MAP.items():
        if key in sn_clean or sn_clean in key:
            if val in AVAILABLE_JSON_PLANTS:
                return val

    # Check common names
    for common in common_names:
        c_clean = format_name_for_regex(common)
        for json_name in AVAILABLE_JSON_PLANTS:
            if json_name in c_clean:
                return json_name
                
    return None

def predict_plant(image_bytes, image_bytes_optional=None):
    if image_bytes_optional is not None:
        image_bytes = image_bytes_optional

    try:
        # Send to PlantNet API
        files = [
            ('images', ('image.jpg', image_bytes, 'image/jpeg'))
        ]
        data = {
            'organs': ['auto']
        }
        
        logging.info("Sending image to PlantNet API...")
        response = requests.post(PLANTNET_API_URL, files=files, data=data)
        
        if response.status_code != 200:
            logging.error(f"PlantNet API error: {response.status_code} - {response.text}")
            return {"status": "error", "message": "Failed to identify plant via Computer Vision API. Please try again later."}
            
        result = response.json()
        
        if 'results' not in result or len(result['results']) == 0:
            return {"status": "error", "message": "No plant recognized in this image. Please try a clearer photo."}
            
        # Parse top 3 predictions
        top_3 = []
        for res in result['results'][:3]:
            species = res.get('species', {})
            sci_name = species.get('scientificNameWithoutAuthor', '')
            common_names = species.get('commonNames', [])
            score = float(res.get('score', 0))
            
            display_name = common_names[0] if common_names else sci_name
            
            top_3.append({
                "plant": display_name,
                "scientificName": sci_name,
                "commonNames": common_names,
                "confidence": score
            })
            
        # Find local match for the best result
        selected_plant = None
        chosen_prediction = top_3[0]
        
        for item in top_3:
            matched = match_plant_in_db(item['scientificName'], item['commonNames'])
            if matched:
                selected_plant = matched
                chosen_prediction = item
                break
                
        if not selected_plant:
            # Fallback to returning generic data if no local JSON match
            top_class = top_3[0]['plant']
            return {
                "status": "success",
                "message": f"Identified as {top_class}, but detailed Ayurvedic information is not yet available in our database.",
                "predictions": top_3,
                "data": {
                    "plantName": top_class,
                    "scientificName": top_3[0]['scientificName'],
                    "confidence": round(top_3[0]['confidence'] * 100, 1),
                    "properties": [],
                    "dosha": "unknown",
                    "benefits": ["Information not available locally."],
                    "therapyRecommendations": []
                }
            }
            
        # Return local JSON data
        top_confidence = chosen_prediction['confidence']
        json_path = os.path.join(PLANTS_DIR, f'{selected_plant}.json')
        
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            data['confidence'] = round(top_confidence * 100, 1)
            # Update the scientific name with the highly accurate one from PlantNet
            data['scientificName'] = chosen_prediction['scientificName']
            
            status = "success"
            message = ""
            if top_confidence < 0.3:
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

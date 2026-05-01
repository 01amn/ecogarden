import os
import json
import requests
import time
import urllib.request
import urllib.parse
from concurrent.futures import ThreadPoolExecutor

# Constants
current_dir = os.path.dirname(__file__)
plants_dir = os.path.abspath(os.path.join(current_dir, '..', 'backend', 'plant_info'))
dataset_dir = os.path.abspath(os.path.join(current_dir, '..', 'dataset', 'extracted', 'Medicinal Leaf dataset'))
IMAGES_PER_CLASS = 150  # Balanced dataset size

# Fallback scientific names if JSON is missing or API fails to find it
FALLBACK_NAMES = {
    'aloe_vera': 'Aloe vera',
    'bamboo': 'Bambusoideae',
    'brahmi': 'Bacopa monnieri',
    'curry': 'Murraya koenigii',
    'ginger': 'Zingiber officinale',
    'hibiscus': 'Hibiscus',
    'mango': 'Mangifera indica',
    'marigold': 'Tagetes',
    'mint': 'Mentha',
    'neem': 'Azadirachta indica',
    'onion': 'Allium cepa',
    'papaya': 'Carica papaya',
    'peepal': 'Ficus religiosa',
    'rose': 'Rosa',
    'tulsi': 'Ocimum tenuiflorum',
    'turmeric': 'Curcuma longa',
    'coriander': 'Coriandrum sativum'
}

def get_plants():
    plants = []
    if not os.path.exists(plants_dir):
        print(f"Warning: {plants_dir} does not exist.")
        return []
        
    for file in os.listdir(plants_dir):
        if file.endswith('.json'):
            class_name = file.replace('.json', '')
            try:
                with open(os.path.join(plants_dir, file), 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    sci_name = data.get('scientificName', FALLBACK_NAMES.get(class_name, class_name))
                    plants.append((class_name, sci_name))
            except Exception as e:
                print(f"Error reading {file}: {e}")
                sci_name = FALLBACK_NAMES.get(class_name, class_name)
                plants.append((class_name, sci_name))
                
    # Also add any missing from fallback just in case
    existing_classes = [p[0] for p in plants]
    for c, s in FALLBACK_NAMES.items():
        if c not in existing_classes:
            plants.append((c, s))
            
    return plants

def get_taxon_id(scientific_name):
    query = urllib.parse.quote(scientific_name)
    url = f"https://api.inaturalist.org/v1/taxa?q={query}&is_active=true&rank=species,genus,subfamily"
    try:
        response = requests.get(url, headers={"User-Agent": "EcoHerbalGarden/1.0"}, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get('results') and len(data['results']) > 0:
                # Get the first result's ID
                return data['results'][0]['id']
    except Exception as e:
        print(f"  -> Error finding taxon for {scientific_name}: {e}")
    return None

def download_image(url, save_path):
    try:
        urllib.request.urlretrieve(url, save_path)
        return True
    except Exception:
        return False

def download_for_class(class_name, scientific_name):
    print(f"\n--- Processing '{class_name}' ({scientific_name}) ---")
    class_dir = os.path.join(dataset_dir, class_name)
    os.makedirs(class_dir, exist_ok=True)
    
    # Check existing images count to avoid re-downloading
    existing_images = [f for f in os.listdir(class_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    existing_count = len(existing_images)
    
    if existing_count >= IMAGES_PER_CLASS:
        print(f"  -> Already have {existing_count} images for {class_name}, skipping.")
        return
        
    taxon_id = get_taxon_id(scientific_name)
    if not taxon_id:
        print(f"  -> Could not find iNaturalist taxon ID for {scientific_name}. Trying base name...")
        # Try generic name if scientific name fails
        base_name = scientific_name.split()[0]
        taxon_id = get_taxon_id(base_name)
        if not taxon_id:
            print(f"  -> Still couldn't find taxon. Skipping.")
            return
            
    print(f"  -> Taxon ID: {taxon_id}. Fetching observations...")
    
    images_to_fetch = IMAGES_PER_CLASS - existing_count
    urls = []
    page = 1
    
    # Fetch image URLs from iNaturalist
    while len(urls) < images_to_fetch and page <= 5:
        url = f"https://api.inaturalist.org/v1/observations?taxon_id={taxon_id}&has[]=photos&quality_grade=research&per_page=100&page={page}"
        try:
            response = requests.get(url, headers={"User-Agent": "EcoHerbalGarden/1.0"}, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if not data.get('results'):
                    break
                for obs in data['results']:
                    if 'photos' in obs and obs['photos']:
                        # Get medium sized photo instead of thumbnail/square
                        photo_url = obs['photos'][0]['url'].replace('square', 'medium')
                        urls.append(photo_url)
                        if len(urls) >= images_to_fetch:
                            break
            else:
                break
        except Exception as e:
            print(f"  -> Error fetching page {page}: {e}")
            break
        page += 1
        time.sleep(1.5) # Rate limiting
        
    urls = urls[:images_to_fetch]
    if not urls:
        print(f"  -> No photos found for {class_name}.")
        return
        
    print(f"  -> Found {len(urls)} new image URLs. Downloading concurrently...")
    
    images_downloaded = 0
    # Use ThreadPool to download images concurrently (much faster)
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = []
        for i, url in enumerate(urls):
            filename = f"inat_{int(time.time())}_{i}.jpg"
            save_path = os.path.join(class_dir, filename)
            futures.append(executor.submit(download_image, url, save_path))
            
        for future in futures:
            if future.result():
                images_downloaded += 1
                
    print(f"  -> Successfully downloaded {images_downloaded} images.")

def main():
    print(f"Target dataset directory: {dataset_dir}")
    os.makedirs(dataset_dir, exist_ok=True)
    
    plants = get_plants()
    print(f"Found {len(plants)} plants in database.")
    
    for class_name, sci_name in plants:
        download_for_class(class_name, sci_name)
        time.sleep(2) # Rate limit between classes

if __name__ == '__main__':
    main()

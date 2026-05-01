from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.predict import predict_plant
import logging

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)

@app.route("/api/scan", methods=["POST"])
def scan_plant():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    
    image = request.files['image']
    if image.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    content = image.read()
    try:
        result = predict_plant(content)
        return jsonify(result), 200
    except Exception as e:
        logging.error(f"Error processing image: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    # Ensure dataset setup doesn't crash this
    app.run(host="0.0.0.0", port=8000, debug=True)

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from utils.predict import predict_plant
import uvicorn

app = FastAPI()

# Allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def scan_plant(image: UploadFile = File(...)):
    """
    Endpoint to receive an image and return the identified plant's info using MobileNetV2.
    """
    try:
        filename = image.filename.lower()
        if not (filename.endswith('.jpg') or filename.endswith('.jpeg') or filename.endswith('.png')):
            return {"status": "error", "message": "Invalid or corrupted image file"}
            
        content = await image.read()
        
        # Using predict_plant
        result = predict_plant(content)
        return result
    except Exception as e:
        return {"status": "error", "message": f"Server error: {str(e)}"}

@app.post("/api/scan")
async def scan_plant_api(image: UploadFile = File(...)):
    return await scan_plant(image)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

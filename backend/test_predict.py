import sys
import os

# Add backend directory to path so we can import utils
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from utils.predict import predict_plant

print("Testing Mint.jpg:")
print(predict_plant("Mint.jpg"))

print("\nTesting Aloe Vera.jpg:")
print(predict_plant("Aloe Vera.jpg"))

print("\nTesting Unknown.png:")
print(predict_plant("Unknown.png"))

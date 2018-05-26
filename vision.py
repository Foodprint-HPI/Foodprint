import os
import pickle

# Imports the Google Cloud client library
from google.cloud import vision
from google.cloud.vision import types

FILE = 'spaghetti'

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "veggify-903c7a7c494e.json"

client = vision.ImageAnnotatorClient()

with open(f'{FILE}.jpg', 'rb') as image_file:
    content = image_file.read()

image = types.Image(content=content)

response = client.label_detection(image=image)
labels = response.label_annotations

import pdb; pdb.set_trace()  # noqa: E702

with open(f'{FILE}.pkl', 'wb') as output:
    pickle.dump(response, output, pickle.HIGHEST_PROTOCOL)

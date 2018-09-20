
import os
import pickle

# Imports the Google Cloud client library
from google.cloud import vision
from google.cloud.vision import types

creds = os.getenv('GOOGLE_APPLICATION_CREDENTIALS_DICT')

if creds:
    with open('veggify-903c7a7c494e.json', 'w') as f:
        f.write(creds)

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "veggify-903c7a7c494e.json"

client = vision.ImageAnnotatorClient()


class MealMatcher:

    @staticmethod
    def save_labels(hash_value, labels):
        with open(f'/tmp/{hash_value}.pkl', 'wb') as f:
            pickle.dump([l for l in labels], f, pickle.HIGHEST_PROTOCOL)

    @staticmethod
    def load_labels(hash_value):
        try:
            with open(f'/tmp/{hash_value}.pkl', 'rb') as f:
                return pickle.load(f)
        except FileNotFoundError:
            return None

    @staticmethod
    def query_labels(hash_value):

        labels = MealMatcher.load_labels(hash_value)

        if not labels:

            with open(f'/tmp/images/{hash_value}.jpg', 'rb') as f:
                content = f.read()
            print("Querying Google...")
            image = types.Image(content=content)
            response = client.label_detection(image=image)
            labels = response.label_annotations

            labels = [{
              'description': label.description,
              'score': label.score,
            } for label in labels
            ]
            MealMatcher.save_labels(hash_value, labels)

        return labels

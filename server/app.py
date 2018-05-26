import os

import xxhash
from flask import (
    Flask,
    jsonify,
    request,
)
from flask_heroku import Heroku
from flask_cors import CORS, cross_origin
from flask_uploads import UploadSet, configure_uploads, IMAGES
from flask_sqlalchemy import SQLAlchemy

from server.analyze import MealMatcher

app = Flask(__name__)

heroku = Heroku(app)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

db = SQLAlchemy(app)

from server.models import Meal
from server.models import Dish
photos = UploadSet('photos', IMAGES)

app.config['UPLOADED_PHOTOS_DEST'] = '/tmp/images/'
configure_uploads(app, photos)


@app.route('/api/v1/', methods=['GET'])
@cross_origin()
def play_command():
    return jsonify(status=200, db=app.config['SQLALCHEMY_DATABASE_URI']), 200


@app.route('/api/v1/photo/<hash_value>', methods=['GET'])
def get_labels(hash_value):
    if request.method == 'GET' and hash_value:
        labels = MealMatcher.load_labels(hash_value)
        return jsonify(results=labels)


@app.route('/api/v1/upload', methods=['POST'])
def upload_picture():
    if request.method == 'POST' and 'photo' in request.files:
        content = request.files['photo'].read()
        request.files['photo'].seek(0)
        hash_value = xxhash.xxh64(content).hexdigest()

        filename = f'/tmp/images/{hash_value}.jpg'

        if os.path.exists(filename):
            existing_meal = Meal.query.filter_by(picture=hash_value).first()
            Meal(recipe="", picture=hash_value, dish_id=existing_meal.id)
            return jsonify(status=201)

        photos.save(
            request.files['photo'],
            name=filename
        )
        meal = Meal(recipe="", picture=hash_value)
        print("meal created", meal)
        db.session.add(meal)
        db.session.commit()
        labels = MealMatcher.query_labels(hash_value)
        validate_labels(meal, labels)
        return jsonify(status=201)
    return jsonify(status=204)


@app.route('/api/v1/meal/add', methods=['POST'])
def meal_add():
    if request.method == 'POST' and 'recipe' in request.form:
        recipe = request.form['recipe']
        meal = Meal(recipe=recipe, picture="")
        print("meal created", meal)
        db.session.add(meal)
        db.session.commit()
        return jsonify(status=201), 201
    return jsonify(status=500), 500


@app.route('/api/v1/meal', methods=['GET'])
def get_all_meals():
    if request.method == 'GET':
        return jsonify(meals=Meal.query.all()), 200
    return jsonify(status=500), 500


@app.route('/api/v1/meal/<meal_id>', methods=['GET'])
def get_meal(meal_id):
    if request.method == 'GET' and int(meal_id) > 0:
        return jsonify(meal=Meal.query.filter_by(id=meal_id).first()), 200
    return jsonify(status=500), 500


if __name__ == '__main__':
    app.run(debug=True)


def validate_labels(meal, labels):
    for label in labels:
        updated_meal = match_dish(meal, label['description'])
        if updated_meal:
            return


def calculate_footprint(dish: dict):
    carbon_sum = 0.0
    for ingredient, count in dish.items():
        carbon_sum += CO2_MAP_IN_KG[ingredient] * count
    return carbon_sum


def match_dish(meal: Meal, name: str):
    if not name:
        raise ValueError('A dish name is required')
    if Dish.query.filter_by(name=name).count():
        matched_dish = Dish.query.filter(name=name).first()
    else:
        if name.lower() not in RECOGNIZED_DISHES:
          return
        dish = RECOGNIZED_DISHES[name.lower()]
        matched_dish = Dish(name=name, co2=calculate_footprint(dish))
        db.session.add(matched_dish)
        db.session.commit()
    if not matched_dish:
        print(f'Unable to match {name}')
        return
    meal.dish_id = matched_dish.id
    db.session.commit()
    return meal


CO2_MAP_IN_KG = {
    'beef': 27.0,
    'noodles': 2.9,
    'onion': 2.9,
    'tomato': 1.2,
    'potatoe': 1.1,
    'egg': 4.8,
    'milk': 1.9,
    'flour': 0.6,
    'sugar': 3.8
}

RECOGNIZED_DISHES = {
    'spaghetti': {
        'beef': 0.15,
        'noodles': 0.15,
        'tomato': 0.05,
        'onion': 0.02,
    },
    'schnitzel': {
        'beef': 0.3,
        'potatoe': 0.25
    },
    'pancake': {
        'sugar': 0.05,
        'egg': 0.2,
        'flour': 0.2,
        'milk': 0.6
    }
}

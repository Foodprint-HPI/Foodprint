import os

import xxhash
from flask import (
    Flask,
    jsonify,
    request,
    make_response
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
        if not os.path.exists(filename):
            filename = photos.save(
                request.files['photo'],
                name=filename
            )
            meal = Meal(recipe="", picture=filename)
            print("meal created", meal)
            # db.session.add(meal)
            # db.session.commit()
        MealMatcher.query_labels(hash_value)
        return jsonify(hash_id=hash_value), 201
    return jsonify(), 204


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


def match_dish(meal: Meal, name: str):
    if not meal:
        raise ValueError('A meal is required')
    if not name:
        raise ValueError('A dish name is required')
    matched_dish = Dish.query.filter_by(Dish.name.like(f'%{name}%')).first()
    if not matched_dish:
        print(f'Unable to match {name}')
        return
    meal.recipe = matched_dish.id
    db.session.commit()

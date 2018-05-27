import os
import shutil
import re

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
from server.whitelist import (
    CO2_MAP_IN_KG,
    RECOGNIZED_DISHES,
    MEALS_THIS_WEEK,
)
from server.recipes import Recipes


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
        meal_type = request.form['meal']
        if meal_type not in Meal.TYPES:
            return jsonify({'failure': 'invalid_meal_type'}), 400
        meal = Meal(recipe="", picture=hash_value, label=meal_type)
        db.session.add(meal)
        db.session.commit()
        labels = MealMatcher.query_labels(hash_value)
        validate_labels(meal, labels)
        return jsonify(hash_id=hash_value), 201
    return jsonify({}), 204


@app.route('/api/v1/meal/add', methods=['POST'])
def meal_add():
    if request.method == 'POST' and 'recipe' in request.form:
        recipe = request.form['recipe']
        meal = Meal(recipe=recipe, picture="")
        db.session.add(meal)
        db.session.commit()
        return jsonify(status=201), 201
    return jsonify(status=500), 500


@app.route('/api/v1/meal', methods=['GET'])
def get_all_meals():
    if request.method == 'GET':
        return jsonify([meal.serialize for meal in Meal.query.all()]), 200
    return jsonify(status=500), 500


@app.route('/api/v1/meal/<hash_value>', methods=['GET'])
def get_meal(hash_value):
    if request.method == 'GET' and hash_value:
        result = Meal.query.filter_by(picture=hash_value).first()
        if result:
            return jsonify(Meal.query.filter_by(picture=hash_value).first().serialize), 200
        else:
            return jsonify({}), 404
    return jsonify(status=500), 500


@app.route('/api/v1/recipe/<name>', methods=['GET'])
def get_recipe(name):
    ingredients = Recipes.ingredients(name)
    if ingredients:
        return jsonify({'ingredients': ingredients})
    else:
        return jsonify({'ingredients': []}), 404

# def purge(dir, pattern):
#     for f in os.listdir(dir):
#         if re.search(pattern, f):
#             os.remove(os.path.join(dir, f))


@app.route('/api/v1/reset', methods=['GET', 'POST'])
def reset():
    db.engine.execute("DELETE FROM meal;")
    db.engine.execute("DELETE FROM dish;")
    db.engine.execute("ALTER SEQUENCE meal_id_seq RESTART WITH 1")
    db.engine.execute("ALTER SEQUENCE dish_id_seq RESTART WITH 1")
    try:
        shutil.rmtree('/tmp/images')
    except FileNotFoundError:
        pass
    # purge('/tmp/', r".*\.pkl")
    return jsonify({'success': True})


@app.route('/api/v1/seed', methods=['GET', 'POST'])
def seed():
    try:
        for row in MEALS_THIS_WEEK:
            db.engine.execute(row)
        return jsonify({'success': True})
    except Exception as e:
        return ({'e': e}), 400


@app.route('/api/v1/week/now', methods=['POST'])
def weekly_sum():
    group = request.form.get('group', False)
    QUERY = f"""
        SELECT {'meal.label, ' if group else '' } SUM(dish.co2)
        FROM dish, meal
        WHERE dish.id = meal.dish_id
        AND extract('week' from created) = extract('week' from CURRENT_TIMESTAMP)
        {'GROUP BY meal.label' if group else '' }
    """
    result = [row for row in db.engine.execute(QUERY)]
    return jsonify({'result': result[0][0]})


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
        matched_dish = Dish.query.filter_by(name=name).first()
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


if __name__ == '__main__':
    app.run(debug=True)

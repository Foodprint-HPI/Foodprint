from flask import (
    Flask,
    jsonify,
    request,
)
from flask_heroku import Heroku
from flask_cors import CORS, cross_origin
from flask_uploads import UploadSet, configure_uploads, IMAGES

from flask_sqlalchemy import SQLAlchemy

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


@app.route('/', methods=['GET'])
@cross_origin()
def play_command():
    return jsonify(status=200, db=app.config['SQLALCHEMY_DATABASE_URI'])


@app.route('/upload', methods=['POST'])
def upload_picture():
    if request.method == 'POST' and 'photo' in request.files:
        filename = photos.save(request.files['photo'])
        meal = Meal(recipe="", picture=filename)
        print("meal created", meal)
        # db.session.add(meal)
        # db.session.commit()
        return jsonify(status=201)
    return jsonify(status=500)


@app.route('/meal/add', methods=['POST'])
def meal_add():
    if request.method == 'POST' and 'recipe' in request.form:
        recipe = request.form['recipe']
        meal = Meal(recipe=recipe, picture="")
        print("meal created", meal)
        db.session.add(meal)
        db.session.commit()
        return jsonify(status=201)
    return jsonify(status=500)


@app.route('/meal', methods=['GET'])
def get_all_meals():
    if request.method == 'GET':
        return jsonify(Meal.query().all())
    return jsonify(status=500)


@app.route('/meal/<meal_id>', methods=['GET'])
def get_meal(meal_id):
    if request.method == 'GET' and meal_id > 0:
        return jsonify(Meal.query().filter(id=meal_id))
    return jsonify(status=500)


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




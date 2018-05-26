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

photos = UploadSet('photos', IMAGES)

app.config['UPLOADED_PHOTOS_DEST'] = '/tmp/images/'
configure_uploads(app, photos)

@app.route('/', methods=['GET'])
@cross_origin()
def play_command():
    return jsonify(status=200, db=app.config['SQLALCHEMY_DATABASE_URI'])

@app.route('/upload', methods=['POST'])
def upload():
    if request.method == 'POST' and 'photo' in request.files:
        filename = photos.save(request.files['photo'])
        meal = Meal(id=id, recipe="", picture=filename)
        print("meal created", meal)
        db.session.add(meal)
        db.session.commit()
        return jsonify(status=201)
    return jsonify(status=500)

@app.route('/recipe/add', methods=['POST'])
def recipe_add():
    if request.method == 'POST' and 'recipe' in request.form:
        recipe = request.form['recipe']
        meal = Meal(id=id, recipe=recipe, picture="")
        print("meal created", meal)
        db.session.add(meal)
        db.session.commit()
        return jsonify(status=201)
    return jsonify(status=500)

if __name__ == '__main__':
    app.run(debug=True)

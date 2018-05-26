from flask import (
    Flask,
    jsonify,
)
from flask_heroku import Heroku
from flask_cors import CORS, cross_origin

app = Flask(__name__)

heroku = Heroku(app)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/', methods=['GET'])
@cross_origin()
def play_command():
    return jsonify(status=200, db=app.config['SQLALCHEMY_DATABASE_URI'])


if __name__ == '__main__':
    app.run(debug=True)

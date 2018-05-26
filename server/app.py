from flask import (
    Flask,
    jsonify,
)
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/', methods=['GET'])
@cross_origin()
def play_command():
    return jsonify(status=200)


if __name__ == '__main__':
    app.run(debug=True)

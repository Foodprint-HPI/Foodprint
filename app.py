from flask import (
    Flask,
    jsonify,
)

app = Flask(__name__)


@app.route('/', methods=['GET'])
def play_command():
    return jsonify(status=200)


if __name__ == '__main__':
    app.run(debug=True)

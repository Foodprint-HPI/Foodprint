from server.manage import db


class Dish(db.Model):
    __tablename__ = 'dish'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(512))
    co2 = db.Column(db.Float)
    meals = db.relationship('Meal', lazy=False)

    def __repr__(self):
        return f'<Dish {self.name}>'


class Meal(db.Model):
    __tablename__ = 'meal'

    id = db.Column(db.Integer, primary_key=True, unique=True)
    created = db.Column(db.DateTime, default=db.func.current_timestamp())
    recipe = db.Column(db.String(512))
    picture = db.Column(db.String(512))
    dish_id = db.Column(db.Integer, db.ForeignKey('dish.id'))

    def __repr__(self):
        return f'<Meal {self.id}>'


from server.manage import db


def dump_datetime(value):
    """Deserialize datetime object into string form for JSON processing."""
    if value is None:
        return None
    return [value.strftime("%Y-%m-%d"), value.strftime("%H:%M:%S")]


class Dish(db.Model):
    __tablename__ = 'dish'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(512))
    co2 = db.Column(db.Float)
    meals = db.relationship('Meal', lazy=False)

    def __repr__(self):
        return f'<Dish {self.name}>'

    @property
    def serialize(self):
       return {
            'id': self.id,
            'name': self.name,
            'co2': self.co2
       }


class Meal(db.Model):
    __tablename__ = 'meal'

    id = db.Column(db.Integer, primary_key=True, unique=True)
    created = db.Column(db.DateTime, default=db.func.current_timestamp())
    recipe = db.Column(db.String(512))
    picture = db.Column(db.String(512))
    label = db.Column(db.String(100))
    dish_id = db.Column(db.Integer, db.ForeignKey('dish.id'))
    dish = db.relationship('Dish', lazy=False)

    TYPES = ["Breakfast", "Lunch", "Coffee", "Dinner", "Other"]

    def __repr__(self):
        return f'<Meal {self.id}>'

    @property
    def serialize(self):
       return {
            'id': self.id,
            'name': self.dish.name,
            'co2': self.dish.co2,
            'created': self.created,
            'recipe': self.recipe,
            'picture': self.picture,
            'dish_id': self.dish_id
       }


from server.manage import db


class Meal(db.Model):
    __tablename__ = 'meal'

    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, index=True, unique=False)
    recipe = db.Column(db.String(512), index=True, unique=False)
    picture = db.Column(db.String(512), index=True, unique=False)
    dish = db.Column(db.Integer, db.ForeignKey('dish.id'), nullable=False)

    def __repr__(self):
        return f'<Meal {self.id}>'

class Dish(db.Model):
    __tablename__ = 'dish'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(512), index=True, unique=False)
    co2 = db.Column(db.Integer, primary_key=True)

    def __repr__(self):
        return f'<Dish {self.name}>'

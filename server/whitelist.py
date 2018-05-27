CO2_MAP_IN_KG = {
    'beef': 27.0,
    'noodles': 2.9,
    'onion': 2.9,
    'tomato': 1.2,
    'potatoe': 1.1,
    'egg': 4.8,
    'milk': 1.9,
    'flour': 0.6,
    'sugar': 3.8,
    'oatmeal': 0.5,
    'apple': 0.4,
    'iceberg': 0.2,
    'walnut': 0.95,
    'cheese': 13.5,
    'bread': 0.5
}

RECOGNIZED_DISHES = {
    'spaghetti': {
        'beef': 0.15,
        'noodles': 0.15,
        'tomato': 0.05,
        'onion': 0.02,
    },
    'schnitzel': {
        'beef': 0.3,
        'potatoe': 0.25
    },
    'pancake': {
        'sugar': 0.05,
        'egg': 0.2,
        'flour': 0.2,
        'milk': 0.6
    },
    'cereals': {
        'milk': 0.3,
        'oatmeal': 0.3,
        'apple': 0.2
    },
    'salad': {
        'iceberg': 0.3,
        'walnut': 0.1,
        'cheese': 0.1
    },
    'bread': {
        'bread': 0.3,
        'cheese': 0.1
    }
}

MEALS_THIS_WEEK = [
    # "INSERT INTO dish (name, co2) VALUES ('spaghetti', 4.63);",
    # "INSERT INTO dish (name, co2) VALUES ('schnitzel', 9.26);",
    # "INSERT INTO dish (name, co2) VALUES ('pancake', 2.41);",
    # "INSERT INTO dish (name, co2) VALUES ('cereals', 0.8);",
    # "INSERT INTO dish (name, co2) VALUES ('salad', 1.4);",
    # "INSERT INTO dish (name, co2) VALUES ('bread', 1.5);",

    "INSERT INTO meal (created, recipe, picture, label, dish_id) VALUES (to_timestamp('20-05-2018 07:36:38', 'dd-mm-yyyy hh24:mi:ss'), '', '', 'Breakfast', 4);",
    "INSERT INTO meal (created, recipe, picture, label, dish_id) VALUES (to_timestamp('21-05-2018 07:36:38', 'dd-mm-yyyy hh24:mi:ss'), '', '', 'Breakfast', 4);",
    "INSERT INTO meal (created, recipe, picture, label, dish_id) VALUES (to_timestamp('22-05-2018 07:36:38', 'dd-mm-yyyy hh24:mi:ss'), '', '', 'Breakfast', 4);",
    "INSERT INTO meal (created, recipe, picture, label, dish_id) VALUES (to_timestamp('23-05-2018 07:36:38', 'dd-mm-yyyy hh24:mi:ss'), '', '', 'Breakfast', 4);",
    "INSERT INTO meal (created, recipe, picture, label, dish_id) VALUES (to_timestamp('24-05-2018 07:36:38', 'dd-mm-yyyy hh24:mi:ss'), '', '', 'Breakfast', 4);",
    "INSERT INTO meal (created, recipe, picture, label, dish_id) VALUES (to_timestamp('25-05-2018 07:36:38', 'dd-mm-yyyy hh24:mi:ss'), '', '', 'Breakfast', 3);",
    "INSERT INTO meal (created, recipe, picture, label, dish_id) VALUES (to_timestamp('26-05-2018 07:36:38', 'dd-mm-yyyy hh24:mi:ss'), '', '', 'Breakfast', 4);",
    "INSERT INTO meal (created, recipe, picture, label, dish_id) VALUES (to_timestamp('26-05-2018 07:36:38', 'dd-mm-yyyy hh24:mi:ss'), '', '', 'Breakfast', 4);",

    "INSERT INTO meal (created, recipe, picture, label, dish_id) VALUES (to_timestamp('20-05-2018 12:36:38', 'dd-mm-yyyy hh24:mi:ss'), '', '', 'Lunch', 1);",
    "INSERT INTO meal (created, recipe, picture, label, dish_id) VALUES (to_timestamp('21-05-2018 12:36:38', 'dd-mm-yyyy hh24:mi:ss'), '', '', 'Lunch', 2);",
    "INSERT INTO meal (created, recipe, picture, label, dish_id) VALUES (to_timestamp('22-05-2018 12:36:38', 'dd-mm-yyyy hh24:mi:ss'), '', '', 'Lunch', 4);",
    "INSERT INTO meal (created, recipe, picture, label, dish_id) VALUES (to_timestamp('23-05-2018 12:36:38', 'dd-mm-yyyy hh24:mi:ss'), '', '', 'Lunch', 3);",
    "INSERT INTO meal (created, recipe, picture, label, dish_id) VALUES (to_timestamp('24-05-2018 12:36:38', 'dd-mm-yyyy hh24:mi:ss'), '', '', 'Lunch', 4);",
    "INSERT INTO meal (created, recipe, picture, label, dish_id) VALUES (to_timestamp('25-05-2018 12:36:38', 'dd-mm-yyyy hh24:mi:ss'), '', '', 'Lunch', 2);",
    "INSERT INTO meal (created, recipe, picture, label, dish_id) VALUES (to_timestamp('26-05-2018 12:36:38', 'dd-mm-yyyy hh24:mi:ss'), '', '', 'Lunch', 1);",

    "INSERT INTO meal (created, recipe, picture, label, dish_id) VALUES (to_timestamp('21-05-2018 15:36:38', 'dd-mm-yyyy hh24:mi:ss'), '', '', 'Coffee', 3);",

    "INSERT INTO meal (created, recipe, picture, label, dish_id) VALUES (to_timestamp('20-05-2018 18:36:38', 'dd-mm-yyyy hh24:mi:ss'), '', '', 'Dinner', 5);",
    "INSERT INTO meal (created, recipe, picture, label, dish_id) VALUES (to_timestamp('21-05-2018 18:36:38', 'dd-mm-yyyy hh24:mi:ss'), '', '', 'Dinner', 5);",
    "INSERT INTO meal (created, recipe, picture, label, dish_id) VALUES (to_timestamp('22-05-2018 18:36:38', 'dd-mm-yyyy hh24:mi:ss'), '', '', 'Dinner', 4);",
    "INSERT INTO meal (created, recipe, picture, label, dish_id) VALUES (to_timestamp('23-05-2018 18:36:38', 'dd-mm-yyyy hh24:mi:ss'), '', '', 'Dinner', 4);",
    "INSERT INTO meal (created, recipe, picture, label, dish_id) VALUES (to_timestamp('24-05-2018 18:36:38', 'dd-mm-yyyy hh24:mi:ss'), '', '', 'Dinner', 5);",
    "INSERT INTO meal (created, recipe, picture, label, dish_id) VALUES (to_timestamp('25-05-2018 18:36:38', 'dd-mm-yyyy hh24:mi:ss'), '', '', 'Dinner', 5);",
    "INSERT INTO meal (created, recipe, picture, label, dish_id) VALUES (to_timestamp('26-05-2018 18:36:38', 'dd-mm-yyyy hh24:mi:ss'), '', '', 'Dinner', 4);",
]

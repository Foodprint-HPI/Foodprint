import re

import requests
from bs4 import BeautifulSoup


class Recipes:
    SORT_BY_RATING = False

    @classmethod
    def recipe_link_for_dish(cls, dish_name='Waffle'):
        resp = requests.get(
            f'https://www.allrecipes.com/search/results/?wt={dish_name}&sort=re'
        )

        soup = BeautifulSoup(resp.content, 'html.parser')

        results = soup.findAll("span", {
            "data-ratingstars": re.compile(r".*")
        })

        if cls.SORT_BY_RATING:
            best = sorted(results, key=lambda elem: elem['data-ratingstars'])[-1]
        else:
            best = results[0]

        anchor = None
        for parent in best.parents:
            if parent.name == 'a':
                anchor = parent
                break

        return anchor['href']

    @staticmethod
    def ingredients_for_recipe(url):
        resp = requests.get(url)

        soup = BeautifulSoup(resp.content, 'html.parser')

        results = soup.findAll("span", {
            "class": re.compile(r".*recipe-ingred_txt.*")
        })

        ingredients = [
            x.text for x in results
            if (x.text and 'ingredients' not in x.text)
        ]

        return ingredients

    @classmethod
    def ingredients(cls, dish_name):
        url = cls.recipe_link_for_dish(dish_name)
        ingredients = cls.ingredients_for_recipe(url)

        return ingredients

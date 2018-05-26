import re

import requests
from bs4 import BeautifulSoup

SORT_BY_RATING = False

SEARCH_TERM = 'Waffle'

# SEARCH_TERM = input('Whatcha eatin\'?\n')

resp = requests.get(
    f'https://www.allrecipes.com/search/results/?wt={SEARCH_TERM}&sort=re'
)

soup = BeautifulSoup(resp.content, 'html.parser')

results = soup.findAll("span", {
    "data-ratingstars": re.compile(r".*")
})

if SORT_BY_RATING:
    best = sorted(results, key=lambda elem: elem['data-ratingstars'])[-1]
else:
    best = results[0]

link = None
for parent in best.parents:
    if parent.name == 'a':
        link = parent
        break

resp = requests.get(parent['href'])

soup = BeautifulSoup(resp.content, 'html.parser')


results = soup.findAll("span", {
    "class": re.compile(r".*recipe-ingred_txt.*")
})

ingredients = [
    x.text for x in results
    if (x.text and 'ingredients' not in x.text)
]

soup = BeautifulSoup(resp.content, 'html.parser')
servings = soup.findAll("span", {
    "ng-bind": re.compile(r"adjustedServings")
})
import pdb; pdb.set_trace()  # noqa: E702

print(ingredients)

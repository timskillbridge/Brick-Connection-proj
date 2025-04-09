import requests
from requests_oauthlib import OAuth1
from dotenv import dotenv_values
from os import getenv, environ
from dotenv import load_dotenv

if 'NOUN_K' not in environ or 'NOUN_S' not in environ:
    load_dotenv()

def get_icon(passedNum):
    # pp = pprint.PrettyPrinter(indent=2, depth=2)
    auth = OAuth1(f"{getenv('NOUN_K')}",f"{getenv('NOUN_S')}")
    match passedNum:
        case passedNum if passedNum <10:
            term= "infantile"
        case passedNum if passedNum <20:
            term= 'toddler'
        case passedNum if passedNum <50:
            term= 'crawl'
        case passedNum if passedNum <100:
            term= 'lego'
        case passedNum if passedNum <500:
            term= 'system'
        case passedNum if passedNum <1000:
            term= 'gears'
        case passedNum if passedNum <5000:
            term= 'flowchart'
        case passedNum if passedNum <10000:
            term= 'complexity'
        case passedNum if passedNum >10000:
            term= 'science'

    endpoint = f"https://api.thenounproject.com/v2/icon?query={term}&limit=1&thumbnail_size=84"
    response = requests.get(endpoint, auth=auth)
    if response.status_code == 200:
        responseJSON = response.json()
        icons = responseJSON.get('icons', [])
        if icons:
            answer = icons[0].get('thumbnail_url')
            if answer is not None:
                return answer
    return None

# print((f"{getenv('NOUN_K')}",f"{getenv('NOUN_S')}"))
print(get_icon(100))
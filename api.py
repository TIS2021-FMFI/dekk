
import requests
api_url = "https://data.statistics.sk/api/v2/dataset/om7102rr/all/2020/0/0?lang=sk"
response = requests.get(api_url)
print(response.json()) #response.json()['value']

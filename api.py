# pip install requests
import requests

api_url = "https://data.statistics.sk/api/v2/dataset/om7102rr/all/2020/0/0?lang=sk"
response = requests.get(api_url)

# print value
print(response.json()['value'])
# example how to print slovak regions
print(response.json()['dimension']['om7102rr_vuc']['category']['label'].values()) 
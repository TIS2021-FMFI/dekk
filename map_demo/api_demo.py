import requests
import pandas as pd
from io import StringIO

# Forium Choroplethu potrebujeme podhodit data v csv formate. Mena stlpcov a data, ktore datacube vyprodukuje v csv su ale 
# kodovane v json suboroch, na ktore treba davat separate api requesty.
# Nakodil som toto demo riesenie, ktore je schopne csv vybuildovat do viac menej finalnej podoby (nahradil som vsetky idcka za ich value 
# z prislusnych jsonov), a vyrobit z neho pandas dataFrame object
# Treba ale najst lepsie riesenie.


api_url = "https://data.statistics.sk/api/v2/dataset/om7102rr/all/2020/0/Spolu?lang=sk&type=csv"
response = requests.get(api_url)
content = response.content.decode('utf-8')
cube_url = "https://data.statistics.sk/api/v2/dimension/"

# dirty solution

content_lst = content.split('\n')
dimensions = []

for i, line in enumerate(content_lst):
    if 'Názov' in line:
        cube_name = content_lst[i+1].split(';')[0]
    
    if 'Kód dimenzie' in line:
        dimen_codes = content_lst[i+1].split(';')
        
        for dimen in dimen_codes:
            dimensions.append(requests.get(cube_url+cube_name+'/'+dimen).json())
    
    if 'Kód Elementu' in line:
        content = '\n'.join(content_lst[i+1:])
        break

first_line = ''
for dimen in dimensions:
    first_line += dimen['note'] + ';'



first_line += 'hodnota'
content = first_line + '\n' + content

content_lst = content.split('\n')
new_content_lst = [content_lst[0]]

for line in content_lst[1:]:
    tmp = []
    for i, item in enumerate(line.split(';')):
        if i < len(line.split(';'))-1 and 'label' in dimensions[i]['category'].keys():
            tmp.append(dimensions[i]['category']['label'][item])
        else:
            tmp.append(item)
    new_content_lst.append(';'.join(tmp))

state_data = pd.read_csv(StringIO('\n'.join(new_content_lst)), sep=';')
print(state_data)

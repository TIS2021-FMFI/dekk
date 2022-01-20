import api_final
import os
from datetime import datetime

with open('datasety_api.txt') as f:
    for line in f:
        dataset, yr_begin, yr_end = line.split()

        for year in range(int(yr_begin), int(yr_end)+1):
            print(f'code = {dataset}, year = {year}')

            try:
                api_final.import_dataset(dataset, year)
            except Exception as err:
                with open('log.txt', 'a' if os.path.isfile('log.txt') else 'w') as log:
                    log.write(datetime.now().strftime("%d/%m/%Y %H:%M:%S"), err)
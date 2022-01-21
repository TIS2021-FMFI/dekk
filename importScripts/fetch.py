import api_final
import os
import traceback
from datetime import datetime

with open('datasety_api.txt') as f:
    for line in f:
        dataset, yr_begin, yr_end = line.split()

        for year in range(int(yr_begin), int(yr_end)+1):
            print(f'code = {dataset}, year = {year}')

            try:
                api_final.import_dataset(dataset, year)
            except:
                with open('log.txt', 'a' if os.path.isfile('log.txt') else 'w') as log:
                    log.write(f'{datetime.now().strftime("%d/%m/%Y %H:%M:%S")} code={dataset} year={year}\n')
                    traceback.print_exc(file=log)
                    log.write('\n')
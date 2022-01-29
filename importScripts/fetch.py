from re import S
import api_final
import os
import traceback
import time
from datetime import datetime

with open('datasety_api.txt') as f:
    for line in f:
        dataset, yr_begin, yr_end = line.split()

        for year in range(int(yr_begin), int(yr_end)+1):
            start = time.time()
            print(f'code = {dataset}, year = {year}')
            with open('log.txt', 'a' if os.path.isfile('log.txt') else 'w') as log:
                try:
                    api_final.import_dataset(dataset, year)
                    duration = time.strftime('%H:%M:%S', time.gmtime(time.time()-start))
                    log.write(f'{datetime.now().strftime("%d/%m/%Y %H:%M:%S")} code={dataset} year={year}\n')
                    log.write(f'...dataset imported in {duration} ...')
                    log.write('\n')
                except:
                    duration = time.strftime('%H:%M:%S', time.gmtime(time.time()-start))
                    log.write(f'{datetime.now().strftime("%d/%m/%Y %H:%M:%S")} code={dataset} year={year}\n')
                    log.write(f'...dataset import failed after {duration} ...')
                    traceback.print_exc(file=log)
                    log.write('\n')
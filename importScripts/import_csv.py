from csv import reader
from datasetClass import Dataset
import sys

# open file in read mode

def import_csv(file_name):
    with open(file_name, 'r', encoding='utf-8') as read_obj:
        # pass the file object to reader() to get the reader object
        csv_reader = reader(read_obj)
        # Iterate over each row in the csv using reader object until you get name of dataset
        dataset_name = None

        for row in csv_reader:
            if row == [] or row[0] == '':
                continue
            
            if row[0] in ['názov', 'Názov', 'nazov', 'Nazov']:
                dataset_name = row[1].strip()
                break
        
        if dataset_name is None:
            print('Dataset bez nazvu nie je mozne importovat.')
            return

        # get parameters
        parameters = {}
        years = []

        for row in csv_reader:
            if len(row) <= 1 or row[0] == "" and row[1] == "":
                continue

            if row[0] == "" and row[1] != "":
                years = row[1:]
                break

            parameters[row[0].strip()] = row[1].strip()


        if parameters == {}:
            parameters['spolu'] = 'spolu'

        data = {}
        for y in years:
            data[int(y)] = {}

        for row in csv_reader:
            if row == [] or row[0] == '':
                continue

            district = row[0].replace('Okres', '').strip()

            i = 0
            for val in row[1:]:
                if val == ".":
                    continue
                val = val.replace(',', '.')
                val = val.replace(' ', '')
                data[int(years[i])][district] = float(val)
                i+=1

        for year in data:
            dataset = Dataset()
            
            dataset.year = year
            dataset.dataset_type_id = dataset.get_dataset_type_id(dataset_name)
            dataset.parameter_value_ids = []
            for parameter in parameters:
                par_id = dataset.get_parameter_id(parameter, dataset.dataset_type_id)
                dataset.parameter_value_ids.append(dataset.get_parameter_value_id(parameters[parameter], par_id))

            dataset.data = {}
            for district in data[year]:
                district_id = dataset.get_district_id(district)
                if district_id == False:
                    print('Okres ' + district + ' sa nenachadza v databaze, nespravny nazov.')
                    return

                dataset.data[district_id] = float(data[year][district])
    
            dataset.insert()

# file_name = ['importScripts/volby.csv', 
#             'importScripts/emise_km_tuhe.csv', 
#             'importScripts/emisie_km_oxidsiricity.csv',
#             'importScripts/emisie_tony_oxidsiricity.csv',
#             'importScripts/emisie_tony_tuhe.csv',
#             'importScripts/volby2020sas.csv',
#             'importScripts/volby2020saspodiel.csv',
#             'importScripts/volby2020sns.csv',
#             'importScripts/volby2020snspodiel.csv',
#             'importScripts/zivotanarodeni_poradie.csv',
#             'importScripts/zivotanarodeni_poradie2.csv',
#             'importScripts/zivotanarodeni_poradie3.csv',
#             'importScripts/zivotanarodeni_poradie4.csv',
#             'importScripts/zivotanarodeni_poradie5.csv'
#             ]

file_name = ['volby_ds_pocet.csv', 'volby_ds_podiel.csv', 'volby_lsns_pocet.csv', 'volby_lsns_podiel.csv', 'volby_most_hid_pocet.csv', 'volby_most_hid_podiel.csv', 'volby_olano_pocet.csv', 'volby_olano_podiel.csv', 'volby_pocet.csv', 'volby_podiel.csv', 'volby_sas_pocet.csv', 'volby_sas_podiel.csv', 'volby_smer_pocet.csv', 'volby_smer_podiel.csv', 'volby_sme_rodina_pocet.csv', 'volby_sme_rodina_podiel.csv', 'volby_sns_pocet.csv', 'volby_sns_podiel.csv']

for file in file_name:
    import_csv(file)

# input = sys.argv[1]
# print(input)
# import_csv(input)
# print('Data boli importnute do databazy.')

# d = Dataset()
# print(d.get_district_id_from_code('SK0212 '))

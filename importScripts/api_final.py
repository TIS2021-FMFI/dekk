import requests
from datetime import date
from datasetClass import Dataset
import sys
import json

# URL where is a list of all datasets for which an API exists
# https://data.statistics.sk/api/v2/collection?lang=sk

areas = {
    "SK0101": "Okres Bratislava I", "SK0102": "Okres Bratislava II", "SK0103": "Okres Bratislava III",
    "SK0104": "Okres Bratislava IV", "SK0105": "Okres Bratislava V", "SK0106": "Okres Malacky",
    "SK0107": "Okres Pezinok", "SK0108": "Okres Senec", "SK0211": "Okres Dunajská Streda", "SK0212": "Okres Galanta",
    "SK0213": "Okres Hlohovec", "SK0214": "Okres Piešťany", "SK0215": "Okres Senica", "SK0216": "Okres Skalica",
    "SK0217": "Okres Trnava", "SK0221": "Okres Bánovce nad Bebravou", "SK0222": "Okres Ilava", "SK0223": "Okres Myjava",
    "SK0224": "Okres Nové Mesto nad Váhom", "SK0225": "Okres Partizánske", "SK0226": "Okres Považská Bystrica",
    "SK0227": "Okres Prievidza", "SK0228": "Okres Púchov", "SK0229": "Okres Trenčín", "SK0231": "Okres Komárno",
    "SK0232": "Okres Levice", "SK0233": "Okres Nitra", "SK0234": "Okres Nové Zámky", "SK0235": "Okres Šaľa",
    "SK0236": "Okres Topoľčany", "SK0237": "Okres Zlaté Moravce", "SK0311": "Okres Bytča", "SK0312": "Okres Čadca",
    "SK0313": "Okres Dolný Kubín", "SK0314": "Okres Kysucké Nové Mesto", "SK0315": "Okres Liptovský Mikuláš",
    "SK0316": "Okres Martin", "SK0317": "Okres Námestovo", "SK0318": "Okres Ružomberok",
    "SK0319": "Okres Turčianske Teplice", "SK031A": "Okres Tvrdošín", "SK031B": "Okres Žilina",
    "SK0321": "Okres Banská Bystrica", "SK0322": "Okres Banská Štiavnica", "SK0323": "Okres Brezno",
    "SK0324": "Okres Detva", "SK0325": "Okres Krupina", "SK0326": "Okres Lučenec", "SK0327": "Okres Poltár",
    "SK0328": "Okres Revúca", "SK0329": "Okres Rimavská Sobota", "SK032A": "Okres Veľký Krtíš",
    "SK032B": "Okres Zvolen", "SK032C": "Okres Žarnovica", "SK032D": "Okres Žiar nad Hronom",
    "SK0411": "Okres Bardejov", "SK0412": "Okres Humenné", "SK0413": "Okres Kežmarok", "SK0414": "Okres Levoča",
    "SK0415": "Okres Medzilaborce", "SK0416": "Okres Poprad", "SK0417": "Okres Prešov", "SK0418": "Okres Sabinov",
    "SK0419": "Okres Snina", "SK041A": "Okres Stará Ľubovňa", "SK041B": "Okres Stropkov", "SK041C": "Okres Svidník",
    "SK041D": "Okres Vranov nad Topľou", "SK0421": "Okres Gelnica", "SK0422": "Okres Košice I",
    "SK0423": "Okres Košice II", "SK0424": "Okres Košice III", "SK0425": "Okres Košice IV",
    "SK0426": "Okres Košice - okolie", "SK0427": "Okres Michalovce", "SK0428": "Okres Rožňava",
    "SK0429": "Okres Sobrance", "SK042A": "Okres Spišská Nová Ves", "SK042B": "Okres Trebišov",
}


class DatasetApi:
    def __init__(self, dataset_code, name, fromyear, dimensions):
        self.dataset_code = dataset_code
        self.name = name
        self.data_from_year = fromyear
        self.dimensions = dimensions

    def __repr__(self):
        return self.dataset_code


# all years available
def generate_years(od):
    result = []
    for i in range(int(od), date.today().year):
        result.append(i)
    return result

# all years available, but from URL
def generate_years1(url,od):
    result,result2 = [],[]
    response = requests.get(url)
    if (response.status_code == 200):
        result = response.json()['category']['index'].keys()
        for key in result:
            result2.append(int(key))
        result2.sort()
    else:
        result2 = generate_years(od)
    return result2


datasets = []

# 1. - dataset
datasets.append(
    DatasetApi("om7102rr",
            "Počet obyvateľov podľa pohlavia - SR-oblasť-kraj-okres, m-v (ročne)",
               1993,
               [{"nazov": "Okresy",
              "kod": "om7102rr_vuc",
              "udaje": areas},
             {"nazov": "Roky",
              "kod": "om7102rr_obd",
              "udaje": generate_years1('https://data.statistics.sk/api/v2/dimension/om7102rr/om7102rr_obd', 1993)},
             {"nazov": "Ukazovatele",
              "kod": "om7102rr_ukaz",
              "udaje": {
                  "0": "Stav trvale bývajúceho obyvateľstva na začiatku obdobia (Osoba)",
                  "1": "Stredný (priemerný) stav trvale bývajúceho obyvateľstva (Osoba)",
                  "2": "Stav trvale bývajúceho obyvateľstva na konci obdobia (Osoba)"}},
             {"nazov": "Pohlavie",
              "kod": "om7102rr_poh",
              "udaje": {
                  "0": "Spolu",
                  "1": "Muži",
                  "2": "Ženy", }},
             ]))

# 2. - dataset
datasets.append(
    DatasetApi("om7038rr",
            "Priemerný vek osoby pri úmrtí podľa pohlavia - SR-oblasť-kraj-okres, m-v",
               1993,
               [{"nazov": "Okresy",
              "kod": "om7038rr_vuc",
              "udaje": areas},
             {"nazov": "Roky",
              "kod": "om7038rr_obd",
              "udaje": generate_years1('https://data.statistics.sk/api/v2/dimension/om7038rr/om7038rr_obd', 1993)},
             {"nazov": "Ukazovatele",
              "kod": "om7038rr_ukaz",
              "udaje": {
                  "0": "Priemerný vek pri úmrtí (Rok)"}},
             {"nazov": "Pohlavie",
              "kod": "om7038rr_poh",
              "udaje": {
                  "0": "Spolu",
                  "1": "Muži",
                  "2": "Ženy", }},
             ]))

# 3. - dataset
datasets.append(
    DatasetApi("om7034rr",
            "Zomrelí podľa veku a pohlavia - SR-oblasť-kraj-okres, m-v",
               1993,
               [{"nazov": "Okresy",
              "kod": "om7034rr_vuc",
              "udaje": areas},
             {"nazov": "Roky",
              "kod": "om7034rr_obd",
              "udaje": generate_years1('https://data.statistics.sk/api/v2/dimension/om7034rr/om7034rr_obd', 1993)},
             {"nazov": "Vek",
              "kod": "om7034rr_vek",
              "udaje": {
                  "Spolu": "Spolu ",
                  "D_LT7": "Menej ako 7 dní",
                  "D_LT28": "Menej ako 28 dní",
                  "Y_LT1": "Menej ako 1 rok",
                  "Y1": "1 rok",
                  "Y2": "2 roky",
                  "Y3": "3 roky",
                  "Y4": "4 roky",
                  "Y5": "5 rokov",
                  "Y6": "6 rokov",
                  "Y7": "7 rokov",
                  "Y8": "8 rokov",
                  "Y9": "9 rokov",
                  "Y10": "10 rokov",
                  "Y11": "11 rokov",
                  "Y12": "12 rokov",
                  "Y13": "13 rokov",
                  "Y14": "14 rokov",
                  "Y15": "15 rokov",
                  "Y16": "16 rokov",
                  "Y17": "17 rokov",
                  "Y18": "18 rokov",
                  "Y19": "19 rokov",
                  "Y20": "20 rokov",
                  "Y21": "21 rokov",
                  "Y22": "22 rokov",
                  "Y23": "23 rokov",
                  "Y24": "24 rokov",
                  "Y25": "25 rokov",
                  "Y26": "26 rokov",
                  "Y27": "27 rokov",
                  "Y28": "28 rokov",
                  "Y29": "29 rokov",
                  "Y30": "30 rokov",
                  "Y31": "31 rokov",
                  "Y32": "32 rokov",
                  "Y33": "33 rokov",
                  "Y34": "34 rokov",
                  "Y35": "35 rokov",
                  "Y36": "36 rokov",
                  "Y37": "37 rokov",
                  "Y38": "38 rokov",
                  "Y39": "39 rokov",
                  "Y40": "40 rokov",
                  "Y41": "41 rokov",
                  "Y42": "42 rokov",
                  "Y43": "43 rokov",
                  "Y44": "44 rokov",
                  "Y45": "45 rokov",
                  "Y46": "46 rokov",
                  "Y47": "47 rokov",
                  "Y48": "48 rokov",
                  "Y49": "49 rokov",
                  "Y50": "50 rokov",
                  "Y51": "51 rokov",
                  "Y52": "52 rokov",
                  "Y53": "53 rokov",
                  "Y54": "54 rokov",
                  "Y55": "55 rokov",
                  "Y56": "56 rokov",
                  "Y57": "57 rokov",
                  "Y58": "58 rokov",
                  "Y59": "59 rokov",
                  "Y60": "60 rokov",
                  "Y61": "61 rokov",
                  "Y62": "62 rokov",
                  "Y63": "63 rokov",
                  "Y64": "64 rokov",
                  "Y65": "65 rokov",
                  "Y66": "66 rokov",
                  "Y67": "67 rokov",
                  "Y68": "68 rokov",
                  "Y69": "69 rokov",
                  "Y70": "70 rokov",
                  "Y71": "71 rokov",
                  "Y72": "72 rokov",
                  "Y73": "73 rokov",
                  "Y74": "74 rokov",
                  "Y75": "75 rokov",
                  "Y76": "76 rokov",
                  "Y77": "77 rokov",
                  "Y78": "78 rokov",
                  "Y79": "79 rokov",
                  "Y80": "80 rokov",
                  "Y81": "81 rokov",
                  "Y82": "82 rokov",
                  "Y83": "83 rokov",
                  "Y84": "84 rokov",
                  "Y85": "85 rokov",
                  "Y86": "86 rokov",
                  "Y87": "87 rokov",
                  "Y88": "88 rokov",
                  "Y89": "89 rokov",
                  "Y90": "90 rokov",
                  "Y91": "91 rokov",
                  "Y92": "92 rokov",
                  "Y93": "93 rokov",
                  "Y94": "94 rokov",
                  "Y95": "95 rokov",
                  "Y96": "96 rokov",
                  "Y97": "97 rokov",
                  "Y98": "98 rokov",
                  "Y99": "99 rokov",
                  "Y1-4": "Od 1 do 4 rokov",
                  "Y5-9": "Od 5 do 9 rokov",
                  "Y10-14": "Od 10 do 14 rokov",
                  "Y15-19": "Od 15 do 19 rokov",
                  "Y20-24": "Od 20 do 24 rokov",
                  "Y25-29": "Od 25 do 29 rokov",
                  "Y30-34": "Od 30 do 34 rokov",
                  "Y35-39": "Od 35 do 39 rokov",
                  "Y40-44": "Od 40 do 44 rokov",
                  "Y45-49": "Od 45 do 49 rokov",
                  "Y50-54": "Od 50 do 54 rokov",
                  "Y55-59": "Od 55 do 59 rokov",
                  "Y60-64": "Od 60 do 64 rokov",
                  "Y65-69": "Od 65 do 69 rokov",
                  "Y70-74": "Od 70 do 74 rokov",
                  "Y75-79": "Od 75 do 79 rokov",
                  "Y80-84": "Od 80 do 84 rokov",
                  "Y85-89": "Od 85 do 89 rokov",
                  "Y_GE85": "85 rokov alebo viac",
                  "Y90-94": "Od 90 do 94 rokov",
                  "Y95-99": "Od 95 do 99 rokov",
                  "Y_GE100": "100 rokov alebo viac"}},
             {"nazov": "Pohlavie",
              "kod": "om7034rr_poh",
              "udaje": {
                  "0": "Spolu",
                  "1": "Muži",
                  "2": "Ženy", }},
             ]))

# 4. - dataset
datasets.append(
    DatasetApi("om7009rr",
            "Vekové zloženie - SR-oblasť-kraj-okres, m-v",
               1996,
               [{"nazov": "Okresy",
              "kod": "om7009rr_vuc",
              "udaje": areas},
             {"nazov": "Roky",
              "kod": "om7009rr_obd",
              "udaje": generate_years1('https://data.statistics.sk/api/v2/dimension/om7009rr/om7009rr_obd', 1996)},
             {"nazov": "Ukazovatele",
              "kod": "om7009rr_ukaz",
              "udaje": {
                  "0": "Stav trvale bývajúceho obyvateľstva k 30.6.(1.7.) (Osoba)",
                  "1": "Stav trvale bývajúceho obyvateľstva k 31.12. (Osoba)"}},
             {"nazov": "Pohlavie",
              "kod": "om7009rr_poh",
              "udaje": {
                  "0": "Spolu",
                  "1": "Muži",
                  "2": "Ženy", }},
             {"nazov": "Jednotky veku",
              "kod": "om7009rr_vek",
              "udaje": {
                  "Spolu": "Spolu",
                  "Y0": "Nula rokov",
                  "Y1": "1 rok",
                  "Y2": "2 roky",
                  "Y3": "3 roky",
                  "Y4": "4 roky",
                  "Y5": "5 rokov",
                  "Y6": "6 rokov",
                  "Y7": "7 rokov",
                  "Y8": "8 rokov",
                  "Y9": "9 rokov",
                  "Y10": "10 rokov",
                  "Y11": "11 rokov",
                  "Y12": "12 rokov",
                  "Y13": "13 rokov",
                  "Y14": "14 rokov",
                  "Y15": "15 rokov",
                  "Y16": "16 rokov",
                  "Y17": "17 rokov",
                  "Y18": "18 rokov",
                  "Y19": "19 rokov",
                  "Y20": "20 rokov",
                  "Y21": "21 rokov",
                  "Y22": "22 rokov",
                  "Y23": "23 rokov",
                  "Y24": "24 rokov",
                  "Y25": "25 rokov",
                  "Y26": "26 rokov",
                  "Y27": "27 rokov",
                  "Y28": "28 rokov",
                  "Y29": "29 rokov",
                  "Y30": "30 rokov",
                  "Y31": "31 rokov",
                  "Y32": "32 rokov",
                  "Y33": "33 rokov",
                  "Y34": "34 rokov",
                  "Y35": "35 rokov",
                  "Y36": "36 rokov",
                  "Y37": "37 rokov",
                  "Y38": "38 rokov",
                  "Y39": "39 rokov",
                  "Y40": "40 rokov",
                  "Y41": "41 rokov",
                  "Y42": "42 rokov",
                  "Y43": "43 rokov",
                  "Y44": "44 rokov",
                  "Y45": "45 rokov",
                  "Y46": "46 rokov",
                  "Y47": "47 rokov",
                  "Y48": "48 rokov",
                  "Y49": "49 rokov",
                  "Y50": "50 rokov",
                  "Y51": "51 rokov",
                  "Y52": "52 rokov",
                  "Y53": "53 rokov",
                  "Y54": "54 rokov",
                  "Y55": "55 rokov",
                  "Y56": "56 rokov",
                  "Y57": "57 rokov",
                  "Y58": "58 rokov",
                  "Y59": "59 rokov",
                  "Y60": "60 rokov",
                  "Y61": "61 rokov",
                  "Y62": "62 rokov",
                  "Y63": "63 rokov",
                  "Y64": "64 rokov",
                  "Y65": "65 rokov",
                  "Y66": "66 rokov",
                  "Y67": "67 rokov",
                  "Y68": "68 rokov",
                  "Y69": "69 rokov",
                  "Y70": "70 rokov",
                  "Y71": "71 rokov",
                  "Y72": "72 rokov",
                  "Y73": "73 rokov",
                  "Y74": "74 rokov",
                  "Y75": "75 rokov",
                  "Y76": "76 rokov",
                  "Y77": "77 rokov",
                  "Y78": "78 rokov",
                  "Y79": "79 rokov",
                  "Y80": "80 rokov",
                  "Y81": "81 rokov",
                  "Y82": "82 rokov",
                  "Y83": "83 rokov",
                  "Y84": "84 rokov",
                  "Y85": "85 rokov",
                  "Y86": "86 rokov",
                  "Y87": "87 rokov",
                  "Y88": "88 rokov",
                  "Y89": "89 rokov",
                  "Y90": "90 rokov",
                  "Y91": "91 rokov",
                  "Y92": "92 rokov",
                  "Y93": "93 rokov",
                  "Y94": "94 rokov",
                  "Y95": "95 rokov",
                  "Y96": "96 rokov",
                  "Y97": "97 rokov",
                  "Y98": "98 rokov",
                  "Y99": "99 rokov",
                  "Y100": "100 rokov",
                  "Y_GE100": "100 rokov alebo viac",
                  "Y101": "101 rokov",
                  "Y102": "102 rokov",
                  "Y103": "103 rokov",
                  "Y104": "104 rokov",
                  "Y105": "105 rokov",
                  "Y106": "106 rokov",
                  "Y107": "107 rokov",
                  "Y108": "108 rokov",
                  "Y109": "109 rokov",
                  "Y_GE110": "110 rokov alebo viac"}}
             ]))

# 5. - dataset
datasets.append(
    DatasetApi("om7011rr",
            "Prehľad stavu a pohybu obyvateľstva - SR-oblasť-kraj-okres, m-v",
               1996,
               [{"nazov": "Okresy",
              "kod": "om7011rr_vuc",
              "udaje": areas},
             {"nazov": "Roky",
              "kod": "om7011rr_obd",
              "udaje": generate_years1('https://data.statistics.sk/api/v2/dimension/om7011rr/om7011rr_obd', 1996)},
             {"nazov": "Ukazovatele",
              "kod": "om7011rr_ukaz",
              "udaje": {
                  "IN010051": "Stav trvale bývajúceho obyvateľstva k 1.1. (Osoba)",
                  "IN010052": "Stav trvale bývajúceho obyvateľstva k 30.6.(1.7.) (Osoba)",
                  "IN010053": "Stav trvale bývajúceho obyvateľstva k 31.12. (Osoba)",
                  "IN010054": "Narodení (Osoba)",
                  "IN010055": "Hrubá miera živorodenosti (Promile)",
                  "IN010056": "Potraty (Počet v jednotkách)",
                  "IN010057": "Hrubá miera potratovosti (Promile)",
                  "IN010058": "Index potratovosti (Percento)",
                  "IN010059": "Ukončené tehotenstvá (Počet v jednotkách)",
                  "IN010060": "Hrubá miera ukončených tehotenstiev (Promile)",
                  "IN010061": "Zomretí (Osoba)",
                  "IN010062": "Hrubá miera úmrtnosti (Promile)",
                  "IN010063": "Dojčenská úmrtnosť (Osoba)",
                  "IN010064": "Miera dojčenskej úmrtnosti (Promile)",
                  "IN010065": "Novorodenecká úmrtnosť (Osoba)",
                  "IN010066": "Miera novorodeneckej úmrtnosti (Promile)",
                  "IN010067": "Perinatálna úmrtnosť (Osoba)",
                  "IN010068": "Miera perinatálnej úmrtnosti (Promile)",
                  "IN010069": "Štandardná dojčenská úmrtnosť (Promile)",
                  "IN010070": "Štandardná novorodenecká úmrtnosť (Promile)",
                  "IN010071": "Sobáše (Počet v jednotkách)",
                  "IN010072": "Hrubá miera sobášnosti (Promile)",
                  "IN010073": "Rozvody (Počet v jednotkách)",
                  "IN010074": "Hrubá miera rozvodovosti (Promile)",
                  "IN010075": "Index rozvodovosti (Percento)",
                  "IN010076": "Prirodzený prírastok obyvateľstva (Osoba)",
                  "IN010077": "Hrubá miera prirodzeného prírastku obyvateľstva (Promile)",
                  "IN010078": "Prisťahovaní na trvalý pobyt (Osoba)",
                  "IN010079": "Vysťahovaní z trvalého pobytu (Osoba)",
                  "IN010080": "Migračné saldo (Osoba)",
                  "IN010081": "Hrubá miera migračného salda (Promile)",
                  "IN010082": "Celkový prírastok obyvateľstva (Osoba)",
                  "IN010083": "Hrubá miera celkového prírastku obyvateľstva (Promile)",
                  "IN010106": "Živonarodení (Osoba)"}}
             ]))

# 6. - dataset
datasets.append(
    DatasetApi("om7023rr",
            "Veľkostné skupiny obcí - SR-oblasť-kraj-okres, m-v",
               1996,
               [{"nazov": "Okresy",
              "kod": "om7023rr_vuc",
              "udaje": areas},
             {"nazov": "Roky",
              "kod": "om7023rr_obd",
              "udaje": generate_years1('https://data.statistics.sk/api/v2/dimension/om7023rr/om7023rr_obd', 1996)},
             {"nazov": "Ukazovatele",
              "kod": "om7023rr_ukaz",
              "udaje": {
                  "0": "Stav trvale bývajúceho obyvateľstva k 31.12. (Osoba)",
                  "1": "Počet obcí (Počet v jednotkách)"}},
             {"nazov": "Velkostné skupiny obcí",
              "kod": "om7023rr_vsk",
              "udaje": {
                  "LE1999": "1 999 obyvatelov alebo menej",
                  "LE1999.S_LE199": "Skupina 199 obyvateľov alebo menej",
                  "LE1999.S_LE199.P_LE99": "99 obyvateľov alebo menej",
                  "LE1999.S_LE199.P100-199": "Od 100 do 199 obyvateľov",
                  "LE1999.S200-499": "Skupina Od 200 do 499 obyvateľov",
                  "LE1999.S200-499.P200-299": "Od 200 do 299 obyvateľov",
                  "LE1999.S200-499.P300-399": "Od 300 do 399 obyvateľov",
                  "LE1999.S200-499.P400-499": "Od 400 do 499 obyvateľov",
                  "LE1999.S500-999": "Skupina Od 500 do 999 obyvateľov",
                  "LE1999.S500-999.P500-599": "Od 500 do 599 obyvateľov",
                  "LE1999.S500-999.P600-699": "Od 600 do 699 obyvateľov",
                  "LE1999.S500-999.P700-799": "Od 700 do 799 obyvateľov",
                  "LE1999.S500-999.P800-899": "Od 800 do 899 obyvateľov",
                  "LE1999.S500-999.P900-999": "Od 900 do 999 obyvateľov",
                  "LE1999.S1000-1999": "Skupina Od 1 000 do 1 999 obyvateľov",
                  "LE1999.S1000-1999.P1000-1499": "Od 1 000 do 1 499 obyvateľov",
                  "LE1999.S1000-1999.P1500-1999": "Od 1 500 do 1 999 obyvateľov",
                  "GE2000": "2 000 a viac obyvatelov",
                  "GE2000.S2000-4999": "Skupina Od 2 000 do 4 999 obyvateľov",
                  "GE2000.S2000-4999.P2000-2499": "Od 2 000 do 2 499 obyvateľov",
                  "GE2000.S2000-4999.P2500-2999": "Od 2 500 do 2 999 obyvateľov",
                  "GE2000.S2000-4999.P3000-3999": "Od 3 000 do 3 999 obyvateľov",
                  "GE2000.S2000-4999.P4000-4999": "Od 4 000 do 4 999 obyvateľov",
                  "GE2000.S5000-9999": "Skupina Od 5 000 do 9 999 obyvateľov",
                  "GE2000.S5000-9999.P5000-9999": "Od 5 000 do 9 999 obyvateľov",
                  "GE2000.S10000-19999": "Skupina Od 10 000 do 19 999 obyvateľov",
                  "GE2000.S10000-19999.P10000-14999": "Od 10 000 do 14 999 obyvateľov",
                  "GE2000.S10000-19999.P15000-19999": "Od 15 000 do 19 999 obyvateľov",
                  "GE2000.S20000-49999": "Skupina Od 20 000 do 49 999 obyvateľov",
                  "GE2000.S20000-49999.P20000-24999": "Od 20 000 do 24 999 obyvateľov",
                  "GE2000.S20000-49999.P25000-29999": "Od 25 000 do 29 999 obyvateľov",
                  "GE2000.S20000-49999.P30000-39999": "Od 30 000 do 39 999 obyvateľov",
                  "GE2000.S20000-49999.P40000-49999": "Od 40 000 do 49 999 obyvateľov",
                  "GE2000.S50000-99999": "Skupina Od 50 000 do 99 999 obyvateľov",
                  "GE2000.S50000-99999.P50000-99999": "Od 50 000 do 99 999 obyvateľov",
                  "GE2000.S_GE100000": "Skupina 100 000 a viac obyvateľov",
                  "GE2000.S_GE100000.P_GE100000": "100 000 a viac obyvateľov"}}
             ]))

# 7. - dataset
datasets.append(
    DatasetApi("om7015rr",
            "Hustota obyvateľstva - SR-oblasť-kraj-okres, m-v",
               1996,
               [{"nazov": "Okresy",
              "kod": "om7015rr_vuc",
              "udaje": areas},
             {"nazov": "Roky",
              "kod": "om7015rr_obd",
              "udaje": generate_years1('https://data.statistics.sk/api/v2/dimension/om7015rr/om7015rr_obd', 1996)},
             {"nazov": "Ukazovatele",
              "kod": "om7015rr_ukaz",
              "udaje": {
                  "IN010049": "Hustota obyvateľstva (Osoba na kilometer štvorcový)",
                  "IN010050": "Rozloha (Štvorcový meter)",
                  "IN010052": "Stav trvale bývajúceho obyvateľstva k 30.6.(1.7.) (Osoba)"}}
             ]))

# 8. - dataset
datasets.append(
    DatasetApi("zd3002rr",
            "Pracovná neschopnosť - prípady",
               2001,
               [{"nazov": "Okresy",
              "kod": "nuts14",
              "udaje": areas},
             {"nazov": "Roky",
              "kod": "zd3002rr_rok",
              "udaje": generate_years1('https://data.statistics.sk/api/v2/dimension/zd3002rr/zd3002rr_rok', 2001)},
             {"nazov": "Ukazovatele",
              "kod": "zd3002rr_ukaz",
              "udaje": {
                  "NOVE_PN": "Počet novohlásených prípadov PN",
                  "DNI_PN": "Počet kalendárnych dní PN",
                  "TRV_PRIPAD_PN": "Priemerná doba trvania 1 prípadu PN spolu v dňoch",
                  "PRIEM_PN_PERC": "Priemerné percento pracovnej neschopnosti"}},
             {"nazov": "Dôvod pracovnej neschopnosti",
              "kod": "zd3002rr_dim1",
              "udaje": {
                  "1": "choroba",
                  "2": "pracovné úrazy",
                  "3": "ostatné úrazy",
                  "4": "PN spolu"}},
             {"nazov": "Pohlavie",
              "kod": "zd3002rr_dim2",
              "udaje": {
                  "1": "Muži",
                  "2": "Ženy",
                  "3": "Spolu"}}
             ]))

order = {
    "om7102rr": 0,
    "om7038rr": 1,
    "om7034rr": 2,
    "om7009rr": 3,
    "om7011rr": 4,
    "om7023rr": 5,
    "om7015rr": 6,
    "zd3002rr": 7
}

def load_dictionary(file_name):
    with open(file_name) as f:
        data = f.read()
    return json.loads(data)

def download(url, year):
    # dictionary1 = fixed URLs for 1.dataset om7102rr
    # dictionary2 = fixed URLs for 4.dataset om7009rr
    # dictionary3 = fixed URLs for 6.dataset om7023rr
    dictionary1 = load_dictionary('dictionary1.txt')
    dictionary2 = load_dictionary('dictionary2.txt')
    dictionary3 = load_dictionary('dictionary3.txt')
    dictionary1.update(dictionary2)
    dictionary1.update(dictionary3)
    year = str(year)
    temporary_url = url.replace(year, '_ROK_')
    if temporary_url in dictionary1:
        api_url = dictionary1[temporary_url]['url']
        api_url = api_url.replace('_ROK_', year)
        response = requests.get(api_url)
        if response.status_code == 200:  # 200 HTTP status code = OK
            result = response.json()['value'][int(dictionary1[temporary_url]['json'])]
            #print(result)
        else:
            result = 0
        if (result is None) or (result == 'null'):
            result = 0
        return float(result)

    else:
        api_url = url
        response = requests.get(api_url)
        if response.status_code == 200:
            result = response.json()['value'][0]
            #print(result)
        else:
            result = 0
        if (result is None) or (result == 'null'):
            result = 0
        return float(result)

class Chyba(Exception): pass


def compose_url(permutation):
    result = "https://data.statistics.sk/api/v2/dataset/" + "/".join(permutation)
    return result


def permutations_of_parameters(dataset, year):  # "zd3002rr", 2010
    dataset = datasets[int(order[dataset])]
    permutations = []
    year = str(year)
    permutations.append([year])

    for dimension in dataset.dimensions[2:]:
        new = []
        for parameter in dimension["udaje"]:
            for line in permutations:
                new.append(line + [parameter])
        permutations = new
    return permutations


def return_value(position, key, dataset_code):
    dataset = datasets[int(order[dataset_code])]
    position = position - 1
    result = dataset.dimensions[position]["udaje"][key]
    return result


def trigger(dataset_code, year):
    dataset = datasets[int(order[dataset_code])]

    # checks whether there are data for a specific year
    if int(year) in datasets[order[dataset_code]].dimensions[1]['udaje']:
        year = str(year)
        permutations = permutations_of_parameters(dataset_code, year)
        result = []
        for i, item in enumerate(permutations):
            help1 = []
            help1.append(dataset.name)
            y = {}
            for j in range(1, len(item)):
                y[dataset.dimensions[j + 1]["nazov"]] = return_value(j + 2, item[j], dataset_code)
            help1.append(y)
            help1.append(int(year))
            help2 = {}
            for area in areas.keys():
                x = [dataset_code] + [area] + item
                help2[area] = download(compose_url(x), year)
            help1.append(help2)
            result.append(help1)
        return result
    raise Chyba(f'Dataset {dataset_code} neobsahuje data pre zvoleny rok')


def import_dataset(code, year=date.today().year - 1):
    if code not in order.keys():
        print('Neznamy kod datasetu')
        return

    print('pustam')
    data = trigger(code, year)
    print('mam')

    for dataset_year in data:
        d = Dataset()
        d.dataset_type_id = d.get_dataset_type_id(dataset_year[0])
        d.parameter_value_ids = []

        for par, val in dataset_year[1].items():
            parameter_id = d.get_parameter_id(par, d.dataset_type_id)
            d.parameter_value_ids.append(d.get_parameter_value_id(val, parameter_id))

        d.year = dataset_year[2]

        d.data = {}
        for code, val in dataset_year[3].items():
            d.data[d.get_district_id_from_code(code)] = val

        d.insert()

        print("Dataset" + code + ", " + str(year) + " bol nahrany do databazy.")


if len(sys.argv) < 2:
    print('Je potrebne zadat kod datasetu.')
else:
    code = sys.argv[1]
    year = None
    if len(sys.argv) > 2:
        year = sys.argv[2]
        import_dataset(code, year)
    else:
        import_dataset(code)

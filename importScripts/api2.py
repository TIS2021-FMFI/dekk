'''
najskor musíme ist na web https://data.statistics.sk/api/v2/collection
kde sa nachádza zoznam a zistit ci pre daný datset existuje API (musíme
hladat v texte), tu sa dozvieme, že existuje a je nám poskytnute URL,
ktore si ale musime sami vyskladat (vieme že ho ohraničujú uvodzovky) zo
stringu stránky, potom prejdeme na to URL a zistime ze nevieme ake dáta
máme vlozit do slovníka, uvediem príklad, dataset má označenie "om7102rr"
a pre neho zistíme že obsahuje nasledujuce kluce:

"om7102rr_vuc",
"om7102rr_obd",
"om7102rr_ukaz",
"om7102rr_poh",
"om7102rr_data"

tieto kluce ale dalej neobsahuju hodnotu dalších klúčov,
niektoré kluce sa nam ale opakuju tak sme sa dovtípili že:

"_poh" tede pohlavie má hodnoty:
0 --> všetko
1 --> muž
2 --> žena

"_vuc" je čislo oblasti(okres, kraj):
SK0101 --> Okres Bratislava I, (tu keď dáme "all" môžeme dostať
error že json má príliž veľa dát, takže len pre jeden okres)

ale "_ukaz" teda ukazovatele sú pre každý dataset rôzne,
dalej poznáme napr. "_vek" kde radšej dávame hodnotu "all"
a "_vsk" Velkostné skupiny obcí tiež radšej "all"

takže vídíme že nevieme tak úplne automaticky dopredu zistiť
aké su dalšie klúče, preto dávame "all" a dúfame že sa to nejako
vykryje.

'''

import requests
from datetime import date

areas = {
    "SK0101": "Okres Bratislava I",
    "SK0102": "Okres Bratislava II",
    "SK0103": "Okres Bratislava III",
    "SK0104": "Okres Bratislava IV",
    "SK0105": "Okres Bratislava V",
    "SK0106": "Okres Malacky",
    "SK0107": "Okres Pezinok",
    "SK0108": "Okres Senec",
    "SK0211": "Okres Dunajská Streda",
    "SK0212": "Okres Galanta",
    "SK0213": "Okres Hlohovec",
    "SK0214": "Okres Piešťany",
    "SK0215": "Okres Senica",
    "SK0216": "Okres Skalica",
    "SK0217": "Okres Trnava",
    "SK0221": "Okres Bánovce nad Bebravou",
    "SK0222": "Okres Ilava",
    "SK0223": "Okres Myjava",
    "SK0224": "Okres Nové Mesto nad Váhom",
    "SK0225": "Okres Partizánske",
    "SK0226": "Okres Považská Bystrica",
    "SK0227": "Okres Prievidza",
    "SK0228": "Okres Púchov",
    "SK0229": "Okres Trenčín",
    "SK0231": "Okres Komárno",
    "SK0232": "Okres Levice",
    "SK0233": "Okres Nitra",
    "SK0234": "Okres Nové Zámky",
    "SK0235": "Okres Šaľa",
    "SK0236": "Okres Topoľčany",
    "SK0237": "Okres Zlaté Moravce",
    "SK0311": "Okres Bytča",
    "SK0312": "Okres Čadca",
    "SK0313": "Okres Dolný Kubín",
    "SK0314": "Okres Kysucké Nové Mesto",
    "SK0315": "Okres Liptovský Mikuláš",
    "SK0316": "Okres Martin",
    "SK0317": "Okres Námestovo",
    "SK0318": "Okres Ružomberok",
    "SK0319": "Okres Turčianske Teplice",
    "SK031A": "Okres Tvrdošín",
    "SK031B": "Okres Žilina",
    "SK0321": "Okres Banská Bystrica",
    "SK0322": "Okres Banská Štiavnica",
    "SK0323": "Okres Brezno",
    "SK0324": "Okres Detva",
    "SK0325": "Okres Krupina",
    "SK0326": "Okres Lučenec",
    "SK0327": "Okres Poltár",
    "SK0328": "Okres Revúca",
    "SK0329": "Okres Rimavská Sobota",
    "SK032A": "Okres Veľký Krtíš",
    "SK032B": "Okres Zvolen",
    "SK032C": "Okres Žarnovica",
    "SK032D": "Okres Žiar nad Hronom",
    "SK0411": "Okres Bardejov",
    "SK0412": "Okres Humenné",
    "SK0413": "Okres Kežmarok",
    "SK0414": "Okres Levoča",
    "SK0415": "Okres Medzilaborce",
    "SK0416": "Okres Poprad",
    "SK0417": "Okres Prešov",
    "SK0418": "Okres Sabinov",
    "SK0419": "Okres Snina",
    "SK041A": "Okres Stará Ľubovňa",
    "SK041B": "Okres Stropkov",
    "SK041C": "Okres Svidník",
    "SK041D": "Okres Vranov nad Topľou",
    "SK0421": "Okres Gelnica",
    "SK0422": "Okres Košice I",
    "SK0423": "Okres Košice II",
    "SK0424": "Okres Košice III",
    "SK0425": "Okres Košice IV",
    "SK0426": "Okres Košice - okolie",
    "SK0427": "Okres Michalovce",
    "SK0428": "Okres Rožňava",
    "SK0429": "Okres Sobrance",
    "SK042A": "Okres Spišská Nová Ves",
    "SK042B": "Okres Trebišov",
}

_vuc = areas
_obd = []
for i in range(1993,date.today().year):
    _obd.append(i)

_poh = [0,1,2]

urls = {
    "om7102rr": ["om7102rr_vuc","om7102rr_obd","om7102rr_ukaz","om7102rr_poh"],
    "om7038rr": ["om7038rr_vuc","om7038rr_obd","om7038rr_ukaz","om7038rr_poh"],
    "om7034rr": ["om7034rr_vuc","om7034rr_obd","om7034rr_vek","om7034rr_poh"],
    "om7009rr": ["om7009rr_vuc","om7009rr_obd","om7009rr_ukaz","om7009rr_poh","om7009rr_vek"],
    "om7011rr": ["om7011rr_vuc","om7011rr_obd","om7011rr_ukaz"],
    "om7023rr": ["om7023rr_vuc","om7023rr_obd","om7023rr_ukaz","om7023rr_vsk"],
    "om7023rr": ["om7023rr_vuc","om7023rr_obd","om7023rr_ukaz","om7023rr_vsk"],
    "om7015rr": ["om7015rr_vuc","om7015rr_obd","om7015rr_ukaz"],    
}

#"sv3024rr": ["nuts3","sv3024rr_rok","sv3024rr_ukaz","sv3024rr_dim0","sv3024rr_dim1","sv3024rr_dim2"],
#"zd3002rr": ["nuts14","zd3002rr_rok","zd3002rr_ukaz","zd3002rr_dim1","zd3002rr_dim2"],
#"sk3003rr": ["nuts13","sk3003rr_rok","sk3003rr_ukaz","sk3003rr_dim1"],


slovnik_datasetu = {}
#kody = "om7102rr"

def vyrob_url_z_textu(text,co):
    index_hladaneho = text.find(co)
    index = index_hladaneho
    index_konca = 0
    index_zaciatku = 0
    for i in range(100):
        if (text[index] == '"'):
            index_konca = index
            break
        else:
            index += 1
    index = index_hladaneho
    for i in range(100):
        if (text[index] == '"'):
            index_zaciatku = index
            break
        else:
            index -= 1
    vysledok = text[index_zaciatku:index_konca]
    vysledok = vysledok.replace('"','').replace("\/","/")
    return vysledok

#['om7102rr_vuc', 'om7102rr_obd', 'om7102rr_ukaz', 'om7102rr_poh']
#date.today().year (int)
def vyrob_prve_url(co, lis):
    url = "https://data.statistics.sk/api/v2/dataset/" + co + '/'
    for prvok in lis:
        if (prvok.find("_vuc") != -1):
            url += 'SK0101/' #Okres Bratislava I.
        elif (prvok.find("_obd") != -1):
            co = date.today().year - 1 #minuly rok
            co = str(co)
            url += co + '/'
        elif (prvok.find("_poh") != -1):
            url += '0/' #pohlavie spolu
        elif (prvok.find("_vek") != -1):
            url += 'all/' #vek spolu
        elif (prvok.find("_ukaz") != -1):
            url += '0/' #ukazovatel 0
        elif (prvok.find("_vsk") != -1):
            url += 'all/' #Velkostné skupiny obcí
        #else:
            #print('--> ' + prvok)
        else:
            return ''
    return url[:-1]
    
def hl_funkcia(kod_datasetu):
    url_vsetkych = "https://data.statistics.sk/api/v2/collection"
    response = requests.get(url_vsetkych)
    if (response.status_code) == 200: #200 HTTP status code = OK
        html_text = response.text #html (str)
        hladaj = html_text.find(kod_datasetu)
        if (hladaj != -1):#API pre dataset existuje
            url_datasetu = vyrob_url_z_textu(html_text,kod_datasetu)
            url_datasetu = url_datasetu.replace('?lang=sk','')
            response = requests.get(url_datasetu)
            if (response.status_code) == 200:
                udaje = response.json()
                slovnik_datasetu['nazov'] = udaje['label']
                vysledok = udaje["id"]
                vysledok.remove(kod_datasetu+'_data') #vsetko co obsahuje url
                print(vysledok)
                print(url_datasetu)
                prva_url = vyrob_prve_url(kod_datasetu,vysledok)
                if prva_url != '':
                    #print(prva_url)
                    response = requests.get(prva_url)
                    if (response.status_code) == 200:
                        kolko = len(response.json()["dimension"][kod_datasetu+'_ukaz']["category"]["index"])
                        print(kolko)
                        #['om7102rr_vuc', 'om7102rr_obd', 'om7102rr_ukaz', 'om7102rr_poh']
                        #url = "https://data.statistics.sk/api/v2/dataset/" + kod_datasetu + '/'
                        #for vys in vysledok:
                            #if (vys.find('_vuc') != -1):
                                #for v in _vuc:
                                    #url1 = url + v +'/'
                                    #print(url1)
                            
                            #url += vys+'/'
                            #print(url)

#for k in urls:
    #hl_funkcia(k)
hl_funkcia("om7102rr")


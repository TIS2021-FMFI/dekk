
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

#api_url = "https://data.statistics.sk/api/v2/dataset/om7102rr/SK0413/2019/0/0"
#response = requests.get(api_url)
#x = response.json()['value'] #response.json()['value']
#print(response.json()['dimension']['om7102rr_vuc']['category']['label'].values()) 


#print(str(x) + ' a ma byt 37541')
#print(date.today().year) #int

'''
data = ["om7102rr","om7038rr"] #na druhe = om7029rr, nie je API
nic2 = dict()

for d in data:
    nic = dict()
    #rok ktorý je aktuálne teraz, este v datacube nebude, takže okey
    for year in range(1993,1995):
        #om7102rr_vuc -> rok -> okres -> [all,M,F]
        x = dict()
        for area in areas:
            api_url = "https://data.statistics.sk/api/v2/dataset/"+d+"/"+area+"/"+str(year)+"/0/0"
            response = requests.get(api_url)
            try:
                x[area] = response.json()['value'][:3]
            except:
                x[area] = ""
        nic[year] = x
    nic2[d] = nic

print(nic2)
'''

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

'''
urls1 = {
   "om7102rr": {"nazov": "Počet obyvateľov podľa pohlavia - SR-oblasť-kraj-okres, m-v (ročne)",
                "parametre": {
                    
                    }
                } 
}
'''

#ak bude vysledok empty niečo je zle
def zisti_parametre_pre(cube_code):
    vysledok = []
    rok = date.today().year - 1
    api_url = "https://data.statistics.sk/api/v2/dataset/"+cube_code+"/SK0101/"+str(rok)+"/0/0"
    print(api_url)
    response = requests.get(api_url)
    if (response.status_code) == 200: #200 HTTP status code = OK
        cele = response.json()["dimension"][cube_code+"_ukaz"]["category"]
        print(cele["label"])
        return []
    else:
        return []
    

data = ["om7102rr"]
'''
for d in data:
    #rok ktorý je aktuálne teraz, este v datacube nebude, takže okey
    for year in range(1993,1994):
        api_url = "https://data.statistics.sk/api/v2/dataset/"+d+"/SK0101/"+str(year)+"/0/0"
        print(api_url)
        response = requests.get(api_url)
        if (response.status_code) == 200: #200 HTTP status code = OK
            print(response.json())
'''

zisti_parametre_pre(data[0])

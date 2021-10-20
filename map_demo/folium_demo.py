from folium import plugins
import pandas as pd
import json

import folium
import geocoder

# What is Folium?
# So the million-dollar question first – what in the world is Folium?
#
# Folium is a Python library used for visualizing geospatial data. It is easy to use and yet a powerful library. 
# Folium is a Python wrapper for Leaflet.js which is a leading open-source JavaScript library for plotting interactive maps.
# quickstart guide to folium: https://python-visualization.github.io/folium/quickstart.html
# video guide: https://www.youtube.com/watch?v=t9Ed5QyO7qY
#
# ------------------------------------------------------------------------------------------------------------------------------------------------------------
#                                                                                                                                           
# na vykreslovanie a vyfarbovanie potrebujeme dva subory, geojson resp. json a csv                                                          
# v geojsone su koordinaty krajov, alebo okresov, ktore spolu vytvoria polygon (koordinaty v sirke a vyske)                                 
# celkom pekna aplikacia na prehliadanie json: http://jsonviewer.stack.hu/ da sa vdaka nej lepsie vidiet strukturu jsonu                    
# v csv subore mame potom statistiky (napr. pocet obyvatelov na kraj, atd..)                                                                
# ak chceme aby sa data spravne mapovali podla csv suboru na kraje z geojsonu tak musia mat rovnaky kluc pre kraje (rovnake meno kraja)     
#                                                                                                                                           
# ------------------------------------------------------------------------------------------------------------------------------------------------------------
#
# NACITANIE FILES Z WEBOVEJ ADRESY
# geoJSON Slovakia: https://github.com/drakh/slovakia-gps-data - zdroj geoJSONov pre Slovensko
# podadresar EPSG 4326 je ten, ktory budeme pouzivat - koordinaty ma v latitude, longitude 
# csv subory si chceme tahat z DataCube, atd...

# geoJSON krajov
state_geo = 'https://raw.githubusercontent.com/jankopp/data/master/Slovakia.json'

# kriminalita podla krajov - 1. dataset
state_crime = 'https://raw.githubusercontent.com/jankopp/data/master/crimesSlovakia.csv'

# -------------------------------------------------------------------------------------------------------------------------------------------------------------
#
# NACITANIE FILES LOKALNE
# with open('Slovakia.json', encoding='utf-8') as f: # musi byt nastaveny spravny encoding
#     state_geo = json.load(f)

# with open('crimeSlovakia.csv', encoding='utf-8') as f:
#     state_data = pd.read_csv(f, sep=';', encoding='utf-8')


# geoJSON okresov
geoJson_test = 'https://raw.githubusercontent.com/drakh/slovakia-gps-data/master/GeoJSON/epsg_4326/districts_epsg_4326.geojson'

# nezamestnanost podla okresov - 2. dataset
state_unemployment = 'https://raw.githubusercontent.com/janpastorek/data/master/pocetObyv.csv'

# -------------------------------------------------------------------------------------------------------------------------------------------------------------
# z csv suboru si potrebujeme vyrobit pandas dataFrame objekt
# pandas.read_csv doc: https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html

state_data = pd.read_csv(state_crime, sep=";" , encoding='utf-8') # output je dataframe obj, encoding utf-8 kvoli slovenskym znakom
state_data1 = pd.read_csv(state_unemployment, sep="," , encoding='utf-8')

# v state_data mame ulozenu kriminalitu podla krajov, je tu ale problem:
# kriminalita je vycislena vo formate 10973,00 ale python toto nevie prekonvertovat zo stringu na float

# print(state_data)
state_data['Pripady'] = state_data['Pripady'].apply(lambda x: float(x.replace(',', ''))/100) # z 10973,00 vymazeme ciarku a vydelime 100 aby sme dostali 10973
# state_data['Pripady'] = state_data['Pripady'].astype(float)
state_data['Kraj'].astype(str)
# print(state_data)


# v state_data1 mame ulozeny pocet obyvatelov podla okresov, ale je tu znova problem:
# v state_data1 mame okresy pomenovane ako 'Okres Bratislava I' zatial co v geoJSONe iba 'Bratislava I'
# print(state_data1)
state_data1['Okres'] = state_data1['Okres'].apply(lambda x: x.replace('Okres ', '')) # nahradime 'Okres ' za '' cim dostavame rovnaky key ako v geoJSONe
state_data1['Okres'].astype(str)
# print(state_data1)

# data mame pripravene na pouzitie

# -------------------------------------------------------------------------------------------------------------------------------------------------------------
# VYKRESLOVANIE MAPY
# pre nas zaujimave parametre:
# location = latitude a longitude, na ktoru sa na zaciatku mapa centruje (48.8, 20 je stred Slovenska)
# zoom_start = pociatocny zoom
# tiles = ako mapka vyzera, da sa ich neskor pridat viac, niektore su built-in ale daju sa loadovat aj z url - vtedy treba aj parameter attr
# control_scale = miera v lavom dolnom rohu
# prefer_canvas = ak sa da tak sa vykreslovanie layerov pocita na back-ende?
# 
# 
# odtialto si viete tahat rozne styly pre mapku
# leaflet tile providers: http://leaflet-extras.github.io/leaflet-providers/preview/

m = folium.Map(location=[48.8, 20], zoom_start=8,
               tiles = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', 
               attr='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
               control_scale = True,
               prefer_canvas = True) 

# takto sa daju pridavat dalsie styly, kazdy novy styl sa prida ako radiobutton
folium.TileLayer('Stamen Terrain').add_to(m)
folium.TileLayer('Stamen Toner').add_to(m)
folium.TileLayer('Stamen Water Color').add_to(m)
folium.TileLayer('cartodbpositron').add_to(m)
folium.TileLayer('cartodbdark_matter').add_to(m)

# takto sa da pridat minimapa do praveho dolneho rohu
minimap = plugins.MiniMap(toggle_display=True)
m.add_child(minimap)

# geocoder vie z lubovolnej adresy vygenerovat latitude a longitude - osm = open street map
address = geocoder.osm('Cierny Chodnik, Bratislava, Slovakia')
pos = (address.lat, address.lng)
folium.Marker(pos, popup='Marker', tooltip='click').add_to(m)

# full screen button
plugins.Fullscreen(
    title='Expand me',
    title_cancel='Exit fullscreen',
    force_separate_button=True
).add_to(m)

# -------------------------------------------------------------------------------------------------------------------------------------------------------------
# takto sa da do mapy pridat geoJSON bez linkovania so statistikami
# folium.GeoJson(geoJson_test, name='geoJSON Slovakia').add_to(m)

# VYKRESLOVANIE DAT POMOCOU CHOROPLETH
# https://python-visualization.github.io/folium/quickstart.html#Choropleth-maps
# farby: https://colorbrewer2.org/#type=sequential&scheme=YlOrBr&n=3
#
# geo_data = json s ohraniceniami regionov
# data = statistiky, ktore chceme vykreslovat
# columns = z ktorych stlpcov v data chceme vykreslovat, v nasom pripade mame iba dva
# key_on = ako sparovat prvy stlpec z datasetu s geoJSONom, teda ak Kraj je Bratislava potrebujem uviest kde presne je v jsone Bratislava
# fill_color = farba 
# fill/line_opacity = priesvitnost
# legend_name co sa zobrazuje hore pod skalov

folium.Choropleth(
    geo_data=state_geo,
    name='Kriminalita',
    data=state_data,
    columns=['Kraj', 'Pripady'],
    key_on='feature.properties.TXT',
    fill_color='YlGn',
    fill_opacity=0.5,
    line_opacity=0.2,
    legend_name='Kriminalita na Slovensku'
).add_to(m)

folium.Choropleth(
    geo_data=geoJson_test,
    name='Počet obyvateľov',
    data=state_data1,
    columns=['Okres', 'Počet'],
    key_on='feature.properties.NM3',
    fill_color='PuRd',
    fill_opacity=0.5,
    line_opacity=0.2,
    legend_name='Počet obyvateľov'
).add_to(m)

# -------------------------------------------------------------------------------------------------------------------------------------------------------------
# GENEROVANIE HTML

folium.LayerControl().add_to(m) # treba pridat az na konci, neviem uplne ze preco ale inak to nefunguje...

# vyrob html
m.save('map.html')

m # vykresli mapu 
// global variables

let maxValue = 0; // global max value in a dataset for calculating color split
let districts;
let geojson;
let info;
let legend;

function sendRequest() {
    // send request to backend if 2 datasets are selected
    xmlHttp = new XMLHttpRequest();

    //TODO: naplnit tieto IDCKA zmysluplnymi hodnotami
    id1 = 1;
    id2 = 2;

    // url = "/loadData/" + id1.id.replace("checkData", "") + "/" + id2.id.replace("checkData", "");
    url = "/loadData/" + id1 + "/" + id2;
    console.log(url);
    xmlHttp.onreadystatechange = onResponse1;
    xmlHttp.open("GET", url);
    xmlHttp.send();
}


function onResponse1() {
    // handles response
    if(xmlHttp.readyState == 4 && xmlHttp.status == 200)   {

        // document.getElementById('odpoved').innerHTML = xmlHttp.responseText;

        // remove any previous layers
        map.eachLayer(layer => { if (layer.id == 'tileset') map.removeLayer(layer)});

        districts = addValueProperty(csvToDict());
        maxValue = d3.max(districts['features'], o => o.properties.value);
        console.log(maxValue);

        geojson = L.geoJson(districts, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);

        // info pane
        if (!info) {
            info = L.control();

            info.onAdd = function (map) {
                this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
                this.update();
                return this._div;
            };

            // method that we will use to update the control based on feature properties passed
            info.update = function (props) {
                this._div.innerHTML = '<h4>Počet obyvateľov</h4>' +  (props ?
                    '<b>' + props.NM3 + '</b><br/>Populácia: ' + props.value
                    : 'Nadíď kurzorom nad okres');
            };

            info.addTo(map);
        }

        // color legend
        if (!legend) {
            legend = L.control({position: 'bottomright'});

            legend.onAdd = function (map) {
                let x = Math.floor(maxValue / 7);
                let div = L.DomUtil.create('div', 'info legend'),
                    grades = [0, 1*x, 2*x, 3*x, 4*x, 5*x, 6*x, 7*x],
                    labels = [];

                    // loop through our density intervals and generate a label with a colored square for each interval
                for (let i = 0; i < grades.length; i++) {
                    div.innerHTML +=
                        '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
                }

                return div;
            };

            legend.addTo(map);
        }



//         responnse = JSON.parse(xmlHttp.responseText);

//         console.log(responnse);
//         L.geoJson(okresy, {style: style}).addTo(map);
    }
}

// returns color of district
function getColor(d){

    let x = Math.floor(maxValue / 7); // colors are evenly split between 0 and maxValue
    return d > 7*x  ? '#800026' :
            d > 6*x ? '#BD0026' :
            d > 5*x ? '#E31A1C' :
            d > 4*x ? '#FC4E2A' :
            d > 3*x ? '#FD8D3C' :
            d > 2*x ? '#FEB24C' :
            d > 1*x ? '#FED976' :
                      '#FFEDA0';
}

// style districts
function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.value)
    };
}

// converts csv into a dictionary for ease of use
// Okres Bratislava I, 213214  --->  result['Bratislava I'] = 213214

function csvToDict() {
    // todo -> load data from the db
    let lines = data.split('\n');
    let result = {};

    for(let i = 1; i < lines.length; i++){
        let line = lines[i].split(',');
        line[0] = line[0].replace('Okres ', ''); // wont be neccessary with own data
        result[line[0]] = line[1];
    }
    
    return result;
}

// adds value property into the geoJSON object used by the map
function addValueProperty(valuesDict) {
    let districts = okresy;

    for (let i in districts['features']) {
        let district = districts['features'][i]['properties']['NM3'];

        if (valuesDict.hasOwnProperty(district)) {
            districts['features'][i]['properties']['value'] = parseInt(valuesDict[district]);
        }
    }

    return districts;
}

// highlighting
// onMouseover event
function highlightFeature(e) {
    let layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

// onMouseout event
function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

// onClick event
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

// register events
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

// global variables

let maxValue1;
let maxValue2; 
let districts1;
let districts2;
let geojson1;
let geojson2;
let info1;
let info2;
let legend1;
let legend2;
let selectOverlays;

function getParamsAndValues(){
    //TODO: zistit od pouzivatela datasety_type
    let dataset_type1 = 1;
    let dataset_type2 = 2;

    // getParametersAndYears(dataset_type1, dataset_type2);
    
    getValues(4, 5);
}

function getParametersAndYears(dataset_type1, dataset_type2){
    //TODO: get years
    xmlHttp = new XMLHttpRequest();  
    const url ="/loadParams/"+ dataset_type1 + "/" + dataset_type2;
    console.log(url);
    xmlHttp.onreadystatechange = onResponseParameters;
    xmlHttp.open("GET", url);
    xmlHttp.send();
}

function getValues(dataset_id1, dataset_id2){
    xmlHttp = new XMLHttpRequest();  
    const url = "/loadData/" + dataset_id1 + "/" + dataset_id2;
    console.log(url);
    xmlHttp.onreadystatechange = onResponseValues;
    xmlHttp.open("GET", url);
    xmlHttp.send();
}

function onResponseValues(){
    if(xmlHttp.readyState == 4 && xmlHttp.status == 200)   {
        response = JSON.parse(xmlHttp.responseText);

        console.log(response);


        districts1 = addValueProperty(response, 'dataset1');
        districts2 = addValueProperty(response, 'dataset2');

        console.log(districts1);
        console.log(districts2);
        console.log(okresy);
        drawMap();
        drawGraph(response);
    }
}

function sendRequest() {
    // send request to backend if 2 datasets are selected
    xmlHttp = new XMLHttpRequest();

    //TODO: naplnit tieto IDCKA zmysluplnymi hodnotami
    let id1 = 1;
    let id2 = 2;

    // url = "/loadData/" + id1.id.replace("checkData", "") + "/" + id2.id.replace("checkData", "");
    url = "/loadData/" + id1 + "/" + id2;
    console.log(url);
    xmlHttp.onreadystatechange = onResponse1;
    xmlHttp.open("GET", url);
    xmlHttp.send();
}


function onResponseParameters(){
    if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
        response = JSON.parse(xmlHttp.responseText);
        console.log(response);
        console.log(new Date().getTime());
    }

}


function drawMap() {
        // // remove any previous layers
        // map.eachLayer(layer => { if (layer.id == 'tileset') map.removeLayer(layer); console.log(layer.id)});

        if (typeof geojson1 != 'undefined' && typeof geojson2 != 'undefined') {
            info1.remove();
            info2.remove();
            legend1.remove();
            legend2.remove();
            geojson1.remove();
            geojson2.remove();
            selectOverlays.remove();
        }

        maxValue1 = d3.max(districts1['features'], o => o.properties.value);
        maxValue2 = d3.max(districts2['features'], o => o.properties.value);
        // console.log(maxValue);
        // console.log(maxValue2);

        geojson1 = L.geoJson(districts1, { // dataset1
            style: style1,
            onEachFeature: onEachFeature
        });

        geojson2 = L.geoJson(districts2, { // dataset2
            style: style2,
            onEachFeature: onEachFeature
        });

        let overlay1 = {
            'dataset1': geojson1,
            'dataset2': geojson2
        }

        
        selectOverlays = L.control.layers(null, overlay1, {collapsed: false, sortLayers: true});
        selectOverlays.addTo(map);

        info1 = initializeInfoPane(info1, 'Dataset 1');
        info2 = initializeInfoPane(info2, 'Dataset 2');
        legend1 = initializeLegendPane(legend1, maxValue1, 'dataset1');
        legend2 = initializeLegendPane(legend2, maxValue2, 'dataset2');

        // show/ hide legend and pane
        map.on('overlayadd', function(overlay) {
            if (overlay['name'] == 'dataset1') {
                info1.addTo(map);
                legend1.addTo(map);

                // different overlay load orders result in different coloring of the map -> we dont want that
                // rearrange geojsons so that geojson2 is always on top resulting in consistent color palette

                if (map.hasLayer(geojson2)) {
                    geojson2.remove();
                    geojson2.addTo(map);
                }
            }
            if (overlay['name'] == 'dataset2') {
                info2.addTo(map);
                legend2.addTo(map);
            }
        })

        map.on('overlayremove', function(overlay) {
            if (overlay['name'] == 'dataset1') {
                info1.remove();
                legend1.remove();
            }
            if (overlay['name'] == 'dataset2') {
                info2.remove();
                legend2.remove();
            }
        })
    
}

function initializeInfoPane(pane, datasetName='Dataset', datasetProperty='Value: ') {
    pane = L.control();

    pane.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    pane.update = function (props) {
        if ((map.hasLayer(geojson1) && datasetName == 'Dataset 1') || (map.hasLayer(geojson2) && datasetName == 'Dataset 2')) // TODO figure out better logic when datasets arent called Dataset 1/Dataset 2 ...
            this._div.innerHTML = '<h4>' + datasetName + '</h4>' +  (props ?
                '<b>' + props.NM3 + '</b><br/>' + datasetProperty + props.value
                : 'Nadíď kurzorom ponad okres');
    };

    return pane;
}

function initializeLegendPane(pane, maxValue, dataset) {
    pane = L.control({position: 'bottomright'});

    pane.onAdd = function (map) {
        let x = Math.floor(maxValue / 6);
        let div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1*x, 2*x, 3*x, 4*x, 5*x, 6*x, 7*x],
            labels = [];

        // loop through our data intervals and generate a label with a colored square for each interval
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1, dataset) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    return pane;
}

// returns color of district
function getColor(d, dataset){
    if (dataset == 'dataset1') {
        let x = Math.floor(maxValue1 / 7); // colors are evenly split between 0 and maxValue

        return  d > 7*x ? '#800026' :
                d > 6*x ? '#BD0026' :
                d > 5*x ? '#E31A1C' :
                d > 4*x ? '#FC4E2A' :
                d > 3*x ? '#FD8D3C' :
                d > 2*x ? '#FEB24C' :
                d > 1*x ? '#FED976' :
                          '#FFEDA0';
    } else {
        let x = Math.floor(maxValue2 / 7); // colors are evenly split between 0 and maxValue

        return  d > 7*x ? '#06415c' :
                d > 6*x ? '#005b71' :
                d > 5*x ? '#007472' :
                d > 4*x ? '#008b5c' :
                d > 3*x ? '#539e37' :
                d > 2*x ? '#a7a900' :
                            '#ffa600' ;
    }
}



// style districts
function style1(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: '#007472',
        dashArray: '3',
        fillOpacity: 0.5,
        fillColor: getColor(feature.properties.value, 'dataset1')
    };
}
function style2(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: '#007472',
        dashArray: '3',
        fillOpacity: 0.5,
        fillColor: getColor(feature.properties.value, 'dataset2')
    };
}


// modifies geoJSON to contain respective values per district
function addValueProperty(valuesDict, dataset) {
    let districts = JSON.parse(JSON.stringify(okresy)); // deep copy okresy into districts, do not modify okresy

    for (let i in districts['features']) {
        let district = districts['features'][i]['properties']['NM3'];

        if (valuesDict[dataset].hasOwnProperty(district)) {
            districts['features'][i]['properties']['value'] = parseFloat(valuesDict[dataset][district]);
        }
    }

    return districts;

}

// highlighting
// onMouseover event
function highlightFeature(e) {
    let layer = e.target;

    layer.setStyle({
        weight: 4,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    // console.log(e.latlng);
    // console.log(layer);
    let layers = leafletPip.pointInLayer(e.latlng, geojson1).concat(leafletPip.pointInLayer(e.latlng, geojson2));
    // console.log(layers)

    if (layers.length == 2) {
        if (map.hasLayer(geojson1)) info1.update(layers[0].feature.properties);
        if (map.hasLayer(geojson2)) info2.update(layers[1].feature.properties);
    }
}

// onMouseout event
function resetHighlight(e) {
    if (map.hasLayer(geojson1)) {
        geojson1.resetStyle(e.target);
        info1.update();
    }
    if (map.hasLayer(geojson2)) {
        geojson2.resetStyle(e.target);
        info2.update();
    }
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

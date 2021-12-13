
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

        responnse = JSON.parse(xmlHttp.responseText);

        console.log(responnse);
        
        L.geoJson(okresy, {style: style}).addTo(map);
    }
}

// returns color of district
function getColor(d) {
    return d > 9 ? '#800026' :
            d > 8  ? '#BD0026' :
            d > 7  ? '#E31A1C' :
            d > 6  ? '#FC4E2A' :
            d > 5  ? '#FD8D3C' :
            d > 4   ? '#FEB24C' :
            d > 3   ? '#FED976' :
                        '#FFEDA0';
}

// style districts
function style(value) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(Math.random()*10)
    };
}


function getParamsAndValues(){
    //TODO: zistit od pouzivatela datasety_type
    let dataset_type1 = 1;
    let dataset_type2 = 2;

    // getParametersAndYears(dataset_type1, dataset_type2);
    
    // getValues(1, 2);
}

function getParametersAndYears(dataset_type1, dataset_type2){
    //TODO: get years
    xmlHttp = new XMLHttpRequest();  
    const url ="/loadParams/"+ dataset_type1 + "/" + dataset_type2;
    console.log(url);
    xmlHttp.onreadystatechange = onResponseValues;
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
    if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
        response = JSON.parse(xmlHttp.responseText);

        console.log('onResponseValues response: ');
        console.log(response);

        districts1 = addValueProperty(response, 'dataset1', response['ds1']);
        districts2 = addValueProperty(response, 'dataset2', response['ds2']);

        MapModule.addLayers(districts1, districts2);
        GraphModule.drawGraph(response);
    }
}

function sendRequest(url) {

    console.log("LOG: " + url);
    // send request to backend if 2 datasets are selected
    xmlHttp = new XMLHttpRequest();

    console.log(url);
    xmlHttp.onreadystatechange = onResponseValues;
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

// modifies geoJSON to contain respective values per district
function addValueProperty(valuesDict, datasetKey, datasetName) {
    let districts = JSON.parse(JSON.stringify(okresy)); // deep copy okresy into districts, do not modify okresy
    districts['datasetName'] = datasetName;

    for (let i in districts['features']) {
        let district = districts['features'][i]['properties']['NM3'];

        if (valuesDict[datasetKey].hasOwnProperty(district)) {
            districts['features'][i]['properties']['value'] = parseFloat(valuesDict[datasetKey][district]);
        }
    }
    return districts;
}
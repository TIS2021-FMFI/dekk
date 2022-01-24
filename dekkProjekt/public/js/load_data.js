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

        if (response == 0) {
            alert('Nepodarilo sa načítať zvolené datasety.');
            return;
        }

        const datasetsCount = (Object.keys(response).length == 2) ? 1 : (Object.keys(response).length - 1) / 2;
        const districts = [];

        console.log(datasetsCount);

        for(let i = 0; i < datasetsCount; i++) {
            const dataset = 'dataset' + (i + 1);
            const name = 'ds' + (i + 1);
            districts.push(addValueProperty(response, dataset, response[name]));
        }

        MapModule.addLayers(districts);

        if (datasetsCount == 2) GraphModule.drawGraph(response); // display graph if two datasets are selected
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
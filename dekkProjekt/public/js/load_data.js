

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

        MapModule.addLayers(districts1, districts2);
        GraphModule.drawGraph(response);
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


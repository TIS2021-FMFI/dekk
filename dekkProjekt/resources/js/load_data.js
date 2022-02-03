

const DataLoader = (() => {

    function onResponseValues(){
        if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
            response = JSON.parse(xmlHttp.responseText);
    
            console.log('onResponseValues response: ');
            console.log(response);
    
            if (response == 0) {
                alert('Nepodarilo sa načítať zvolené datasety. Pravdepodobne neexistuje jeden z datasetov pre zvolený rok.');
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
    
        // send request to backend if 2 datasets are selected
        xmlHttp = new XMLHttpRequest();
    
        console.log("URL: ", url);
        xmlHttp.onreadystatechange = onResponseValues;
        xmlHttp.open("GET", url);
        xmlHttp.send();
    }

    // called onload from selectpicker
    function loadAllDataSetParams() {
        // load all parameters with years
        xmlHttp = new XMLHttpRequest();
        url = '/datasetParams';
        xmlHttp.onreadystatechange = onResponseAllDataSetParamas;
        xmlHttp.open("GET", url);
        xmlHttp.send();
    }

    // setup dropdown selection
    function onResponseAllDataSetParamas(){
        // handles response
        const dNames = [];
        if(xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            const dict = JSON.parse(xmlHttp.responseText);
            console.log(dict);
            
            for (const datasetName in dict) {
                // needs to be sorted before inserting into dropdown
                dNames.push(datasetName);
            }

            // populate dropdown menu with the response
            DropdownModule.populateDropdown(dNames, dict);
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

    return {
        sendRequest,
        loadAllDataSetParams
    }
})();

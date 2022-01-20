window.datasetsDict;
var datasetsDictLength = 0;
var datasetsNames = [];
var selectedParamsIDs = [];
var selectedDatasetsArray = [];
loadAllDataSetParams();

// called onload from selectpicker
function loadAllDataSetParams(){
    // load all parameters with years
    xmlHttp = new XMLHttpRequest();
    url = '/datasetParams';
    xmlHttp.onreadystatechange = onResponseAllDataSetParamas;
    xmlHttp.open("GET", url);
    xmlHttp.send();
}

function getMaxID() {
    var max = 0;
    for (const datasetName in window.datasetsDict) {
        for (const paramName in window.datasetsDict[datasetName]) {
            if(paramName == "years") continue;
            for (const unique_param_id in window.datasetsDict[datasetName][paramName]) {
                if(Number(unique_param_id) > max) max = unique_param_id;
            }
        }
    }
    return max;
}

// creates/fills window.datasetsDict
function onResponseAllDataSetParamas(){
    // handles response
    if(xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        window.datasetsDict = JSON.parse(xmlHttp.responseText);
        datasetsDictLength = Object.keys(window.datasetsDict).length;
        
        console.log("LEN:" + datasetsDictLength);
        console.log(window.datasetsDict);
        
        // populate selectpicker with available datasets - no whitespaces for ids, so _
        for (var datasetName in window.datasetsDict) {
            var noWhitespaceDName = datasetName.replace(/\s+/g, '_');
            document.getElementById("selectpicker").innerHTML += "<option id="+noWhitespaceDName+"></option>";
            document.getElementById(noWhitespaceDName).innerHTML = datasetName;
        }
        $('.selectpicker').selectpicker('refresh');
    }
}

function getSelectedDatasetsParams() {
    console.log("SELECTED DATASETS: " + $("#selectpicker").val());
    selectedDatasetsArray = $("#selectpicker").val();

    if(selectedDatasetsArray === null) {
        document.getElementById("selected_dataset0").innerHTML = null;
        document.getElementById("selected_dataset1").innerHTML = null;
        document.getElementById("selected_datasets").style.display = "none";
        document.getElementById("selected_dataset_params0").innerHTML = null;
        document.getElementById("selected_dataset_params1").innerHTML = null;
    }
    else {
        document.getElementById("selected_dataset0").innerHTML = selectedDatasetsArray[0];
        document.getElementById("selected_dataset_params0").innerHTML = null;
        if(selectedDatasetsArray.length == 1) {
            document.getElementById("selected_dataset1").innerHTML = null;
            document.getElementById("selected_dataset_params1").innerHTML = null;
        }
        else document.getElementById("selected_dataset1").innerHTML = selectedDatasetsArray[1];
        document.getElementById("selected_datasets").style.display = "block";
    }
    if(selectedDatasetsArray != null) showParameters();
};

function insertParamDiv(dNum, datasetName, paramName, unique_param_id) {
    var group = datasetName + '_' + paramName;
    document.getElementById("selected_dataset_params"+dNum).innerHTML += '<div class="pretty p-svg p-plain" id="unique_'+
    unique_param_id +'" style="margin: 0.5em;"><input type="radio" name="'+group+'" id="puID_'+unique_param_id+'" /><div class="state"><img class="svg" src="/svg/task.svg"><label>'+ 
    window.datasetsDict[datasetName][paramName][unique_param_id] +'</label></div></div><br>';
}

//shows parameters on dropdown when dataset is picked
function showParameters() {
    console.log(window.datasetsDict);
    var dNum = 0;
    for (const datasetName of selectedDatasetsArray) {
        //console.log("DNAME: " + datasetName);
        for (const paramName in window.datasetsDict[datasetName]) {
            //console.log("PNAME: " + paramName);
            if(paramName != "years" && paramName != "spolu") {
                document.getElementById("selected_dataset_params"+dNum).innerHTML += '<div class="paramName" style="width:200px;"> '+ paramName +'</div><br>';
                for (const unique_param_id in window.datasetsDict[datasetName][paramName]) insertParamDiv(dNum, datasetName, paramName, unique_param_id);
            }
        }
        dNum++;
    }
};

function validateYear(datasetName, year) {
    return window.datasetsDict[datasetName]["years"].includes(year);
}

function getCheckedIDs() {
    var checkedIDs = [];
    for(let i = 1; i <= getMaxID(); i++) {
        var tmpElem = document.getElementById("puID_"+i);
        if(tmpElem != null) {
            console.log("puID_"+i + ": " + tmpElem.checked);
            if(tmpElem.checked) checkedIDs.push(i);
        }
    }

    // saves "spolu" IDs to checkedIDs for both picked datasets if no other parameters are picked
    if(checkedIDs.length == 0) {
        var tmpObject = window.datasetsDict[document.getElementById("selected_dataset0").innerHTML]["spolu"];
        if(tmpObject != null) checkedIDs.push(Number(Object.keys(tmpObject)[0]));
        else console.log("Parameter 'spolu' does not exist for selected_dataset0.");
        tmpObject = null;
        tmpObject = window.datasetsDict[document.getElementById("selected_dataset1").innerHTML]["spolu"];
        if(tmpObject != null) checkedIDs.push(Number(Object.keys(tmpObject)[0]));
        else console.log("Parameter 'spolu' does not exist for selected_dataset1.");
    }
    // if(checkedIDs.length < 2) popupAlert("Pre vybrané datasety neexistuje parameter 'spolu', vyberte parametre datasetov.")
    //console.log("PICKED IDs: " + checkedIDs);
    return checkedIDs;
}

function popupAlert(message) {
    alert(message);
}

function sendParamsIDsAndYear(year) {
    var url = "/loadData/";
    var datasetNameToIDs = getDatasetNameByParamValsIDs(getCheckedIDs());
    //console.log("--->" + datasetNameToIDs);
    for(datasetName in datasetNameToIDs) {
        for(id of datasetNameToIDs[datasetName]) url += id+"_";
        url = url.substring(0,url.length-1) + "/";
    }
    url += year;
    console.log("URL: " + url);
    sendRequest(url);
}

function getSelectedDatasetsSpoluIDs() {
    var spoluIDs = [];
    for (const datasetName of selectedDatasetsArray) {
        for (const paramName in window.datasetsDict[datasetName]) {
            if(paramName == "spolu") {
                spoluIDs.push(Object.keys(window.datasetsDict[datasetName][paramName])[0]);
            }
        }
    }
    return spoluIDs;
}

function clearPicked() {
    for(let i = 1; i <= getMaxID(); i++) {
        try {
            document.getElementById("puID_"+i).checked = false;
        }
        catch(e) {

        }
    }
}

function getDatasetNameByParamValsIDs(IDs) {
    var nameToID = [];
    for (const datasetName of selectedDatasetsArray) {
        for (const paramName in window.datasetsDict[datasetName]) {
            if(paramName == "years") continue;
            for (const unique_param_id of Object.keys(window.datasetsDict[datasetName][paramName])) {
                if(IDs.includes(Number(unique_param_id))) {
                    if(nameToID[datasetName] === undefined) nameToID[datasetName] = [unique_param_id];
                    else nameToID[datasetName].push(unique_param_id);
                }
            }
        }
    }
    return nameToID;
}

function getYearsIntersectionForSelectedDatasets() { 
    var min = 3000;
    var max = 0;
    var values = [];
    if(selectedDatasetsArray.length == 1) {
        //console.log(window.datasetsDict[selectedDatasetsArray[0]]["years"]);
        min = Math.min(...window.datasetsDict[selectedDatasetsArray[0]]["years"]);
        max = Math.max(...window.datasetsDict[selectedDatasetsArray[0]]["years"]);
        values.push(min);
        values.push(max);
    }
    if(selectedDatasetsArray.length == 2) {
        console.log("FST-YEARS: ", window.datasetsDict[selectedDatasetsArray[0]]["years"]);
        console.log("SND-YEARS: ", window.datasetsDict[selectedDatasetsArray[1]]["years"]);
        min = Math.min(...window.datasetsDict[selectedDatasetsArray[0]]["years"]);
        max = Math.max(...window.datasetsDict[selectedDatasetsArray[0]]["years"]);
        if(Math.min(...window.datasetsDict[selectedDatasetsArray[1]]["years"]) > min) min = Math.min(...window.datasetsDict[selectedDatasetsArray[1]]["years"]);
        if(Math.max(...window.datasetsDict[selectedDatasetsArray[1]]["years"]) < max) max = Math.max(...window.datasetsDict[selectedDatasetsArray[1]]["years"]);
        values.push(min);
        values.push(max);
    }
    setYearRangeForSlider(values);
    return values;
}

function setYearRangeForSlider(vals) {
    document.getElementById("myRange").min = vals[0];
    document.getElementById("myRange").max = vals[1];
    document.getElementById("sliderYear").innerHTML = vals[1];
}

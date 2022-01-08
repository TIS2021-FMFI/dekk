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
            for (const unique_param_id in window.datasetsDict[datasetName][paramName]) if(unique_param_id > max) max = unique_param_id;
        }
    }
    return max
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
    if(selectedDatasetsArray != null) showParameters(selectedDatasetsArray);
};

function getSpoluParamId(datasetName) {
    for (const unique_param_id in window.datasetsDict[datasetName]["spolu"]) if( window.datasetsDict[datasetName]["spolu"][unique_param_id] == "spolu" ) return unique_param_id;
    return null;
}

function insertParamDiv(dNum, datasetName, paramName, unique_param_id) {
    var group = datasetName + '_' + paramName;
    //if(paramName == "spolu" || paramName == "pohlavie") group = "sex";
    document.getElementById("selected_dataset_params"+dNum).innerHTML += '<div class="pretty p-svg p-plain" id="unique_'+
    unique_param_id +'" style="margin: 0.5em;"><input type="radio" name="'+group+'" id="puID_'+unique_param_id+'" /><div class="state"><img class="svg" src="/svg/task.svg"><label>'+ 
    window.datasetsDict[datasetName][paramName][unique_param_id] +'</label></div></div><br>';
}

//shows parameters on dropdown when dataset is picked
function showParameters(selectedDatasetsArray) {
    console.log(window.datasetsDict);
    var dNum = 0;
    for (const datasetName of selectedDatasetsArray) {
        console.log("DNAME: " + datasetName);
        for (const paramName in window.datasetsDict[datasetName]) {
            console.log("PNAME: " + paramName);
            if(paramName != "years" && paramName != "spolu") {
                document.getElementById("selected_dataset_params"+dNum).innerHTML += '<div class="paramName" style="width:200px;"> '+ paramName +'</div><br>';
                for (const unique_param_id in window.datasetsDict[datasetName][paramName]) insertParamDiv(dNum, datasetName, paramName, unique_param_id);
                
            }
        }
        dNum++;
    }
};

function validateYear(datasetName, year) {
    return window.datasetsDict[datasetName][years].includes(year);
}

function getCheckedIDs() {
    var checkedIDs = [];
    var allSpoluIDs = getSelectedDatasetsSpoluIDs();

    for(let i = 1; i <= getMaxID(); i++) {

        // spoluIDs passes, they don't have element with puID_
        if(allSpoluIDs.includes(i.toString())) continue;
        var tmpElem = document.getElementById("puID_"+i);
        console.log("puID_"+i + ": " + tmpElem.checked);
        if(tmpElem.checked) checkedIDs.push(i);
    }

    // saves "spolu" IDs to checkedIDs for both picked datasets if no other parameters are picked
    if(checkedIDs.length == 0) {
        checkedIDs.push(Object.keys(window.datasetsDict[document.getElementById("selected_dataset0").innerHTML]["spolu"])[0]);
        checkedIDs.push(Object.keys(window.datasetsDict[document.getElementById("selected_dataset1").innerHTML]["spolu"])[0]);
    }
    console.log("PICKED IDs: " + checkedIDs[0] + ";" + checkedIDs[1]);
    return checkedIDs;
}

function sendParamsIDsAndYear(year) {

    // url: loadData/1_3_5/6_8/2018
    var url = "/loadData/"+getCheckedIDs()[0]+"/"+getCheckedIDs()[1]+"/"+year;
    sendRequest(url);
}

function getAllSpoluIDs() {
    var spoluIDs = [];
    for (const datasetName in window.datasetsDict) {
        for (const paramName in window.datasetsDict[datasetName]) {
            if(paramName == "spolu") {
                spoluIDs.push(Object.keys(window.datasetsDict[datasetName][paramName])[0])
            }
        }
    }
    return spoluIDs;
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
    var pickedSpoluIDs = getSelectedDatasetsSpoluIDs();
    for(let i = 1; i <= getMaxID(); i++) {
        if(pickedSpoluIDs.includes(i.toString())) continue;
        document.getElementById("puID_"+i).checked = false;
    }
}


window.datasetsDict;
var datasetsDictLength = 0;
var datasetsNames = [];
var selectedParamsIDs = [];
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
    var selectedDatasetsArray = $("#selectpicker").val();

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
    if(paramName == "spolu" || paramName == "pohlavie") group = "sex";
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
            if(paramName != "years") {
                switch (paramName) {
                    case "spolu":
                        continue;
                    case "pohlavie":
                        document.getElementById("selected_dataset_params"+dNum).innerHTML += '<div class="paramName" style="width:200px;"> '+ paramName +'</div><br>';
                        for (const unique_param_id in window.datasetsDict[datasetName][paramName]) insertParamDiv(dNum, datasetName, paramName, unique_param_id);
                        let spoluID = getSpoluParamId(datasetName);
                        insertParamDiv(dNum, datasetName, "spolu", spoluID)
                        break;
                    default:
                        document.getElementById("selected_dataset_params"+dNum).innerHTML += '<div class="paramName" style="width:200px;"> '+ paramName +'</div><br>';
                        for (const unique_param_id in window.datasetsDict[datasetName][paramName]) insertParamDiv(dNum, datasetName, paramName, unique_param_id);
                        break;
                }
            }
        }
        dNum++;
    }
};

// returns IDs and YEARS of given dataset by its name
function getIDsAndYears(d_name) {
    var IDs = [];
    var years = window.datasetsDict[d_name].years;
    for (const paramName of Object.keys(window.datasetsDict[d_name])) {
        if(paramName != "years" && paramName != "id") {
            for(const id of Object.keys(window.datasetsDict[d_name][paramName])) IDs.push(id);
        };
    }
    console.log("getIDsAndYears(d_name) YEARS : "  + years);
    console.log("getIDsAndYears(d_name) IDs : "  + IDs);
    return {"IDs":IDs, "years":years}
}

function validateYear(datasetName, year) {
    return window.datasetsDict[datasetName][years].includes(year);
}

// check if checked datasets contain given (picked) year and if checked parameters are valid
// if yes -> send it all to sendRequest() function (parameters' ids and year) 
// else -> put up error message on page (no year for param1, no year for param2, no param checked, etc...)
function validateRequest(year) {
    var checkedIDs = [];
    for(let i = 1; i <= getMaxID(); i++) {
        if(i == 4) continue; // id=4 je spolu pre pocet donasok jedla za rok, ktore sa nebude zobrazovat, pretoze
                             // parameter spolu nemozer fungovat bez pohlavia...takto sa v html vynechalo divko pre dane id = 4

        var tmpElem = document.getElementById("puID_"+i);
        console.log("puID_"+i + ": " + tmpElem.checked);
        if(tmpElem.checked) checkedIDs.push(i);

    }

    sendRequest(checkedIDs, year);
}


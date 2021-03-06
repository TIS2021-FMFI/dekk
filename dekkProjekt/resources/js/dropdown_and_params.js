
const DropdownModule = (() => {
    var datasetsDict;
    var datasetsDictLength = 0;
    var datasetsNames = [];
    var selectedParamsIDs = [];
    var selectedDatasetsArray = [];

    function init() {
        setTimeout(() => {  DataLoader.loadAllDataSetParams(); }, 400); // first, load datasets (400ms should be enough), then input into dropdown selectpicker
    }
    
    
    // each dataset parameter's option (except years) has its own unique id, this function 
    // returns the highest possible dataset id
    function getMaxID() {
        var max = 0;
        for (const datasetName in datasetsDict) {
            for (const paramName in datasetsDict[datasetName]) {
                if(paramName == "years") continue;
                for (const unique_param_id in datasetsDict[datasetName][paramName]) {
                    if(Number(unique_param_id) > max) max = unique_param_id;
                }
            }
        }
        return max;
    }


    function populateDropdown(names, dict) {
        datasetsDict = dict;
        datasetsDictLength = Object.keys(dict).length;

        // sort array - function needed for capital and small leters
        names.sort(function(a,b) {
            a = a.toLowerCase();
            b = b.toLowerCase();
            if( a == b) return 0;
            return a < b ? -1 : 1;
        });
        // populate selectpicker with available datasets - no whitespaces for ids, so _
        for (var i = 0; i < names.length; i++){
            var noWhitespaceDName = names[i].replace(/\s+/g, '_');
            document.getElementById("selectpicker").innerHTML += "<option id="+noWhitespaceDName+"></option>";
            document.getElementById(noWhitespaceDName).innerHTML = names[i];
        }
        // refresh selectpicker
        $('.selectpicker').selectpicker('refresh');
    }
    
    // gets parameters for two/one/none selected dataset/s
    function getSelectedDatasetsParams() {
        console.log("SELECTED DATASETS: " + $("#selectpicker").val());
        selectedDatasetsArray = $("#selectpicker").val();
    
        if(selectedDatasetsArray.length == 0) {
            console.log('powpow');
            document.getElementById("selected_dataset0").innerHTML = null;
            document.getElementById("selected_dataset1").innerHTML = null;
            document.getElementById("selected_datasets").style.display = "none";
            document.getElementById("selected_dataset_params0").innerHTML = null;
            document.getElementById("selected_dataset_params1").innerHTML = null;
        }
        else {
            if(selectedDatasetsArray.length > 1) document.getElementById("selected_dataset0").innerHTML = selectedDatasetsArray[0] + '<br><span style="color: rgba(27, 21, 79, 1); font-weight: bolder; font-size: large;"> (Dataset A) </span>';
            else document.getElementById("selected_dataset0").innerHTML = selectedDatasetsArray[0];
            document.getElementById("selected_dataset_params0").innerHTML = null;
            if(selectedDatasetsArray.length == 1) {
                document.getElementById("selected_dataset1").innerHTML = null;
                document.getElementById("selected_dataset_params1").innerHTML = null;
            }
            else document.getElementById("selected_dataset1").innerHTML = selectedDatasetsArray[1] + '<br><span style="color: rgba(27, 21, 79, 1); font-weight: bolder; font-size: large;"> (Dataset B) </span>';
            document.getElementById("selected_datasets").style.display = "block";
        }
        if(selectedDatasetsArray != null) showParameters();
    };
    
    //shows parameters on dropdown when dataset is picked
    function showParameters() {
        var dNum = 0;
        for (const datasetName of selectedDatasetsArray) {
            for (const paramName in datasetsDict[datasetName]) {
                if(paramName != "years" && paramName != "spolu") {
                    document.getElementById("selected_dataset_params"+dNum).innerHTML += '<div class="paramName" style="width:200px;"> '+ paramName +'</div><br>';
                    for (const unique_param_id in datasetsDict[datasetName][paramName]) insertParamDiv(dNum, datasetName, paramName, unique_param_id);
                }
            }
            dNum++;
        }
    };
    
    // inserts html for parameter option (that is radiobutton with label)
    function insertParamDiv(dNum, datasetName, paramName, unique_param_id) {
        var group = datasetName + '_' + paramName;
        document.getElementById("selected_dataset_params"+dNum).innerHTML += '<label for="puID_'+unique_param_id+'"><input type="radio" name="'+group+'" id="puID_'+unique_param_id+'">&emsp;'+
        String(datasetsDict[datasetName][paramName][unique_param_id]) +'</label><br>';
    };
    
    // returns dataset's id by its name
    function getDatasetIDs(dName) {
        IDs = [];
        for (const datasetName of selectedDatasetsArray) {
            for (const paramName in datasetsDict[datasetName]) {
                if(paramName != "years") {
                    for (const unique_param_id in datasetsDict[datasetName][paramName]) {
                        if(datasetName === dName) IDs.push(Number(unique_param_id));
                    }
                }
            }
        }
        return IDs;
    }
    
    // controlls if allIDs and checkedIDs have at least one common dataset id
    function containsAnyID(checkedIDs, allIDs) {
        out = false;
        console.log(typeof(checkedIDs[0]) + " type " + typeof(allIDs[0]));
        for (var i = 0; i < allIDs.length; i++) {
            for (var j = 0; j < checkedIDs.length; j++) {
                if(Number(allIDs[i]) == Number(checkedIDs[j])) out = true;
            }
        }
        return out;
    }
    
    // gets all parameters' options checked IDs and does all the logic behind 'spolu' parameter 
    // (that is not listed in parameters options because it includes all options for parameter)
    // this parameter has also its own unique id and is picked when no other radio-boxes were picked
    // for given dataset; if dataset doesn't have this parameter user gets notified via alert about
    // which dataset doesn's have this value and needs to have its radioboxes checked
    function getCheckedIDs() {
        var checkedIDs = [];

        for(let i = 1; i <= getMaxID(); i++) {
            var tmpElem = document.getElementById("puID_"+i);
            if(tmpElem != null) {
                if(tmpElem.checked) checkedIDs.push(i);
            }
        }
        
        if(selectedDatasetsArray.length > 0) {
            d0IDs = getDatasetIDs(selectedDatasetsArray[0]);
            
            if(!containsAnyID(checkedIDs, d0IDs)) {
                // spolu param for d0
                console.log("FST " + d0IDs);
                console.log('undefined check ' + typeof datasetsDict[document.getElementById("selected_dataset0").innerHTML]);
                tmpObject = (typeof datasetsDict[document.getElementById("selected_dataset0").innerHTML] == 'undefined') ? null : datasetsDict[document.getElementById("selected_dataset0").innerHTML]["spolu"];
                if(tmpObject != null) checkedIDs.push(Number(Object.keys(tmpObject)[0]));
                else {
                    console.log("Parameter 'spolu' does not exist for selected_dataset0/'"+document.getElementById("selected_dataset0").innerHTML+"'");
                    alert("Pre dataset '"+document.getElementById("selected_dataset0").innerHTML.split("<br>")[0]+"' neexistuje parameter 'spolu' - vyberte si parametre.");
                }
            }
            if(selectedDatasetsArray.length == 2) {
                d1IDs = getDatasetIDs(selectedDatasetsArray[1]);
                if(!containsAnyID(checkedIDs, d1IDs)) {
                    // spolu param for d1
                    console.log("SND " + d1IDs);
                    console.log('undefined check2' + datasetsDict);
                    tmpObject = (typeof datasetsDict[document.getElementById("selected_dataset1").innerHTML] == 'undefined') ? null : datasetsDict[document.getElementById("selected_dataset1").innerHTML]["spolu"];
                    if(tmpObject != null) checkedIDs.push(Number(Object.keys(tmpObject)[0]));
                    else {
                        console.log("Parameter 'spolu' does not exist for selected_dataset1/'"+document.getElementById("selected_dataset1").innerHTML+"'");
                        alert("Pre dataset '"+document.getElementById("selected_dataset1").innerHTML.split("<br>")[0]+"' neexistuje parameter 'spolu' - vyberte si parametre.");
                    }
                }
            }
        }
    
        console.log("CHECKED IDs: " + checkedIDs);
        return checkedIDs;
    }
    
    
    // creates url with picked datasets' parameters' values (radiobox options) and picked year from slider
    // and sends it to sendRequest(url) function
    function sendParamsIDsAndYear(year) {
        var url = "/loadData/";
        var ids = getCheckedIDs();
        var datasetNameToIDs = getDatasetNameByParamValsIDs(ids);
        for(datasetName in datasetNameToIDs) {
            for(id of datasetNameToIDs[datasetName]) url += id+"_";
            url = url.substring(0,url.length-1) + "/";
        }
        url += year;
        DataLoader.sendRequest(url);
    }
    
    // clears picked radiobuttons
    function clearPicked() {
        for(let i = 1; i <= getMaxID(); i++) {
            try {
                document.getElementById("puID_"+i).checked = false;
            }
            catch(e) {
    
            }
        }
    }
    
    // finds owner dataset for given id and returns "dict" with key-datasetName and values-[unique_param_ids]
    function getDatasetNameByParamValsIDs(IDs) {
        var nameToID = [];
        for (const datasetName of selectedDatasetsArray) {
            for (const paramName in datasetsDict[datasetName]) {
                if(paramName == "years") continue;
                for (const unique_param_id of Object.keys(datasetsDict[datasetName][paramName])) {
                    if(IDs.includes(Number(unique_param_id))) {
                        if(nameToID[datasetName] === undefined) nameToID[datasetName] = [unique_param_id];
                        else nameToID[datasetName].push(unique_param_id);
                    }
                }
            }
        }
        return nameToID;
    }
    
    // finds years intersection for both picked datasets
    function getYearsIntersectionForSelectedDatasets() { 
        var min = 3000;
        var max = 0;
        var values = [];
        if(selectedDatasetsArray.length == 0) {
            console.log('powpowpow');
            values = [1990, new Date().getFullYear()];
        }
        if(selectedDatasetsArray.length == 1) {
            min = Math.min(...datasetsDict[selectedDatasetsArray[0]]["years"]);
            max = Math.max(...datasetsDict[selectedDatasetsArray[0]]["years"]);
            values.push(min);
            values.push(max);
        }
        if(selectedDatasetsArray.length == 2) {
            //console.log("FST-YEARS: ", datasetsDict[selectedDatasetsArray[0]]["years"]);
            //console.log("SND-YEARS: ", datasetsDict[selectedDatasetsArray[1]]["years"]);
            min = Math.min(...datasetsDict[selectedDatasetsArray[0]]["years"]);
            max = Math.max(...datasetsDict[selectedDatasetsArray[0]]["years"]);
            if(Math.min(...datasetsDict[selectedDatasetsArray[1]]["years"]) > min) min = Math.min(...datasetsDict[selectedDatasetsArray[1]]["years"]);
            if(Math.max(...datasetsDict[selectedDatasetsArray[1]]["years"]) < max) max = Math.max(...datasetsDict[selectedDatasetsArray[1]]["years"]);
            values.push(min);
            values.push(max);
        }
        setYearRangeForSlider(values);
        return values;
    }
    
    // gets 2 elements in array, first is minimum year and second is maximum year 
    // for datasets' intersetcion and inputs them into html's slider and year
    function setYearRangeForSlider(vals) {
        document.getElementById("myRange").min = vals[0];
        document.getElementById("myRange").max = vals[1];
        document.getElementById("myRange").value = vals[1];
        document.getElementById("sliderYear").innerHTML = vals[1];
    }

    return {
        getSelectedDatasetsParams,
        getYearsIntersectionForSelectedDatasets,
        sendParamsIDsAndYear,
        populateDropdown,
        clearPicked,
        init
    }
    
})();

DropdownModule.init();

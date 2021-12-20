var datasetsDict = {
    "oblubenost jednorozcov":{
        "id": 0,
        "spolu":{
            "1":"spolu"
        },
        "pohlavie":{
            "2":"zena",
            "3":"muz"
        },
        "years":[2020,2019,2018]
    },
    "pocet donasok jedla za rok":{
        "id": 1,
        "spolu":{
            "4":"spolu"
        },
        "vzdelanie":{
            "5":"zakladna skola",
            "6":"stredna skola",
            "7":"vysoka skola"
        }, 
        "years":[2020,2019]
    },
    "Priemerný vek osoby pri úmrtí podľa pohlavia":{
        "id": 2,
        "spolu":{
            "8":"spolu"
        },
        "pohlavie":{
            "9":"zena",
            "10":"muz"
        },
        "years":[2020,2018]
    }
};

var selectedDatasetsArray = [];

function getDatasetNameById(id) {
    for(datasetName in datasetsDict) {
        if(datasetsDict[datasetName].id == id) return datasetName;
    }
    return null;
};


function getSelectedDatasetsParams() {

    console.log("SELECTED DATASETS: " + $("#selectpicker").val());
    selectedDatasetsArray = []
    selectedDatasetsArray = $("#selectpicker").val();

    if(selectedDatasetsArray === null) {
        document.getElementById("selected_dataset0").innerHTML = null;
        document.getElementById("selected_dataset1").innerHTML = null;
        document.getElementById("selected_datasets").style.display = "none";
    }
    else {
        document.getElementById("selected_dataset0").innerHTML = selectedDatasetsArray[0];
        if(selectedDatasetsArray.length == 1) {
            document.getElementById("selected_dataset1").innerHTML = null;
        }
        else {
            document.getElementById("selected_dataset1").innerHTML = selectedDatasetsArray[1];
        }
        document.getElementById("selected_datasets").style.display = "block";
    }
    for(const d_name of selectedDatasetsArray) showParameters(d_name);
};


var uniqueIDs = [];
//shows parameters on dropdown when dataset is picked
function showParameters(dataset_name) {
    //document.getElementById("selected_datasets_with_parameters").innerHTML = '';
    for (const param_name of Object.keys(datasetsDict[dataset_name])) {
        if(param_name != "id" && param_name != "years") {
            document.getElementById("selected_datasets_with_parameters").innerHTML += '<div class="param_name" style="width:200px;"> '+ param_name +'</div><br>';
            for(const id of Object.keys(datasetsDict[dataset_name][param_name])) {
                console.log("--->" + param_name + " : " + id + " , " + datasetsDict[dataset_name][param_name][id]);
                if(!uniqueIDs.includes(id)) {
                    document.getElementById("selected_datasets_with_parameters").innerHTML += '<div class="pretty p-svg p-plain" id="unique_'+
                    id +'" style="margin: 0.5em;"><input type="checkbox" /><div class="state"><img class="svg" src="/svg/task.svg"><label>'+ 
                    datasetsDict[dataset_name][param_name][id] +'</label></div></div><br>';
                    uniqueIDs.push(id);
                }
            }
        }
    }
    
};

// returns IDs and YEARS of given dataset by its name
function getIDsAndYears(d_name) {
    var IDs = [];
    var years = datasetsDict[d_name].years;
    for (const param_name of Object.keys(datasetsDict[d_name])) {
        if(param_name != "years" && param_name != "id") {
            for(const id of Object.keys(datasetsDict[d_name][param_name])) IDs.push(id);
        };
    }
    console.log("getIDsAndYears(d_name) YEARS : "  + years);
    console.log("getIDsAndYears(d_name) IDs : "  + IDs);
    return {"IDs":IDs, "years":years}
}
let datasetsNameList = [
    {
        "id"   : 0,
        "d_name" : "Počet obyvateľov podľa pohlavia",
        "link" : "http://datacube.statistics.sk/#!/view/sk/VBD_DEM/om7102rr/v_om7102rr_00_00_00_sk",
        "params":["muž", "žena", "útočná helikoptéra"],
    },
    {
        "id"   : 1,
        "d_name" : "Živonarodení podľa poradia",
        "link" : "http://datacube.statistics.sk/#!/view/sk/VBD_DEM/om7029rr/v_om7029rr_00_00_00_sk",
        "params": ["prvý", "druhý", "tretí"],
    },
    {
        "id"   : 2,
        "d_name" : "Priemerný vek osoby pri úmrtí podľa pohlavia",
        "link" : "http://datacube.statistics.sk/#!/view/sk/VBD_DEM/om7038rr/v_om7038rr_00_00_00_sk",
        "params": ["63", "74"],
    },
    
];
let parameters = ["param1", "param2", "param3", "param4"];

var selectedDatasetsArray = [];

function getDatasetName(id) {
    if(datasetsNameList[id]["d_name"] === undefined) return;
    return datasetsNameList[id]["d_name"];
}

function getDatasetsParamsYear() {

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
    
    showParameters();
}

// parameters array is temp, I can't make datasetsNameList["params"] iterable
// TODO:
function showParameters(dataset_name) {

    for (const dataset of datasetsNameList) {
        if(dataset["d_name"] == dataset_name) {
            console.log(typeof dataset["params"] + "----> " + dataset["params"]);

            for(const param of parameters) {
                document.getElementById("all_params").innerHTML +='<div class="pretty p-svg p-plain" style="margin: 0.5em;"><input type="checkbox" /><div class="state"><img class="svg" src="/svg/task.svg"><label>'+ param +'</label></div></div>';
            }
        }
    }
    
}

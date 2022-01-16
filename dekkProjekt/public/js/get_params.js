function getParams(dataset_id) {
    // send request to backend if 2 datasets are selected
    xmlHttp = new XMLHttpRequest();

    url = 'http://localhost:8000/params/' + dataset_id;

    console.log(url);

    xmlHttp.onreadystatechange = onResponse;
    xmlHttp.open("GET", url);
    xmlHttp.send();

}


function onResponse() {
    // handles response
    if(xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        // document.getElementById('odpoved').innerHTML = xmlHttp.responseText;

        bu = JSON.parse(xmlHttp.responseText);
        console.log(bu[0].name);
    }
}
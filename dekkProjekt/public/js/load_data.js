
function sendRequest() {

    xmlHttp = new XMLHttpRequest();

    id1 = document.getElementById("checkData1");
    id2 = document.getElementById("checkData2");

    if (id1.checked && id2.checked) {

        url = "/loadData/" + id1.id.replace("checkData", "") + "/" + id2.id.replace("checkData", "");
        console.log(url);
        xmlHttp.onreadystatechange = onResponse;
        xmlHttp.open("GET", url);
        xmlHttp.send();
    }
}


function onResponse() {
    if(xmlHttp.readyState == 4 && xmlHttp.status == 200)   {
        document.getElementById('odpoved').innerHTML = xmlHttp.responseText;
        console.log('naspaky odpoved');
    }
}
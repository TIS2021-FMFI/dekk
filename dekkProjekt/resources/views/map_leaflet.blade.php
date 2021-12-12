<!DOCTYPE html>
<html>
<head>
    <title>dekk projekt</title>

    <meta charset="utf-8" />
    
    <!-- load leaflet.js -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js" integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==" crossorigin=""></script>

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <
    <style>
    #map { 
			height: 400px;
		} 

    .info {
        padding: 6px 8px;
        font: 14px/16px Arial, Helvetica, sans-serif;
        background: white;
        background: rgba(255,255,255,0.8);
        box-shadow: 0 0 15px rgba(0,0,0,0.2);
        border-radius: 5px;
    }

    .info h4 {
        margin: 0 0 5px;
        color: #777;
    }

    .legend {
        line-height: 18px;
        color: #555;
    }

    .legend i {
        width: 18px;
        height: 18px;
        float: left;
        margin-right: 8px;
        opacity: 0.7;
    }

    </style>

    <!-- Load d3.js -->
    <script src="https://d3js.org/d3.v6.js"></script>
    <script src="js/scripts.js"></script>
    <!-- The code uses small FileSaver.js library to save generated images and Canvas-to-Blob.js library to ensure browser compatibility. -->
    <script src="https://cdn.rawgit.com/eligrey/canvas-toBlob.js/f1a01896135ab378aa5c0118eadd81da55e698d8/canvas-toBlob.js"></script>
    <script src="https://cdn.rawgit.com/eligrey/FileSaver.js/e9d941381475b5df8b7d7691013401e171014e89/FileSaver.min.js"></script>
    <!-- Load save btn script -->
    <script src="js/save_btn.js"></script>
</head>

<body>

<div class="row">
    <div class="col-md-2">
        <label class="container">One
        <input type="checkbox" id="checkData1">
        </label>

        <label class="container">Two
        <input type="checkbox" id="checkData2">
        </label>
    <button type="button" onclick="sendRequest()">Click Me!</button> 
    </div>

    <div class="col-md-6" id='map'></div>
    <div class="col-md-4" id="odpoved"></div>
</div> 


@foreach($dataset_types as $dataset_type)

<div class="row">
    <div>
      <button type="button" onclick="getParams({{ $dataset_type->id }})">{{ $dataset_type->name }}</button>

    </div>
</div>

@endforeach

<!-- Save button Map -->
<div>
    <button id='saveButtonMap'>Download map</button>
</div>

<!-- Create a div where the graph will take place -->
<div id="my_dataviz3">
  <h1>Interactive grouped demo</h1>
</div>

<!-- Save button Graph -->
<div>
    <button id='saveButtonGraph'>Download graph</button>
</div>

<script type="text/javascript" src="js/okresy.js"></script>
<script src="js/load_data.js"></script>

<script type="text/javascript">
    // Leaflet map init
	var map = L.map('map').setView([48.6, 19.5 ], 7);
    geojson = L.geoJson(okresy, {
        style: style
    }).addTo(map);
    
    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        id: 'tileset',
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

    // D3 graph init
    interactive_grouped();

    // save btn init map width 970 heigth 400
    save_to_img('map', d3.select('#map').select("svg").node(), '#saveButtonMap', 970, 400)
    // save btn init graph width 370 height 360
    save_to_img('graph', d3.select("#my_dataviz3").select("svg").node(), '#saveButtonGraph', 370, 360);
</script>
<script src="js/get_params.js"></script> 
</body>
</html>

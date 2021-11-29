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



<!-- Create a div where the graph will take place -->
<div id="my_dataviz3">
  <h1>Interactive grouped demo</h1>
</div>

<!-- Save button -->
<div>
    <button id='saveButton'>Export my D3 visualization to PNG</button>
</div>

<script type="text/javascript" src="js/okresy.js"></script>

<script type="text/javascript">
    // Leaflet map init
	var map = L.map('map').setView([48.6, 19.5 ], 7);
    geojson = L.geoJson(okresy).addTo(map);
    
    // D3 graph init
    interactive_grouped();

    // save btn init
    save_to_img();
</script>
<script src="js/load_data.js"></script>
<script src="js/get_params.js"></script> 
</body>
</html>
© 2021 GitHub, Inc.
Terms
Privacy
Security
Status
Docs
Contact GitHub
Pricing
API
Training
Blog
About

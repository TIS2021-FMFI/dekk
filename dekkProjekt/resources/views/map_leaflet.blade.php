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
<div id="my_dataviz1">
  <h1>Basic demo</h1>
</div>

<div id="my_dataviz2">
  <h1>Basic demo with tooltips</h1>
</div>

<div id="my_dataviz3">
  <h1>Interactive grouped demo</h1>
</div>

<script type="text/javascript" src="js/okresy.js"></script>

<script type="text/javascript">
    // Leaflet map init
	var map = L.map('map').setView([48.6, 19.5 ], 7);
    geojson = L.geoJson(okresy).addTo(map);
    
    // D3 graphs init

    basic();
    basic_with_tooltips();  
    interactive_grouped();
</script>
<script src="js/load_data.js"></script>
<script src="js/get_params.js"></script> 
</body>
</html>
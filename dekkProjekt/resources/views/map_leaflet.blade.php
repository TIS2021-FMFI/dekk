<!DOCTYPE html>
<html>

<head>
    <title>DEKK Projekt</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- load leaflet.js -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossorigin="" />
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
        integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
        crossorigin=""></script>

    <!-- other stylesheets -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="css/app.css" />

    <!-- Load d3.js -->
    <script src="https://d3js.org/d3.v6.js"></script>
    
    <!-- Singleton module responsible for the graph functionality -->
    <script src="js/d3_graph_module.js"></script>

    <!-- Singleton module responsible for the map functionality -->
    <script src="js/leaflet_map_module.js"></script>

    <!-- The code uses small FileSaver.js library to save generated images and Canvas-to-Blob.js library to ensure browser compatibility. -->
    <script
        src="https://cdn.rawgit.com/eligrey/canvas-toBlob.js/f1a01896135ab378aa5c0118eadd81da55e698d8/canvas-toBlob.js">
    </script>
    <script src="https://cdn.rawgit.com/eligrey/FileSaver.js/e9d941381475b5df8b7d7691013401e171014e89/FileSaver.min.js">
    </script>

    <!-- Load save btn script -->
    <script src="js/save_btn.js"></script>

    <!-- For dropdown multiselect picklist with search (selectpicker) -->
    <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.13.1/css/bootstrap-select.css" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.13.1/js/bootstrap-select.min.js"></script>

    <!-- Color picker script -->
    <script src="js/iro.min.js"></script>

    <!-- Leaflet pip(point in polygon) used to propagate mouse events to all layers of the map -->
    <script src='https://unpkg.com/@mapbox/leaflet-pip@latest/leaflet-pip.js'></script>
   
    <style>

    #map { 
			height: 600px;
	}

    .info, .info2 {
        padding: 6px 8px;
        font: 14px/16px Arial, Helvetica, sans-serif;
        background: white;
        color: #777;
        background: rgba(255,255,255,0.8);
        box-shadow: 0 0 15px rgba(0,0,0,0.2);
        border-radius: 5px;
    }

    .info h4, .info2 h4 {
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
</head>

<body>
    <div class="container-fluid">
        <div class="row">
            <div class="col-xl-3 col-lg-12" id="sidePanel">
                <div>
                    <!-- class="subPanel" -->
                    <h3>Datasety a parametre:</h3>
                    <div class="datasets_parameters">

                        <!--multichoice picker with search, NOT WORKING YET! -->
                        <select class="selectpicker" multiple data-live-search="true">
                            <?php for($i=1; $i<3; $i++) :?>
                            <option><?=$i?><label class="container" id="checkData<?=$i?>"></label></option>
                            <?php endfor;?>
                        </select>

                        <?php for($i=1; $i<3; $i++) :?>
                        <label class="container">
                            <input type="checkbox" id="checkData<?=$i?>"> checkData<?=$i?>
                        </label>
                        <?php endfor;?>
                    </div>
                </div>

                <!-- Slider (value needed for year pick) -->
                <div class="slidercontainer">
                    <h3>Rok: <span id="sliderYear"></span></h3>
                    <input type="range" min="1990" max="2020" value="2005" class="slider" id="myRange">

                    <script>
                    var slider = document.getElementById("myRange");
                    var output = document.getElementById("sliderYear");
                    output.innerHTML = slider.value;
                    slider.oninput = function() {
                        output.innerHTML = this.value;
                    }
                    </script>
                </div>

                <!-- Send requested datasets -->
                <button type="button" class="btn btn-dark" onclick="getParamsAndValues()">Obnoviť</button>
            </div>

            <!-- Map -->
            <div class="col-xl-5 col-lg-12">
                <div id='map'></div>
                <div class="row">

                    <div class="col-xl-6 col-lg-6">
                        <div class="picker1" id="picker1">
                            <script>
                            var colorPicker1 = new iro.ColorPicker('#picker1', {
                                width: 150,
                                color: "#fff",
                                layout: [{
                                    component: iro.ui.Wheel,
                                    options: {}
                                }, ]
                            });
                            </script>
                        </div>
                    </div>

                    <div class="col-xl-6 col-lg-6">
                        <div class="picker2" id="picker2">
                            <script>
                            var colorPicker2 = new iro.ColorPicker('#picker2', {
                                width: 150,
                                color: "#fff",
                                layout: [{
                                    component: iro.ui.Wheel,
                                    options: {}
                                }, ]
                            });
                            </script>
                        </div>
                    </div>
                </div>
            </div>

            <!-- BEFORE : <div class="col-md-4" id="odpoved"></div> -->
            <div class="col-xl-4 col-lg-12" id="sidePanel">
                <!-- Graph -->
                <div id="my_dataviz3">
                    <h3>Graf korelácie</h3>
                </div>
                <div class="correlation_meaning">
                    <p">Korelačný koeficient je <a class="red"
                            href="https://sk.wikipedia.org/wiki/Korelácia_(štatistika)" id="correlation_coefficient"> 0.64 </a> a hovorí nám...</p>
                </div>
                <!-- Graph save button -->
                <button id='saveButtonGraph' type="button" class="btn btn-dark">Stiahnuť PNG grafu</button>
                <!-- Map save button -->
                <button id='saveButtonMap' type="button" class="btn btn-dark">Stiahnuť PNG mapy</button>
            </div>
        </div>
    </div>



    @foreach($dataset_types as $dataset_type)
    <div class="row">
        <div>
            <button type="button" class="btn btn-dark"
                onclick="getParams({{ $dataset_type->id }})">{{ $dataset_type->name }}</button>
        </div>
    </div>
    @endforeach


<script type="text/javascript" src="js/okresy.js"></script>
<script src="js/load_data.js"></script>

<script type="text/javascript">
    MapModule.init();
    GraphModule.init();
    // save btn init map width 970 heigth 600
    let mapDiv = document.querySelector('#map');
    save_to_img('map', '#saveButtonMap', 770, 720);
    let graphDiv = document.querySelector('#my_dataviz3');
    // save btn init graph width 370 height 360
    save_to_img('graph', '#saveButtonGraph', 370, 360);
</script>
<script src="js/get_params.js"></script> 

</body>

</html>